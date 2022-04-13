import {expect} from "chai";
const {ExpressionParser} = require("../../src/parser/ExpressionParser");
const {TEVariable} = require("../../src/nodes/expressions/TEVariable");
const {TEBoolean} = require("../../src/nodes/expressions/TEBoolean");

describe('ExpressionTest', () => {
    describe('compile', () => {
        it('variable', async () => {
            const obj = ExpressionParser.Parse("var1");
            expect(obj).to.be.instanceOf(TEVariable)
            expect(obj.name).to.be.equal("var1")
        });
        it('boolTrue', async () => {
            const obj = ExpressionParser.Parse("true");
            expect(obj).to.be.instanceOf(TEBoolean)
            expect(obj.value).to.be.equal(true)
        });
        it('boolFalse', async () => {
            const obj = ExpressionParser.Parse("false");
            expect(obj).to.be.instanceOf(TEBoolean)
            expect(obj.value).to.be.equal(true)
        });
    });
});