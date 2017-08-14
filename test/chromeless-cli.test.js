import chai from 'chai';
chai.should();
import ChromelessCLI from '../src/chromeless-cli';

describe('ChromelessCLI test.', (suite) => {
  it('should have properties ', () => {
    const ccli = new ChromelessCLI();
    ccli.should.be.a('object');
  });
});
