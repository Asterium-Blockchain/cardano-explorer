declare module 'base-58' {
  const Base58: {
    encode(buf: Uint8Array | Buffer): string;
    decode(str: string): Uint8Array | Buffer;
  };
  export default Base58;
}
