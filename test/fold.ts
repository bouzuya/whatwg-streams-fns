import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams-b';
import { fold } from '../src/fold';

const { test } = beater();

const category = 'fold > ';

test(category + 'fold((a, i) => a + i, 3)', () => {
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1 = new ReadableStream<number>({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.enqueue(3);
      controller.close();
    }
  });
  rs1
    .pipeThrough(fold((a: number, i: number) => a + i, 3))
    .pipeTo(new WritableStream<number>({ close, write }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(write.callCount === 4);
    assert(write.getCall(0).args[0] === 3);
    assert(write.getCall(1).args[0] === 4);
    assert(write.getCall(2).args[0] === 6);
    assert(write.getCall(3).args[0] === 9);
    assert(close.callCount === 1);
  });
});

test(category + 'rs controller.error()', () => {
  const abort = sinon.spy();
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1 = new ReadableStream<number>({
    start(controller) {
      controller.enqueue(1);
      controller.error(new Error('ERROR!'));
      // controller.enqueue(2); // in errored state
    }
  });
  rs1
    .pipeThrough(fold((a: number, i: number) => a + i, 3))
    .pipeTo(new WritableStream<number>({ abort, close, write }));
  return new Promise((resolve) => setTimeout(resolve)).catch((error) => {
    assert(error.message === 'ERROR!');
    assert(abort.callCount === 1);
    assert(abort.getCall(0).args[0].message === 'ERROR!');
    assert(write.callCount === 2);
    assert(write.getCall(0).args[0] === 3);
    assert(write.getCall(1).args[0] === 4);
    assert(close.callCount === 0);
  });
});


test(category + 'ws controller.error()', () => {
  const abort = sinon.spy();
  const close = sinon.spy();
  const write = sinon.spy();
  const cancel = sinon.spy();
  const rs1 = new ReadableStream<number>({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
    },
    cancel
  });
  rs1
    .pipeThrough(fold((a: number, i: number) => a + i, 3))
    .pipeTo(new WritableStream<number>({
      start(controller) {
        controller.error(new Error('ERROR!'));
      },
      abort, close, write
    }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(cancel.callCount === 1);
    assert(cancel.getCall(0).args[0].message === 'Readable side canceled');
    assert(abort.callCount === 0);
    assert(write.callCount === 0);
    assert(close.callCount === 0);
  });
});
