/* eslint-disable no-unused-vars */
/* eslint-disable max-params */
// Code from Antimatter Dimensions

import Decimal from "break_infinity.js";
// eslint-disable-next-line no-duplicate-imports
import type { DecimalSource } from "break_infinity.js";

abstract class Notation {
  public abstract get name(): string;

  public get infinite(): string {
    return "Infinite";
  }

  public format(
    value: DecimalSource, places: number = 0, placesUnder1000: number = 0,
    placesExponent: number = places
  ): string {
    if (typeof value === "number" && !Number.isFinite(value)) {
      return this.infinite;
    }

    const decimal = Decimal.fromValue_noAlloc(value);

    if (decimal.exponent < -300) {
      return decimal.sign() < 0
        ? this.formatVerySmallNegativeDecimal(decimal.abs(), placesUnder1000)
        : this.formatVerySmallDecimal(decimal, placesUnder1000);
    }

    if (decimal.exponent < 3) {
      const number = decimal.toNumber();
      return number < 0
        ? this.formatNegativeUnder1000(Math.abs(number), placesUnder1000)
        : this.formatUnder1000(number, placesUnder1000);
    }

    return decimal.sign() < 0
      ? this.formatNegativeDecimal(decimal.abs(), places, placesExponent)
      : this.formatDecimal(decimal, places, placesExponent);
  }

  public formatVerySmallNegativeDecimal(value: Decimal, places: number): string {
    return `-${this.formatVerySmallDecimal(value, places)}`;
  }

  public formatVerySmallDecimal(value: Decimal, places: number): string {
    // We switch to very small formatting as soon as 1e-300 due to precision loss,
    // so value.toNumber() might not be zero.
    return this.formatUnder1000(value.toNumber(), places);
  }

  public formatNegativeUnder1000(value: number, places: number): string {
    return `-${this.formatUnder1000(value, places)}`;
  }

  public formatUnder1000(value: number, places: number): string {
    return value.toFixed(places);
  }

  public formatNegativeDecimal(value: Decimal, places: number, placesExponent: number): string {
    return `-${this.formatDecimal(value, places, placesExponent)}`;
  }

  public abstract formatDecimal(value: Decimal, places: number, placesExponent: number): string;

  protected formatExponent(
    exponent: number, precision: number = 3,
    specialFormat: (n: number, p: number) => string = ((n, _) => n.toString()),
    largeExponentPrecision: number = Math.max(2, precision)
  ): string {
    return specialFormat(exponent, Math.max(precision, 1));
  }
}

export function isExponentFullyShown(exponent: number): boolean {
  return true;
}

// The whole thing where we first format the mantissa, then check if we needed to is from the edge case of
// 9.999e99999 with a 100000 exponent threshold; formatting the mantissa rounds and pushes the exponent
// to the threshold, meaning in some cases that the exponent will have its own exponent and that we don't
// want to show the mantissa.
export function formatMantissaWithExponent(mantissaFormatting: (n: number, precision: number) => string,
  exponentFormatting: (n: number, precision: number) => string, base: number, steps: number,
  mantissaFormattingIfExponentIsFormatted?: (n: number, precision: number) => string,
  separator: string = "e", forcePositiveExponent: boolean = false):
((n: Decimal, precision: number, precisionExponent: number) => string) {
  return function(n: Decimal, precision: number, precisionExponent: number): string {
    const realBase = base ** steps;
    let exponent = Math.floor(n.log(realBase)) * steps;
    if (forcePositiveExponent) {
      exponent = Math.max(exponent, 0);
    }
    let mantissa = n.div(Decimal.pow(base, exponent)).toNumber();
    // The conditional !(1 <= mantissa && mantissa < realBase)
    // should be true only rarely, due to precision bugs
    // e.g. 0.8e1e15 has log which rounds to 1e15, but exponent should be 1e15 - 1
    // Edge cases are possible, of two types:
    // mantissa ends up at 0.999..., it is formatted as 1 and it's OK.
    // mantissa ends up at realBase + 0.000...1, it is formatted as base and then
    // the thing checking for it being formatted in that way steps in.
    // I think this always ends up pretty close to accurate though, with
    // inaccurancy being something like (realBase^(1e-16 * Math.log10(mantissa))).
    // mantissa should be at most roughly 10 so this is pretty small.
    // IDK if using Math.log or Math.log10 is faster.
    if (!(mantissa >= 1 && mantissa < realBase)) {
      const adjust = Math.floor(Math.log(mantissa) / Math.log(realBase));
      mantissa /= Math.pow(realBase, adjust);
      exponent += steps * adjust;
    }
    let m = mantissaFormatting(mantissa, precision);
    if (m === mantissaFormatting(realBase, precision)) {
      m = mantissaFormatting(1, precision);
      exponent += steps;
    }
    // This can happen in some cases with a high exponent (either due to high real base or high steps).
    if (exponent === 0) {
      return m;
    }
    // Note that with typical exponentFormatting being this.formatExponent.bind(this),
    // this will use at least precision 2 on the exponent if relevant, due to the default
    // value of largeExponentPrecision: number = Math.max(2, precision) in formatExponent.
    const e = exponentFormatting(exponent, precisionExponent);
    if (typeof mantissaFormattingIfExponentIsFormatted !== "undefined" && !isExponentFullyShown(exponent)) {
      // No need to do a second check for roll-over.
      m = mantissaFormattingIfExponentIsFormatted(mantissa, precision);
    }
    return `${m}${separator}${e}`;
  };
}

export function formatMantissaBaseTen(n: number, precision: number): string {
  // Note: .toFixed may throw RangeError for precision < 0, according to MDN.
  // So, because we want to use -1 as a sentinal undefined value, we make sure
  // that we're not in that case.
  return n.toFixed(Math.max(0, precision));
}

export class ScientificNotation extends Notation {
  public get name(): string {
    return "Scientific";
  }

  public formatDecimal(value: Decimal, places: number, placesExponent: number): string {
    return formatMantissaWithExponent(formatMantissaBaseTen, this.formatExponent.bind(this),
      10, 1, (x, _) => formatMantissaBaseTen(x, 0)
    )(value, places, placesExponent);
  }
}

const commaRegexp = /\B(?=(\d{3})+(?!\d))/gu;
export const formatWithCommas = function formatWithCommas(value: string) {
  const decimalPointSplit = value.toString().split(".");
  decimalPointSplit[0] = decimalPointSplit[0].replace(commaRegexp, ",");
  return decimalPointSplit.join(".");
};

export const formatInt = (value: number | Decimal) =>
  formatWithCommas(typeof value === "number" ? value.toFixed(0) : value.toNumber().toFixed(0));