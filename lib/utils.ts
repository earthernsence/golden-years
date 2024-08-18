import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line no-shadow
export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType>
  ? ElementType
  : never

// Most code from Antimatter Dimensions

const pluralDatabase = new Map<string, string>([]);

// Some letters in the english language pluralize in a different manner than simply adding an 's' to the end.
// As such, the regex match should be placed in the first location, followed by the desired string it
// should be replaced with. Note that $ refers to the EndOfLine for regex, and should be included if the plural occurs
// at the end of the string provided, which will be 99% of times. Not including it is highly likely to cause mistakes,
// as it will select the first instance that matches and replace that.
const PLURAL_HELPER = new Map([
  [/y$/u, "ies"],
  [/$/u, "s"]
]);

function isSingular(amount: number) {
  if (typeof amount === "number") return amount === 1;
  throw `Amount must be either a number or Decimal. Instead, amount was ${amount}`;
};

export function pluralise(word: string, amount: number): string {
  if (word === undefined || amount === undefined) throw "Arguments must be defined";

  if (isSingular(amount)) return word;
  const existingPlural = pluralDatabase.get(word);
  if (existingPlural !== undefined) return existingPlural;

  const newWord = generatePlural(word);
  pluralDatabase.set(word, newWord);
  return newWord;
}

function generatePlural(word: string) {
  for (const [match, replaceWith] of PLURAL_HELPER.entries()) {
    const newWord = word.replace(match, replaceWith);
    if (word !== newWord) return newWord;
  }
  return word;
};

export function quantify(word: string, amount: number): string {
  const pluralised = pluralise(word, amount);
  return `${amount.toFixed(2)} ${pluralised}`;
}