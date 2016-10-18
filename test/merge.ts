import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import {
  ReadableStream, ReadableStreamController, WritableStream
} from 'whatwg-streams-b';
import { merge } from '../src/merge';

const { test } = beater();

const category = 'merge > ';

const newRS = <T>(
  data: ((c: ReadableStreamController<T>) => any)[]
): ReadableStream<T> => {
  return new ReadableStream({
    pull(controller) {
      return new Promise((resolve) => setTimeout(resolve, 1)).then(() => {
        const f = data.shift();
        if (typeof f !== 'undefined') f(controller);
      });
    }
  });
};

test(category + 'merge(rs1, rs2)', () => {
  const abort = sinon.spy();
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1data = [
    (c: ReadableStreamController<number>) => c.enqueue(1),
    (c: ReadableStreamController<number>) => c.enqueue(2),
    (c: ReadableStreamController<number>) => c.enqueue(3),
    (c: ReadableStreamController<number>) => c.close()
  ];
  const rs2data = [
    (c: ReadableStreamController<number>) => c.enqueue(4),
    (c: ReadableStreamController<number>) => c.enqueue(5),
    (c: ReadableStreamController<number>) => c.enqueue(6),
    (c: ReadableStreamController<number>) => c.close()
  ];
  const rs1 = newRS(rs1data);
  const rs2 = newRS(rs2data);
  return merge(rs1, rs2)
    .pipeTo(new WritableStream<number>({ abort, close, write }))
    .then(() => {
      assert(write.callCount === 6);
      assert.deepEqual([
        write.getCall(0).args[0],
        write.getCall(1).args[0],
        write.getCall(2).args[0],
        write.getCall(3).args[0],
        write.getCall(4).args[0],
        write.getCall(5).args[0]
      ].sort(), [1, 2, 3, 4, 5, 6]);
    });
});

test(category + 'rs1 controller.error()', () => {
  const abort = sinon.spy();
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1data = [
    (c: ReadableStreamController<number>) => c.enqueue(1),
    (c: ReadableStreamController<number>) => c.error(new Error('ERROR!'))
  ];
  const rs2data = [
    (c: ReadableStreamController<number>) => c.enqueue(4),
    (c: ReadableStreamController<number>) => c.enqueue(5),
    (c: ReadableStreamController<number>) => c.enqueue(6),
    (c: ReadableStreamController<number>) => c.close()
  ];
  const rs1 = newRS(rs1data);
  const rs2 = newRS(rs2data);
  return merge(rs1, rs2)
    .pipeTo(new WritableStream<number>({ abort, close, write }))
    .catch((error) => {
      assert(error.message === 'ERROR!');
      assert(abort.callCount === 1);
      assert(abort.getCall(0).args[0].message === 'ERROR!');
      assert(close.callCount === 0);
      const except = [1, 4, 5, 6];
      assert(1 <= write.callCount);
      assert(write.callCount <= except.length);
      assert.deepEqual(new Array(write.callCount).fill(0).map((_, i) => {
        return write.getCall(i).args[0];
      }).sort(), except.sort().slice(0, write.callCount));
    });
});

test(category + 'rs2 controller.error()', () => {
  const abort = sinon.spy();
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1data = [
    (c: ReadableStreamController<number>) => c.enqueue(1),
    (c: ReadableStreamController<number>) => c.enqueue(2),
    (c: ReadableStreamController<number>) => c.enqueue(3),
    (c: ReadableStreamController<number>) => c.close()
  ];
  const rs2data = [
    (c: ReadableStreamController<number>) => c.enqueue(4),
    (c: ReadableStreamController<number>) => c.error(new Error('ERROR!'))
  ];
  const rs1 = newRS(rs1data);
  const rs2 = newRS(rs2data);
  return merge(rs1, rs2)
    .pipeTo(new WritableStream<number>({ abort, close, write }))
    .catch((error) => {
      assert(error.message === 'ERROR!');
      assert(abort.callCount === 1);
      assert(abort.getCall(0).args[0].message === 'ERROR!');
      assert(close.callCount === 0);
      const except = [1, 2, 3, 4];
      assert(1 <= write.callCount);
      assert(write.callCount <= except.length);
      assert(new Array(write.callCount).fill(0).map((_, i) => {
        return write.getCall(i).args[0];
      }).every((i) => except.some((j) => i === j)));
    });
});

test('[TODO] ' + category + 'ws controller.error()', () => {
  assert(1 === 1); // TODO
});
