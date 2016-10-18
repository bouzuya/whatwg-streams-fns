import {
  ReadableStream,
  TransformStream ,
  WritableStream
} from 'whatwg-streams-b';

const fold = <T, U>(
  f: (a: U, i: T) => U, s: U
): { readable: ReadableStream<U>; writable: WritableStream<T>; } => {
  let acc = s;
  return new TransformStream<T, U>({
    start(controller) {
      controller.enqueue(acc);
    },
    transform(chunk, controller) {
      acc = f(acc, chunk);
      controller.enqueue(acc);
    }
  });
};

export { fold };
