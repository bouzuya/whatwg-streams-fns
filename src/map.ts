import {
  ReadableStream,
  TransformStream ,
  WritableStream
} from 'whatwg-streams-b';

const map = <T, U>(
  f: (i: T) => U
): { readable: ReadableStream<U>; writable: WritableStream<T>; } => {
  return new TransformStream<T, U>({
    transform(chunk, controller) {
      controller.enqueue(f(chunk));
    }
  });
};

export { map };
