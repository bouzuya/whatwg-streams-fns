import { TransformStream } from 'whatwg-streams-b';

const fold = (f: (a: any, i: any) => any, s: any): TransformStream => {
  let acc = s;
  return new TransformStream({
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
