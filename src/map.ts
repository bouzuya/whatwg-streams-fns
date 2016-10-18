import { TransformStream } from 'whatwg-streams-b';

const map = <T, U>(f: (i: T) => U): TransformStream<T, U> => {
  return new TransformStream<T, U>({
    transform(chunk, controller) {
      controller.enqueue(f(chunk));
    }
  });
};

export { map };
