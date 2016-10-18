import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { WritableStream } from 'whatwg-streams-b';
import { from } from '../src/from';

const { test } = beater();

const category = 'from > ';

test(category + 'from([1, 2, 3])', () => {
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1 = from([1, 2, 3]);
  return rs1
    .pipeTo(new WritableStream<number>({ close, write }))
    .then(() => {
      assert(write.callCount === 3);
      assert(write.getCall(0).args[0] === 1);
      assert(write.getCall(1).args[0] === 2);
      assert(write.getCall(2).args[0] === 3);
      assert(close.callCount === 1);
    });
});

test(category + 'ws controller.error()', () => {
  const abort = sinon.spy();
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1 = from([1, 2, 3]);
  return rs1
    .pipeTo(new WritableStream<number>({
      start(controller) {
        controller.error(new Error('ERROR!'));
      },
      abort, close, write
    }))
    .then(() => assert.fail(), (error) => {
      assert(error.message === 'ERROR!');
      assert(abort.callCount === 0);
      assert(write.callCount === 0);
      assert(close.callCount === 0);
    });
});
