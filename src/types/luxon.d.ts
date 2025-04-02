declare module 'luxon' {
  export class DateTime {
    static fromJSDate(date: Date): DateTime;
    static fromISO(text: string, options?: object): DateTime;
    static fromFormat(text: string, format: string, options?: object): DateTime;
    static now(): DateTime;
    static local(): DateTime;
    
    toJSDate(): Date;
    toISO(): string;
    toFormat(format: string): string;
    toSeconds(): number;
    toMillis(): number;
    
    plus(duration: object | Duration): DateTime;
    minus(duration: object | Duration): DateTime;
    
    get year(): number;
    get month(): number;
    get day(): number;
    get hour(): number;
    get minute(): number;
    get second(): number;
    get weekday(): number;
    
    setZone(zone: string): DateTime;
    
    toLocal(): DateTime;
    toUTC(): DateTime;
    
    startOf(unit: string): DateTime;
    endOf(unit: string): DateTime;
    
    diff(other: DateTime): Duration;
    
    isValid: boolean;
    invalidReason?: string;
  }
  
  export class Duration {
    static fromObject(obj: object): Duration;
    static fromISO(text: string): Duration;
    static fromMillis(ms: number): Duration;
    
    toObject(): object;
    toISO(): string;
    toMillis(): number;
    toFormat(format: string): string;
    
    get years(): number;
    get months(): number;
    get days(): number;
    get hours(): number;
    get minutes(): number;
    get seconds(): number;
    get milliseconds(): number;
    
    plus(duration: Duration | object): Duration;
    minus(duration: Duration | object): Duration;
    
    mapUnits(fn: (x: number) => number): Duration;
    
    get isValid(): boolean;
    invalidReason?: string;
  }
} 