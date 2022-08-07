// Takes a long hash string and truncates it.
export function truncate(
    hash: string,
    length = 38,
    initialCharsLength = 6
  ): string {
    return hash && hash.replace(hash.substring(initialCharsLength, length), '...')
  }

// Takes a generic amount of args and creates a string
export function genKey(...args: string[]): string {
    return args.reduce((val, accum) => accum += "-" + val, "");
}