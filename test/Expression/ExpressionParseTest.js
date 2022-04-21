import {expect} from "chai";
import {TEString} from "../../src/nodes/expressions/TEString";
import {TENumber} from "../../src/nodes/expressions/TENumber";
const {ExpressionParser} = require("../../src/parser/ExpressionParser");
const {TEVariable} = require("../../src/nodes/expressions/TEVariable");
const {TEBoolean} = require("../../src/nodes/expressions/TEBoolean");

describe('ExpressionTest', () => {
    describe('parse', () => {
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
            expect(obj.value).to.be.equal(false)
        });
        it('number', async () => {
            const obj = ExpressionParser.Parse("123");
            expect(obj).to.be.instanceOf(TENumber)
            expect(obj.value).to.be.equal(123)
        });
        it('numberDecimal', async () => {
            const obj = ExpressionParser.Parse("1.23");
            expect(obj).to.be.instanceOf(TENumber)
            expect(obj.value).to.be.equal(1.23)
        });
        it('numberE', async () => {
            const obj = ExpressionParser.Parse("1.23e2");
            expect(obj).to.be.instanceOf(TENumber)
            expect(obj.value).to.be.equal(123)
        });
        it('string1', async () => {
            const obj = ExpressionParser.Parse("'text'");
            expect(obj).to.be.instanceOf(TEString)
            expect(obj.value).to.be.equal("text")
        });
        it('string2', async () => {
            const obj = ExpressionParser.Parse('"text"');
            expect(obj).to.be.instanceOf(TEString)
            expect(obj.value).to.be.equal("text")
        });
    });
});