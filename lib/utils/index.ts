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

export function serializeError(error: Error | unknown): { message: string, name: string } {
  if (!(error instanceof Error)) {
      return { message: String(error), name: 'Unexpected Error' };
  }

  return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error as any), // Capture any custom properties
  };
}