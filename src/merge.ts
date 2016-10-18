import { ReadableStream, WritableStream } from 'whatwg-streams-b';

const merge = (...readables: ReadableStream[]): ReadableStream => {
  // TODO: options
  const options = void 0;
  return new ReadableStream({
    cancel(reason) {
      return Promise.all(readables.map((readable) => readable.cancel(reason)));
    },
    start(controller) {
      void Promise.all(readables.map((readable) => {
        return readable.pipeTo(new WritableStream({
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
