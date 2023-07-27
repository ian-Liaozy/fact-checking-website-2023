const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const os = require('os');

require('mocha-sinon');
Object.assign(global, require(path.join(__dirname, '../routes/index.js')));

// use to test console output while still allowing console.log
// to _actually_ output to screen
// source: http://stackoverflow.com/a/30626035
function mockConsoleOutput() {
    const log = console.log;
    this.sinon.stub(console, 'log').callsFake(function(...args) {
        return log(...args);
    });
}
describe('index', function() {
    describe('SearchAPI', function () {
        it('fe', function () {
            // expect(getEvenParam(1, 2, 3)).to.have.all.members([1, 3]);
            // expect(getEvenParam('a', 'b', 'c', 'd', 'e')).to.have.all.members(['a', 'c', 'e']);
            // expect(getEvenParam('A')).to.have.all.members(['A']);
        });
        it('returns empty list if there are no arguments passed in', function () {
            //expect(getEvenParam()).to.have.all.members([]);
        });
    });
});