declare module "string-similarity" {
  export function compareTwoStrings(first: string, second: string): number;
  export function findBestMatch(
    mainString: string,
    targetStrings: string[],
  ): {
    ratings: Array<{
      target: string;
      rating: number;
    }>;
    bestMatch: {
      target: string;
      rating: number;
    };
  };
}
