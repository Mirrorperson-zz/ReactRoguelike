import React from 'react';
import ReactDOM from 'react-dom';
import { RollRandom } from './Utility';

it('generates a random number between min and max', () => {
  var rand1 = RollRandom(10, 1);
  expect(rand1).toBeGreaterThanOrEqual(1);
  expect(rand1).toBeLessThanOrEqual(10);

  var rand3 = RollRandom(1000, 76);
  expect(rand3).toBeGreaterThanOrEqual(76);
  expect(rand3).toBeLessThanOrEqual(1000);
});
