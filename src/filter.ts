import { TransformStream } from 'whatwg-streams-b';

const filter = <T>(f: (i: T) => boolean): TransformStream<T, T> => {
  return new TransformStream<T, T>({
    transform(chunk, controller) {
      if (f(chunk)) controller.enqueue(chunk);
    }
  });
};

export { filter };
