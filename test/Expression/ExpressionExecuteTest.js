import {expect} from "chai";
import {TEString} from "../../src/nodes/expressions/TEString";
import {TENumber} from "../../src/nodes/expressions/TENumber";
import {JSDOM} from "jsdom";
import {Environment} from "../../src";

const {ExpressionParser} = require("../../src/parser/ExpressionParser");
const {TEVariable} = require("../../src/nodes/expressions/TEVariable");
const {TEBoolean} = require("../../src/nodes/expressions/TEBoolean");
const {document} = (new JSDOM(`...`)).window;

describe('ExpressionTest', () => {
    describe('Execute', () => {
        it('variable', async () => {
            const obj = ExpressionParser.Parse("var1");

            const env = new Environment();
            env.variables.var1 = Symbol();
            expect(obj.execute(env)).to.be.equal(env.variables.var1)
        });

        it('boolTrue', async () => {
            const obj = ExpressionParser.Parse("true");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(true)
        });

        it('boolFalse', async () => {
            const obj = ExpressionParser.Parse("false");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(false)
        });

        it('property', async () => {
            const obj = ExpressionParser.Parse("var1.sub.sub2");

            const env = new Environment();
            env.variables.var1 = {sub: {sub2: Symbol()}};
            expect(obj.execute(env)).to.be.equal(env.variables.var1.sub.sub2)
        });

        it('number', async () => {
            const obj = ExpressionParser.Parse("123");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(123)
        });

        it('numberDecimal', async () => {
            const obj = ExpressionParser.Parse("1.23");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(1.23)
        });

        it('numberE', async () => {
            const obj = ExpressionParser.Parse("1.23e2");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(123)
        });

        it('string1', async () => {
            const obj = ExpressionParser.Parse("'text'");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal("text")
        });

        it('string2', async () => {
            const obj = ExpressionParser.Parse('"text"');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal("text")
        });

        it('string concat', async () => {
            const obj = ExpressionParser.Parse('"te":\'xt\'');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal("text")
        });

        it('equal', async () => {
            const obj = ExpressionParser.Parse('a==b');

            const env = new Environment();
            env.variables.a = 1;
            env.variables.b = 2;
            expect(obj.execute(env)).to.be.equal(false)
            env.variables.b = 1;
            expect(obj.execute(env)).to.be.equal(true)
        });

        it('equal double', async () => {
            const obj = ExpressionParser.Parse('(a==b)==(c==d)');

            const env = new Environment();
            env.variables.a = 1;
            env.variables.b = 2;
            env.variables.c = 3;
            env.variables.d = 4;
            expect(obj.execute(env)).to.be.equal(true)
        });

        it('method call', async () => {
            const obj = ExpressionParser.Parse('fun(x)');

            const env = new Environment();
            env.variables.x = 1;
            env.variables.fun = z=>z*10;
            expect(obj.execute(env)).to.be.equal(10)
        });

        it('method call mutliple', async () => {
            const obj = ExpressionParser.Parse('fun(first,second)');

            const env = new Environment();
            env.variables.first = 3;
            env.variables.second = 7;
            env.variables.fun = (a,b)=>a*b;
            expect(obj.execute(env)).to.be.equal(21)
        });

        it('add', async () => {
            const obj = ExpressionParser.Parse('2+5 + 3');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(10)
        });

        it('sub', async () => {
            const obj = ExpressionParser.Parse('2-5 - 3');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(-6)
        });

        it('orNull', async () => {
            const obj = ExpressionParser.Parse('var1??"empty"');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal("empty")
            env.variables.var1 = null;
            expect(obj.execute(env)).to.be.equal("empty")
            env.variables.var1 = "val";
            expect(obj.execute(env)).to.be.equal("val")
        });
        it('orNullProperty', async () => {
            const obj = ExpressionParser.Parse('var1.property??"empty"');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal("empty")
            env.variables.var1 = null;
            expect(obj.execute(env)).to.be.equal("empty")
            env.variables.var1 = {};
            expect(obj.execute(env)).to.be.equal("empty")
            env.variables.var1 = {property:'val'};
            expect(obj.execute(env)).to.be.equal("val")
        });
    });
});
