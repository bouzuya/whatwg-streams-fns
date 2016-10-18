import { ReadableStream } from 'whatwg-streams-b';

const from = <T>(iterable: Iterable<T>): ReadableStream<T> => {
  const iterator = iterable[Symbol.iterator]();
  return new ReadableStream<T>({
    pull(controller) {
      const { done, value } = iterator.next();
      if (done === false) {
        controller.enqueue(value);
      } else {
        controller.close();
      }
    }
  });
};

export { from };
