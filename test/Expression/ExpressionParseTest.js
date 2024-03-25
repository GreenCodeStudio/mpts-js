import {expect} from "chai";
import {TEString} from "../../src/nodes/expressions/TEString";
import {TENumber} from "../../src/nodes/expressions/TENumber";
import {TEEqual} from "../../src/nodes/expressions/TEEqual";
import {TEProperty} from "../../src/nodes/expressions/TEProperty";
import {TEMethodCall} from "../../src/nodes/expressions/TEMethodCall";
import {TEOrNull} from "../../src/nodes/expressions/TEOrNull";

const {ExpressionParser} = require("../../src/parser/ExpressionParser");
const {TEVariable} = require("../../src/nodes/expressions/TEVariable");
const {TEBoolean} = require("../../src/nodes/expressions/TEBoolean");
const {TEConcatenate} = require("../../src/nodes/expressions/TEConcatenate");

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
        it('property', async () => {
            const obj = ExpressionParser.Parse("var1.sub.sub2");
            expect(obj).to.be.instanceOf(TEProperty)
            expect(obj.name).to.be.equal("sub2")
            expect(obj.source).to.be.instanceOf(TEProperty)
            expect(obj.source.name).to.be.equal("sub")
            expect(obj.source.source).to.be.instanceOf(TEVariable)
            expect(obj.source.source.name).to.be.equal("var1")
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
        it('equal', async () => {
            const obj = ExpressionParser.Parse('a==b');

            expect(obj).to.be.instanceOf(TEEqual)
            expect(obj.left).to.be.instanceOf(TEVariable)
            expect(obj.left.name).to.be.equal("a")
            expect(obj.right).to.be.instanceOf(TEVariable)
            expect(obj.right.name).to.be.equal("b")
        });

        it('equal double', async () => {
            const obj = ExpressionParser.Parse('(a==b)==(c==d)');

            expect(obj).to.be.instanceOf(TEEqual)
            expect(obj.left).to.be.instanceOf(TEEqual)
            expect(obj.left.left).to.be.instanceOf(TEVariable)
            expect(obj.left.left.name).to.be.equal("a")
            expect(obj.left.right).to.be.instanceOf(TEVariable)
            expect(obj.left.right.name).to.be.equal("b")

            expect(obj.right).to.be.instanceOf(TEEqual)
            expect(obj.right.left).to.be.instanceOf(TEVariable)
            expect(obj.right.left.name).to.be.equal("c")
            expect(obj.right.right).to.be.instanceOf(TEVariable)
            expect(obj.right.right.name).to.be.equal("d")
        });

        it('methodCall', async () => {
            const obj = ExpressionParser.Parse('fun(x)');

            expect(obj).to.be.instanceOf(TEMethodCall)
            expect(obj.source).to.be.instanceOf(TEVariable)
            expect(obj.source.name).to.be.equal("fun")
            expect(obj.args[0]).to.be.instanceOf(TEVariable)
            expect(obj.args[0].name).to.be.equal("x")
        });

        it('methodCallMultiArgument', async () => {
            const obj = ExpressionParser.Parse('fun(x,y,z)');

            expect(obj).to.be.instanceOf(TEMethodCall)
            expect(obj.source).to.be.instanceOf(TEVariable)
            expect(obj.source.name).to.be.equal("fun")
            expect(obj.args[0]).to.be.instanceOf(TEVariable)
            expect(obj.args[0].name).to.be.equal("x")
            expect(obj.args[1]).to.be.instanceOf(TEVariable)
            expect(obj.args[1].name).to.be.equal("y")
            expect(obj.args[2]).to.be.instanceOf(TEVariable)
            expect(obj.args[2].name).to.be.equal("z")
        });

        it('methodCallString', async () => {
            const obj = ExpressionParser.Parse('fun("x")');
            expect(obj).to.be.instanceOf(TEMethodCall)
            expect(obj.source).to.be.instanceOf(TEVariable)
            expect(obj.source.name).to.be.equal("fun")
            expect(obj.args[0]).to.be.instanceOf(TEString)
            expect(obj.args[0].value).to.be.equal("x")
        });
        it('concatenation', async () => {
            const obj = ExpressionParser.Parse('var1:var2');
            expect(obj).to.be.instanceOf(TEConcatenate)
            expect(obj.left).to.be.instanceOf(TEVariable)
            expect(obj.left.name).to.be.equal("var1")
            expect(obj.right).to.be.instanceOf(TEVariable)
            expect(obj.right.name).to.be.equal("var2")
        });
        it('concatenation string', async () => {
            const obj = ExpressionParser.Parse('"string1":var2');
            expect(obj).to.be.instanceOf(TEConcatenate)
            expect(obj.left).to.be.instanceOf(TEString)
            expect(obj.left.value).to.be.equal("string1")
            expect(obj.right).to.be.instanceOf(TEVariable)
            expect(obj.right.name).to.be.equal("var2")
        });
        it('orNull', async () => {
            const obj = ExpressionParser.Parse('var1??"empty"');
            expect(obj).to.be.instanceOf(TEOrNull)
            expect(obj.left).to.be.instanceOf(TEVariable)
            expect(obj.left.name).to.be.equal("var1")
            expect(obj.right).to.be.instanceOf(TEString)
            expect(obj.right.value).to.be.equal("empty")
        });
        it('orNullProperty', async () => {
            const obj = ExpressionParser.Parse('var1.property??"empty"');
            expect(obj).to.be.instanceOf(TEOrNull)
            expect(obj.left).to.be.instanceOf(TEProperty)
            expect(obj.left.name).to.be.equal("property")
            expect(obj.left.source).to.be.instanceOf(TEVariable)
            expect(obj.left.source.name).to.be.equal("var1")
            expect(obj.right).to.be.instanceOf(TEString)
            expect(obj.right.value).to.be.equal("empty")
        });

        it('functionCall', async () => {
            const obj = ExpressionParser.Parse('fun1(param)');

            expect(obj).to.be.instanceOf(TEMethodCall)
            expect(obj.source).to.be.instanceOf(TEVariable)
            expect(obj.source.name).to.be.equal("fun1")
            expect(obj.args[0]).to.be.instanceOf(TEVariable)
            expect(obj.args[0].name).to.be.equal("param")
        });

        it('functionCall2', async () => {
            const obj = ExpressionParser.Parse('getView("User", "PermissionsEdit", data)');
            expect(obj).to.be.instanceOf(TEMethodCall)
            expect(obj.source).to.be.instanceOf(TEVariable)
            expect(obj.source.name).to.be.equal("getView")
            expect(obj.args[0]).to.be.instanceOf(TEString)
            expect(obj.args[0].value).to.be.equal("User")
            expect(obj.args[1]).to.be.instanceOf(TEString)
            expect(obj.args[1].value).to.be.equal("PermissionsEdit")
            expect(obj.args[2]).to.be.instanceOf(TEVariable)
            expect(obj.args[2].name).to.be.equal("data")
        });

        it('add', async () => {
            const obj = ExpressionParser.Parse('a+b');
            expect(obj).to.be.instanceOf(TEAdd)
            expect(obj.left).to.be.instanceOf(TEVariable)
            expect(obj.left.name).to.be.equal("a")
            expect(obj.right).to.be.instanceOf(TEVariable)
            expect(obj.right.name).to.be.equal("b")
        });
    });
});
