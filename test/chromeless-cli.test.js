import chai from 'chai';
chai.should();
import ChromelessCLI from '../src/chromeless-cli';

describe('ChromelessCLI test.', (suite) => {
  it('should have properties ', () => {
    const ccli = new ChromelessCLI(process.stdin);
    ccli.should.be.a('object');
    ccli.should.have.property('fd').with.a('object');
    ccli.should.have.property('cl').with.equal(undefined);
  });
  it('parse a line ', () => {
    const ccli = new ChromelessCLI(process.stdin);
    ccli.should.have.property('parseLine').with.a('function');
    ccli.parseLine({})
        .should.deep.equal([]);
    ccli.parseLine(`func arg1   arg2 `)
        .should.deep.equal(['func', 'arg1', 'arg2']);
    ccli.parseLine(`func "it's a small world" arg2`)
        .should.deep.equal(['func', 'it\'s a small world', 'arg2']);
    ccli.parseLine(`func 'it is a small world' arg2`)
        .should.deep.equal(['func', 'it is a small world', 'arg2']);
    ccli.parseLine(`func '' arg2`)
        .should.deep.equal(['func', '', 'arg2']);
    ccli.parseLine(`func '{"key":"value"}' arg2`)
        .should.deep.equal(['func', {'key': 'value'}, 'arg2']);
    ccli.parseLine(`func '{"key":[]}' arg2`)
        .should.deep.equal(['func', {'key': []}, 'arg2']);
  });
  it('run ', () => {
    const ccli = new ChromelessCLI(process.stdin);
    ccli.should.have.property('run').with.a('function');
  });
  it('readLine ', () => {
    const ccli = new ChromelessCLI(process.stdin);
    ccli.should.have.property('readLine').with.a('function');
  });
});
