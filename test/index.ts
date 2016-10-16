import * as assert from 'power-assert';
import beater from 'beater';
import * as index from '../src/';

const { test } = beater();

test('index', () => {
  assert(index.map);
});
