import ms from 'ms'

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return 'never'
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? '' : ' ago'
  }`
}

export const createMirrorEnum = <const T extends string>(tuple: T[]) => {
  return Object.fromEntries(tuple.map((val) => [val, val])) as { [K in T]: K };
}
