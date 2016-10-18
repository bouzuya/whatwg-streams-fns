import { ReadableStream, WritableStream } from 'whatwg-streams-b';

const merge = (rs1: ReadableStream, rs2: ReadableStream): ReadableStream => {
  // TODO: options
  const options = void 0;
  return new ReadableStream({
    cancel(reason) {
      return Promise.all([
        rs1.cancel(reason),
        rs2.cancel(reason)
      ]);
    },
    start(controller) {
      void Promise.all([
        rs1.pipeTo(new WritableStream({
          write(chunk) {
            controller.enqueue(chunk);
          }
        })),
        rs2.pipeTo(new WritableStream({
          write(chunk) {
            controller.enqueue(chunk);
          }
        }))
      ]).then(() => {
        controller.close();
      }, (error) => {
        controller.error(error);
      });
    }
  }, options);
};

export { merge };
