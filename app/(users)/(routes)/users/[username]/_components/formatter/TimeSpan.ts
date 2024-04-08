import { formatInt, ScientificNotation } from "./format";

const Formatter = new ScientificNotation();

export class TimeSpan {
  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromYears(value: number): TimeSpan {
    return new TimeSpan(value * 31536e6);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromDays(value: number): TimeSpan {
    return new TimeSpan(value * 864e5);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromHours(value: number): TimeSpan {
    return new TimeSpan(value * 36e5);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromMinutes(value: number): TimeSpan {
    return new TimeSpan(value * 6e4);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromSeconds(value: number): TimeSpan {
    return new TimeSpan(value * 1e3);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromMilliseconds(value: number): TimeSpan {
    return new TimeSpan(value);
  }

  _ms: number;

  /**
   * @param {Number} ms
   */
  constructor(ms: number) {
    Guard.isNumber(ms, "Value 'ms' must be a number");
    this._ms = ms;
  }

  /**
   * @param {TimeSpan} other
   */
  copyFrom(other: TimeSpan) {
    Guard.isTimeSpan(other);
    this._ms = other._ms;
  }

  /**
   * @param {Number} ms
   */
  setFrom(ms: number) {
    Guard.isNumber(ms);
    this._ms = ms;
  }

  /**
   * @returns {Number}
   */
  get years(): number {
    return Math.floor(this.totalYears);
  }

  /**
   * @returns {Number}
   */
  get days(): number {
    return Math.floor(this.totalDays % 365);
  }

  /**
   * @returns {Number}
   */
  get hours(): number {
    return Math.floor(this.totalHours % 24);
  }

  /**
   * @returns {Number}
   */
  get minutes(): number {
    return Math.floor(this.totalMinutes % 60);
  }

  /**
   * @returns {Number}
   */
  get seconds(): number {
    return Math.floor(this.totalSeconds % 60);
  }

  /**
   * @returns {Number}
   */
  get milliseconds(): number {
    return Math.floor(this.totalMilliseconds % 1e3);
  }

  /**
   * @returns {Number}
   */
  get totalYears(): number {
    return this._ms / 31536e6;
  }

  /**
   * @returns {Number}
   */
  get totalDays(): number {
    return this._ms / 864e5;
  }

  /**
   * @returns {Number}
   */
  get totalHours(): number {
    return this._ms / 36e5;
  }

  /**
   * @returns {Number}
   */
  get totalMinutes(): number {
    return this._ms / 6e4;
  }

  /**
   * @returns {Number}
   */
  get totalSeconds(): number {
    return this._ms / 1e3;
  }

  /**
   * @returns {Number}
   */
  get totalMilliseconds(): number {
    return this._ms;
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  plus(other: TimeSpan): TimeSpan {
    Guard.isTimeSpan(other);
    return new TimeSpan(this._ms + other._ms);
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  minus(other: TimeSpan): TimeSpan {
    Guard.isTimeSpan(other);
    return new TimeSpan(this._ms - other._ms);
  }

  /**
   * @param {Number} other
   * @returns {TimeSpan}
   */
  times(other: number): TimeSpan {
    Guard.isNumber(other);
    return new TimeSpan(this._ms * other);
  }

  /**
   * @param {Number} other
   * @returns {TimeSpan}
   */
  dividedBy(other: number): TimeSpan {
    Guard.isNumber(other);
    return new TimeSpan(this._ms / other);
  }

  /**
   * @returns {String}
   */
  toString(): string {
    if (this.years > 1e6) {
      return `${Formatter.format(this.totalYears, 3, 0)} years`;
    }
    if (this.totalSeconds >= 10) {
      return this.toStringNoDecimals();
    }
    return this.toStringShort();
  }

  /**
   * @returns {String}
   */
  toStringNoDecimals(): string {
    const parts: Array<string> = [];
    function addCheckedComponent(value: number, name: string) {
      if (value === 0) {
        return;
      }
      addComponent(value, name);
    }
    function addComponent(value: number, name: string) {
      parts.push(value === 1 ? `${formatInt(value)} ${name}` : `${formatInt(value)} ${name}s`);
    }
    addCheckedComponent(this.years, "year");
    addCheckedComponent(this.days, "day");
    addCheckedComponent(this.hours, "hour");
    addCheckedComponent(this.minutes, "minute");
    addCheckedComponent(this.seconds, "second");
    // Join with commas and 'and' in the end.
    if (parts.length === 0) return `${formatInt(0)} seconds`;
    return [parts.slice(0, -1).join(", "), parts.slice(-1)[0]].join(parts.length < 2 ? "" : " and ");
  }

  /**
   * Note: For speedruns, we give 3 digits of hours on HMS formatting, a decimal point on seconds, and
   *  suppress END formatting on the speedrun record tabs
   * @param {boolean} useHMS If true, will display times as HH:MM:SS in between a minute and 100 hours.
   * @returns {String}
   */
  toStringShort(useHMS: boolean = true, isSpeedrun = false): string {
    // Probably not worth the trouble of importing the isEND function from formatting since this accomplishes the same
    // thing; we do however need this to prevent strings like "02:32" from showing up though
    if (Formatter.format(0) === "END" && !isSpeedrun) return "END";

    const totalSeconds = this.totalSeconds;
    if (totalSeconds > 5e-7 && totalSeconds < 1e-3) {
      // This conditional happens when when the time is less than 1 millisecond
      // but big enough not to round to 0 with 3 decimal places (so showing decimal places
      // won't just show 0 and waste space).
      return `${Formatter.format(1000 * totalSeconds, 0, 3)} ms`;
    }
    if (totalSeconds < 1) {
      // This catches all the cases when totalSeconds is less than 1 but not
      // between 5e-7 and 1e-3. This includes two types of cases:
      // (1) those less than or equal to 5e-7, which most notations will format as 0
      // (the most notable case of this kind is 0 itself).
      // (2) those greater than or equal to 1e-3, which will be formatted with default settings
      // (for most notations, rounding to the nearest integer number of milliseconds)
      return `${Formatter.format(1000 * totalSeconds)} ms`;
    }
    if (totalSeconds < 10) {
      return `${Formatter.format(totalSeconds, 0, 3)} seconds`;
    }
    if (totalSeconds < 60) {
      return `${Formatter.format(totalSeconds, 0, 2)} seconds`;
    }
    if (this.totalHours < 100) {
      if (useHMS) {
        const sec = seconds(this.seconds, this.milliseconds);
        if (Math.floor(this.totalHours) === 0) return `${formatHMS(this.minutes)}:${sec}`;
        return `${formatHMS(Math.floor(this.totalHours))}:${formatHMS(this.minutes)}:${sec}`;
      }
    }
    if (this.totalDays < 500) {
      return `${isSpeedrun ? this.totalDays.toFixed(2) : Formatter.format(this.totalDays, 0, 2)} days`;
    }
    return `${isSpeedrun ? this.totalYears.toFixed(3) : Formatter.format(this.totalYears, 3, 2)} years`;

    function formatHMS(value: number) {
      const s = value.toString();
      return s.length === 1 ? `0${s}` : s;
    }

    function seconds(s: number, ms: number) {
      const sec = formatHMS(s);
      return isSpeedrun ? `${sec}.${Math.floor(ms / 100)}` : sec;
    }
  }

  // ToTimeEstimate() {
  //   const seconds = this.totalSeconds;
  //   if (seconds < 1) return `< ${formatInt(1)} second`;
  //   if (seconds > 86400 * 365.25) return `> ${formatInt(1)} year`;
  //   return this.toStringShort();
  // }

  static get zero() {
    return new TimeSpan(0);
  }

  static get maxValue() {
    return new TimeSpan(Number.MAX_VALUE);
  }

  static get minValue() {
    return new TimeSpan(Number.MIN_VALUE);
  }
};

export const Guard = {
  isDefined(value: unknown, message?: string) {
    if (value !== undefined) return;
    if (message) throw message;
    throw "Value is defined";
  },
  isNumber(value: unknown, message?: string) {
    if (typeof value === "number") return;
    if (message) throw message;
    throw "Value is not a number";
  },
  isTimeSpan(value: unknown, message?: string) {
    if (value instanceof TimeSpan) return;
    if (message) throw message;
    throw "Value is not a TimeSpan";
  }
};