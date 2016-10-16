import * as assert from 'power-assert';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import beater from 'beater';
import add from '../src/add';

const { test } = beater();

test('add', () => {
  assert(add(1, 2) === 3);
  assert(proxyquire);
  assert(sinon);
});
