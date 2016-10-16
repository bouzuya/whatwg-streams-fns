import { TransformStream } from 'whatwg-streams-b';

const map = (f: (i: any) => any): TransformStream => {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(f(chunk));
    }
  });
};

export { map };
