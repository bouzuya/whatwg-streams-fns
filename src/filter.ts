import {
  ReadableStream,
  TransformStream ,
  WritableStream
} from 'whatwg-streams-b';

const filter = <T>(
  f: (i: T) => boolean
): { readable: ReadableStream<T>; writable: WritableStream<T>; } => {
  return new TransformStream<T, T>({
    transform(chunk, controller) {
      if (f(chunk)) controller.enqueue(chunk);
    }
  });
};

export { filter };
