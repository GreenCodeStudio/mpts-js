import {expect} from "chai";
import {TEString} from "../../src/nodes/expressions/TEString";
import {TENumber} from "../../src/nodes/expressions/TENumber";
const {ExpressionParser} = require("../../src/parser/ExpressionParser");
const {TEVariable} = require("../../src/nodes/expressions/TEVariable");
const {TEBoolean} = require("../../src/nodes/expressions/TEBoolean");

describe('ExpressionTest', () => {
    describe('compile', () => {
        it('variable', async () => {
            const obj = ExpressionParser.Parse("var1");
            expect(obj.compileJS().code).to.be.equal("variables[\"var1\"]")
        });
        it('boolTrue', async () => {
            const obj = ExpressionParser.Parse("true");
            expect(obj.compileJS().code).to.be.equal("true")
        });
        it('boolFalse', async () => {
            const obj = ExpressionParser.Parse("false");
            expect(obj.compileJS().code).to.be.equal("false")
        });
        it('property', async () => {
            const obj = ExpressionParser.Parse("var1.sub.sub2");
            expect(obj.compileJS().code).to.be.equal("variables[\"var1\"][\"sub\"][\"sub2\"]")
        });
        it('number', async () => {
            const obj = ExpressionParser.Parse("123");
            expect(obj).to.be.instanceOf(TENumber)
            expect(obj.compileJS().code).to.be.equal("123")
        });
        it('numberDecimal', async () => {
            const obj = ExpressionParser.Parse("1.23");
            expect(obj.compileJS().code).to.be.equal("1.23")
        });
        it('numberE', async () => {
            const obj = ExpressionParser.Parse("1.23e2");
            expect(obj.compileJS().code).to.be.equal("123")
        });
        it('string1', async () => {
            const obj = ExpressionParser.Parse("'text'");
            expect(obj.compileJS().code).to.be.equal('"text"')
        });
        it('string2', async () => {
            const obj = ExpressionParser.Parse('"text"');
            expect(obj.compileJS().code).to.be.equal('"text"')
        });

        it('equal', async () => {
            const obj = ExpressionParser.Parse('a==b');
            expect(obj.compileJS().code).to.be.equal('variables[\"a\"]==variables[\"b\"]')
        });
        it('equal double', async () => {
            const obj = ExpressionParser.Parse('(a==b)==(c==d)');
            expect(obj.compileJS().code).to.be.equal('(variables[\"a\"]==variables[\"b\"])==(variables[\"c\"]==variables[\"d\"])')
        });
    });
});