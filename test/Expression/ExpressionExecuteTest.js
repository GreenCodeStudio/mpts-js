import {expect} from "chai";
import {Environment} from "../../src/Environment.js";

import {ExpressionParser} from "../../src/parser/ExpressionParser.js";
import {XMLParser} from "../../src/index.js";
import {CodePosition} from "../../src/CodePosition.js";
import {MptsExecutionError} from "../../src/MptsExecutionError.js";

function parse(code){
    return ExpressionParser.Parse(code, new CodePosition('file.mpts',1,0,0));
}
describe('ExpressionTest', () => {
    describe('Execute', () => {
        it('variable', async () => {
            const obj = parse("var1");

            const env = new Environment();
            env.variables.var1 = Symbol();
            expect(obj.execute(env)).to.be.equal(env.variables.var1)
        });

        it('boolTrue', async () => {
            const obj = parse("true");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(true)
        });

        it('boolFalse', async () => {
            const obj = parse("false");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(false)
        });

        it('property', async () => {
            const obj = parse("var1.sub.sub2");

            const env = new Environment();
            env.variables.var1 = {sub: {sub2: Symbol()}};
            expect(obj.execute(env)).to.be.equal(env.variables.var1.sub.sub2)
        });

        it('number', async () => {
            const obj = parse("123");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(123)
        });

        it('numberDecimal', async () => {
            const obj = parse("1.23");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(1.23)
        });

        it('numberE', async () => {
            const obj = parse("1.23e2");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(123)
        });

        it('string1', async () => {
            const obj = parse("'text'");

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal("text")
        });

        it('string2', async () => {
            const obj = parse('"text"');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal("text")
        });

        it('string concat', async () => {
            const obj = parse('"te":\'xt\'');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal("text")
        });

        it('equal', async () => {
            const obj = parse('a==b');

            const env = new Environment();
            env.variables.a = 1;
            env.variables.b = 2;
            expect(obj.execute(env)).to.be.equal(false)
            env.variables.b = 1;
            expect(obj.execute(env)).to.be.equal(true)
        });

        it('equal double', async () => {
            const obj = parse('(a==b)==(c==d)');

            const env = new Environment();
            env.variables.a = 1;
            env.variables.b = 2;
            env.variables.c = 3;
            env.variables.d = 4;
            expect(obj.execute(env)).to.be.equal(true)
        });

        it('method call', async () => {
            const obj = parse('fun(x)');

            const env = new Environment();
            env.variables.x = 1;
            env.variables.fun = z=>z*10;
            expect(obj.execute(env)).to.be.equal(10)
        });

        it('method call mutliple', async () => {
            const obj = parse('fun(first,second)');

            const env = new Environment();
            env.variables.first = 3;
            env.variables.second = 7;
            env.variables.fun = (a,b)=>a*b;
            expect(obj.execute(env)).to.be.equal(21)
        });

        it('add', async () => {
            const obj = parse('2+5 + 3');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(10)
        });

        it('sub', async () => {
            const obj = parse('2-5 - 3');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(-6)
        });
        it('multiply', async () => {
            const obj = parse("2*5 * 3");
            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(30);
        });

        it('divide', async () => {
            const obj = parse("20/5 / 2");
            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(2);
        });

        it('precedence', async () => {
            const obj = parse("2+5 * 3");
            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(17);
        });

        it('parenthesis', async () => {
            const obj = parse("(2+5) * 3");
            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(21);
        });

        it('modulo', async () => {
            const obj = parse("20 % 6");
            const env = new Environment();
            expect(obj.execute(env)).to.be.equal(2);
        });

        it('orNull', async () => {
            const obj = parse('var1??"empty"');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal("empty")
            env.variables.var1 = null;
            expect(obj.execute(env)).to.be.equal("empty")
            env.variables.var1 = "val";
            expect(obj.execute(env)).to.be.equal("val")
        });
        it('orNullProperty', async () => {
            const obj = parse('var1.property??"empty"');

            const env = new Environment();
            expect(obj.execute(env)).to.be.equal("empty")
            env.variables.var1 = null;
            expect(obj.execute(env)).to.be.equal("empty")
            env.variables.var1 = {};
            expect(obj.execute(env)).to.be.equal("empty")
            env.variables.var1 = {property:'val'};
            expect(obj.execute(env)).to.be.equal("val")
        });

        it('and', async () => {
            const obj = parse('a && b');

            const env = new Environment();
            env.variables.a = true;
            env.variables.b = false;
            expect(obj.execute(env)).to.be.equal(false)
            env.variables.b = true;
            expect(obj.execute(env)).to.be.equal(true)
        });

        it('or', async () => {
            const obj = parse('a || b');

            const env = new Environment();
            env.variables.a = false;
            env.variables.b = false;
            expect(obj.execute(env)).to.be.equal(false)
            env.variables.b = true;
            expect(obj.execute(env)).to.be.equal(true)
        });

        it('not', async () => {
            const obj = parse('!a');

            const env = new Environment();
            env.variables.a = false;
            expect(obj.execute(env)).to.be.equal(true)
            env.variables.a = true;
            expect(obj.execute(env)).to.be.equal(false)
        });

        it('double not', async () => {
            const obj = parse('!!a');

            const env = new Environment();
            env.variables.a = false;
            expect(obj.execute(env)).to.be.equal(false)
            env.variables.a = true;
            expect(obj.execute(env)).to.be.equal(true)
            env.variables.a = 'text';
            expect(obj.execute(env)).to.be.equal(true)
            env.variables.a = '';
            expect(obj.execute(env)).to.be.equal(false)
            // env.variables.a = 'false';//todo refink
            // expect(obj.execute(env)).to.be.equal(false)
            // env.variables.a = 'faLsE';
            // expect(obj.execute(env)).to.be.equal(false)
            env.variables.a = 0;
            expect(obj.execute(env)).to.be.equal(false)
            env.variables.a = 1;
            expect(obj.execute(env)).to.be.equal(true)
        });
        it('not existing variable', async () => {
            const obj = parse("notExisting");
            const env = new Environment();
            env.allowUndefined=false;
            expect(() => obj.execute(env)).to.throw(Error);
            expect(() => obj.execute(env)).to.throw(/Undefined variable: notExisting/);
            expect(() => obj.execute(env)).to.throw(/file.mpts:1:0/);
        })
        it('not existing variable allow undefined', async () => {
            const obj = parse("notExisting");
            const env = new Environment();
            env.allowUndefined=true;
            const result = obj.execute(env);
            expect(result).to.be.equal(null);
        })
        it('not existing property', async () => {
            const obj = parse("a.b.c");
            const env = new Environment();
            env.variables.a = {};
            expect(() => obj.execute(env)).to.throw(MptsExecutionError);
            expect(() => obj.execute(env)).to.throw(/Undefined property: b/);
            expect(() => obj.execute(env)).to.throw(/file\.mpts:1:2/);
        });

        it('not existing property allow undefined', async () => {
            const obj = parse("a.b.c");
            const env = new Environment();
            env.allowUndefined=true;
            env.variables.a = {};
            const result = obj.execute(env);
            expect(result).to.be.equal(null);
        });
        it('test not existing property nullable operator', async () => {
            const obj = parse("a?.b.c");
            const env = new Environment();
            env.allowUndefined = false;
            env.variables.a = {};
            const result = obj.execute(env);
            expect(result).to.be.equal(null);
        });
        it('bad type method call', async () => {
            const obj = parse("a.b()");
            const env = new Environment();
            env.variables.a = {};
            expect(() => obj.execute(env)).to.throw(Error);
             expect(() => obj.execute(env)).to.throw(/method call on non method/);
            expect(() => obj.execute(env)).to.throw(/file\.mpts:1:2/);
        });
        it('not existing method call', async () => {
            const obj = parse("a.c()");
            const env = new Environment();
            env.variables.a = {b: {}};
            expect(() => obj.execute(env)).to.throw(Error);
             expect(() => obj.execute(env)).to.throw(/method don\'t exists/);
            expect(() => obj.execute(env)).to.throw(/file\.mpts:1:3/);
        });
        it('exception inside method call', async () => {
            const obj = parse("a()");
            const env = new Environment();
            env.variables.a = () => {
                throw new Error("inside method error")
            };
            expect(() => obj.execute(env)).to.throw(Error);
            expect(() => obj.execute(env)).to.throw(/inside method error/);
            expect(() => obj.execute(env)).to.throw(/file\.mpts:1:1/);
        });
    });
});
