import { CheckEmptyPipe } from './check-empty.pipe';

describe('CheckEmptyPipe', () => {
  it('create an instance', () => {
    const pipe = new CheckEmptyPipe();
    expect(pipe).toBeTruthy();
  });
});
