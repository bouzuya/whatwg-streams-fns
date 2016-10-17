import { TransformStream } from 'whatwg-streams-b';

const filter = (f: (i: any) => boolean): TransformStream => {
  return new TransformStream({
    transform(chunk, controller) {
      if (f(chunk)) controller.enqueue(chunk);
    }
  });
};

export { filter };
