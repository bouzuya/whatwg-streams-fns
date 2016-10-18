import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams-b';
import { map } from '../src/map';

const { test } = beater();

const category = 'map > ';

test(category + 'map((i) => i * 2)', () => {
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1 = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });
  rs1
    .pipeThrough(map<number, number>((i) => i * 2))
    .pipeTo(new WritableStream({ close, write }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(write.callCount === 2);
    assert(write.getCall(0).args[0] === 2);
    assert(write.getCall(1).args[0] === 4);
    assert(close.callCount === 1);
  });
});

test(category + 'rs controller.error()', () => {
  const abort = sinon.spy();
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1 = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.error(new Error('ERROR!'));
      // controller.enqueue(2); // in errored state
    }
  });
  rs1
    .pipeThrough(map<number, number>((i) => i * 2))
    .pipeTo(new WritableStream({ abort, close, write }));
  return new Promise((resolve) => setTimeout(resolve)).catch((error) => {
    assert(error.message === 'ERROR!');
    assert(abort.callCount === 1);
    assert(abort.getCall(0).args[0].message === 'ERROR!');
    assert(write.callCount === 1);
    assert(write.getCall(0).args[0] === 2);
    assert(close.callCount === 0);
  });
});


test(category + 'ws controller.error()', () => {
  const abort = sinon.spy();
  const close = sinon.spy();
  const write = sinon.spy();
  const cancel = sinon.spy();
  const rs1 = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
    },
    cancel
  });
  rs1
    .pipeThrough(map<number, number>((i) => i * 2))
    .pipeTo(new WritableStream({
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
