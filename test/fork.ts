import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { WritableStream } from 'whatwg-streams-b';
import { from } from '../src/from';
import { fork } from '../src/fork';

const { test } = beater();

const category = 'fork > ';

test(category + 'fork(rs1, 3)', () => {
  const close1 = sinon.spy();
  const close2 = sinon.spy();
  const close3 = sinon.spy();
  const write1 = sinon.spy();
  const write2 = sinon.spy();
  const write3 = sinon.spy();
  const rs1 = from([1, 2]);
  const [rs11, rs12, rs13] = fork(rs1, 3);
  return Promise.all([
    rs11.pipeTo(new WritableStream<number>({ close: close1, write: write1 })),
    rs12.pipeTo(new WritableStream<number>({ close: close2, write: write2 })),
    rs13.pipeTo(new WritableStream<number>({ close: close3, write: write3 }))
  ])
    .then(() => {
      assert(write1.callCount === 2);
      assert(write1.getCall(0).args[0] === 1);
      assert(write1.getCall(1).args[0] === 2);
      assert(close1.callCount === 1);
      assert(write2.callCount === 2);
      assert(write2.getCall(0).args[0] === 1);
      assert(write2.getCall(1).args[0] === 2);
      assert(close2.callCount === 1);
      assert(write3.callCount === 2);
      assert(write3.getCall(0).args[0] === 1);
      assert(write3.getCall(1).args[0] === 2);
      assert(close3.callCount === 1);
    });
});

test('[TODO] ' + category + 'rs controller.error()', () => {
  assert(1 === 1);
});

test('[TODO] ' + category + 'ws controller.error()', () => {
  assert(1 === 1);
});
