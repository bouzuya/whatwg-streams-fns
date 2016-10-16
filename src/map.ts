import { TransformStream } from 'whatwg-streams-b';

const map = (f: (i: any) => any): TransformStream => {
  return new TransformStream({
    transform(chunk: any, done: () => any, enqueue: (chunk: any) => any): any {
      enqueue(f(chunk));
      done();
    }
  });
};

export { map };
