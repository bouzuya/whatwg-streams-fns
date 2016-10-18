import { ReadableStream } from 'whatwg-streams-b';

const fork = <T>(
  readable: ReadableStream<T>, n: number
): ReadableStream<T>[] => {
  if (n === 0) return [];
  if (n === 1) return [readable];
  let rs: ReadableStream<T>[] = readable.tee();
  while (rs.length < n) {
    rs = rs.slice(1).concat(rs[0].tee());
  }
  return rs;
};

export { fork };
