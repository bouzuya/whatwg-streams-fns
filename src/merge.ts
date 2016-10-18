import { ReadableStream, WritableStream } from 'whatwg-streams-b';

const merge = <T>(...readables: ReadableStream<T>[]): ReadableStream<T> => {
  // TODO: options
  const options = void 0;
  return new ReadableStream<T>({
    cancel(reason) {
      return Promise.all(readables.map((readable) => readable.cancel(reason)));
    },
    start(controller) {
      void Promise.all(readables.map((readable) => {
        return readable.pipeTo(new WritableStream<T>({
          write(chunk) {
            controller.enqueue(chunk);
          }
        }));
      }))
        .then(() => {
          controller.close();
        }, (error) => {
          controller.error(error);
        });
    }
  }, options);
};

export { merge };
