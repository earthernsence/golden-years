// Direct inspiration from AD's compression code.
// https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/master/src/core/storage/serializer.js

import pako from "pako";

// Not dealing with it
/* eslint-disable no-unused-vars */
type CompressionSteps = Array<{
  encode: (x: any, type: string) => any;
  decode: (x: any, type: string) => any;
  condition?: (version: string) => boolean;
} | {
  encode: (x: any) => any;
  decode: (x: any) => any;
  condition?: (version: string) => boolean;
}>;

interface IDataCompressor {
  serialise: (data: string) => string;
  deserialise: (data: string) => string;
  encoder: TextEncoder;
  decoder: TextDecoder;
  startingString: Record<string, string>;
  endingString: Record<string, string>;
  version: string;
  steps: CompressionSteps;
  getSteps: (type: string, version: string) => CompressionSteps;
  encodeText: (data: string, type: string) => string;
  decodeText: (data: string, type: string) => string;
}
/* eslint-enable no-unused-vars */

export const DataCompressor: IDataCompressor = {
  serialise(data: string): string {
    const json = JSON.stringify(data);
    return this.encodeText(json, "article");
  },
  deserialise(data: string): string {
    try {
      const json = this.decodeText(data, "article");
      return JSON.parse(json);
    } catch (e) {
      throw new Error("Failed to deserialise data");
    }
  },
  // Define these now so we don't keep creating new ones, which vaguely seems bad.
  encoder: new TextEncoder(),
  decoder: new TextDecoder(),
  // These are magic strings that articles should start with.
  startingString: {
    article: "GoldenYearsArticleFormat",
  },
  // The ending strings aren't; as verbose so that we can save a little space.
  endingString: {
    article: "EndOfArticle"
  },
  // This shoudl always be three characters long, and should ideally go AAA, AAB, AAC, etc.
  // so that we can do inequality tests on it to compare versions (though skipping a version
  // shouldn't be a problem).
  version: "AAA",
  // Steps are given in encoding order
  steps: [
    // This step transforms data into unsigned 8-bit arrays, as pako requires.
    {
      encode: (x: string) => DataCompressor.encoder.encode(x),
      decode: (x: AllowSharedBufferSource) => DataCompressor.decoder.decode(x)
    },
    // This step is where the compression actually happens. The pako library works with unsigned 8-bit arrays.
    {
      encode: (x: Uint8Array) => pako.deflate(x),
      decode: (x: Uint8Array) => pako.inflate(x)
    },
    // This step converts from unsigned 8-bit arrays to strings with codepoints less than 256.
    // We need to do this outselves because DataCompressor.decoder would give us unicode sometimes.
    {
      encode: (x: Uint8Array) => Array.from(x).map(i => String.fromCharCode(i)).join(""),
      decode: (x: string) => Uint8Array.from(Array.from(x).map(i => i.charCodeAt(0)))
    },
    // This step makes the characters in the data printable. At this point in the process, all characters
    // will already have codepoints less than 256 (from the previous step), so emoji in the moriginal data
    // won't break this.
    {
      encode: (x: string) => btoa(x),
      decode: (x: string) => atob(x)
    },
    // This step removes + and /, because if they occur, you can double-click on some data and get
    // everything up to the first + or /, which can be hard to debug. We also remove = (always trailing)
    // because btoa just ignores it. These regex have no potentially-unicode characters, I think,
    // and they're applied to strings with just ASCII anyway, but I'm adding u to make ESLint happy.
    {
      encode: (x: string) => x.replace(/=+$/gu, "").replace(/0/gu, "0a").replace(/\+/gu, "0b").replace(/\//gu, "0c"),
      decode: (x: string) => x.replace(/0b/gu, "+").replace(/0c/gu, "/").replace(/0a/gu, "0")
    },
    {
      encode: (x: string, type: string) => x + DataCompressor.endingString[type],
      decode: (x: string, type: string) => x.slice(0, x.length - DataCompressor.endingString[type].length)
    }
  ],
  getSteps(type: string, version: string): CompressionSteps {
    // This is a version marker, as well as indicating to players that this is from GY
    // and whether it's an article or something else. We can change the last three letters
    // of the string data starts with from AAA to something else,
    // if we want a new version of data encoding.
    return this.steps.filter(i => (!i.condition) || i.condition(version)).concat({
      encode: (x: string) => `${DataCompressor.startingString[type] + DataCompressor.version}${x}`,
      decode: (x: string) => x.slice(DataCompressor.startingString[type].length + 3)
    });
  },
  // Apply each step's encode function in encoding order.
  encodeText(data: string, type: string = "article"): string {
    return this.getSteps(type, this.version).reduce((acc, step) => step.encode(acc, type), data);
  },
  // Apply each step's decode function, in decoding order (which is the reverse
  // of encoding order). We only do this if we recognize the string which tells
  // us the save version. If we don't see it, we assume the data's old and just
  // use atob. If you're adding a new data type version, make sure its length is
  // three characters and alter the encoding/decoding functions as is described
  // in the comment above the definition of steps.
  decodeText(text: string, type: string) {
    if (text.startsWith(this.startingString[type])) {
      const len = this.startingString[type].length;
      const version = text.slice(len, len + 3);
      return this.getSteps(type, version).reduceRight((acc, step) => step.decode(acc, type), text);
    }
    return atob(text);
  }
};
