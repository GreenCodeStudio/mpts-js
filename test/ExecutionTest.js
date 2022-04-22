const {XMLParser} = require("../src/parser/XMLParser");
const {TDocumentFragment} = require("../src/nodes/TDocumentFragment");
const {Environment} = require("../src/Environment");
const {expect} = require("chai");
const {JSDOM} = require("jsdom");
const {document} = (new JSDOM(`...`)).window;

function fragmentToHtml(fragment) {
    const div = document.createElement('div');
    for (const childNode of fragment.childNodes) {
        div.append(childNode);
    }
    return div.innerHTML;
}

describe('Execution', () => {
    it('basic text', async () => {
        const obj = XMLParser.Parse("Hello, world!");
        const env = new Environment();
        env.document = document;
        const result = obj.execute(env);
        expect(fragmentToHtml(result)).to.be.equal("Hello, world!");
    });

    it('encoded text', async () => {
        const obj = XMLParser.Parse("&lt;&#65;&#x0042;&copy;&amp;&gt;");
        const env = new Environment();
        env.document = document;
        const result = obj.execute(env);
        expect(result.textContent).to.be.equal("<AB©&>");
    });
    it('encoded text from variable', async () => {
        const obj = XMLParser.Parse("{{element}}");
        const env = new Environment();
        env.document = document;
        env.variables.element = "<div></div>";
        const result = obj.execute(env);
        expect(result.textContent).to.be.equal("<div></div>");
    });
    it('basic element', async () => {
        const obj = XMLParser.Parse("<br/>");
        const env = new Environment();
        env.document = document;
        const result = obj.execute(env);
        expect(fragmentToHtml(result)).to.be.equal("<br>");
    });

    it('elements inside', async () => {
        const obj = XMLParser.Parse("<div><p><strong></strong><span></span></p></div>");
        const env = new Environment();
        env.document = document;
        const result = obj.execute(env);
        expect(fragmentToHtml(result)).to.be.equal("<div><p><strong></strong><span></span></p></div>");
    });
    it('basic html', async () => {
        const obj = XMLParser.Parse("<div>&#65;&#x0042;{{c}}</div>");
        const env = new Environment();
        env.document = document;
        env.variables.c = "C";
        const result = obj.execute(env);
        expect(fragmentToHtml(result)).to.be.equal("<div>ABC</div>");
    });
    it('element with attributes', async () => {
        const obj = XMLParser.Parse("<div a=\"1\" b='2' c=3 d=d e=(e)></div>");
        const env = new Environment();
        env.document = document;
        env.variables.d = 4;
        env.variables.e = 5;
        const result = obj.execute(env);
        expect(fragmentToHtml(result)).to.be.equal("<div a=\"1\" b=\"2\" c=\"3\" d=\"4\" e=\"5\"></div>");
    });
    it('if else', async () => {
        const obj = XMLParser.Parse('<:if condition=(v==1)>a</:if><:else-if condition=(v==2)>b</:else-if><:else>c</:else>');
        const env = new Environment();
        env.document = document;

        env.variables.v = 1;
        const result1 = obj.execute(env);
        expect(fragmentToHtml(result1)).to.be.equal("a");

        env.variables.v = 2;
        const result2 = obj.execute(env);
        expect(fragmentToHtml(result2)).to.be.equal("b");

        env.variables.v = 3;
        const result3 = obj.execute(env);
        expect(fragmentToHtml(result3)).to.be.equal("c");

    });

    it('loop', async () => {
        const obj = XMLParser.Parse("<:loop count=10>b</:loop>");
        const env = new Environment();
        env.document = document;
        const result = obj.execute(env);
        expect(result.textContent).to.be.equal("bbbbbbbbbb");
    })
    it('foreach basic', async () => {
        const obj = XMLParser.Parse("<:foreach collection=a>b</:foreach>");
        const env = new Environment();
        env.document = document;
        env.variables.a = [1,2,3,4,5];
        const result = obj.execute(env);
        expect(result.textContent).to.be.equal("bbbbb");
    })
    it('foreach advanced', async () => {
        const obj = XMLParser.Parse("<:foreach collection=a item=b key=c><div>{{c}}:{{b}}</div></:foreach>");
        const env = new Environment();
        env.document = document;
        env.variables.a = ['a','b','c','d','e'];
        const result = obj.execute(env);
        expect(fragmentToHtml(result)).to.be.equal("<div>0:a</div><div>1:b</div><div>2:c</div><div>3:d</div><div>4:e</div>");
    })
})