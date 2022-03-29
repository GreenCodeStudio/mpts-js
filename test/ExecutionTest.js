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

describe('ExecutionText', () => {
    it('hello world', async () => {
        const obj = XMLParser.Parse("Hello, world!");
        const env = new Environment();
        env.document = document;
        const result = obj.execute(env);
        expect(fragmentToHtml(result)).to.be.equal("Hello, world!");
    });
    it('basic html', async () => {
        const obj = XMLParser.Parse("<div>&#65;&#x0042;{{c}}</div>");
        const env = new Environment();
        env.document = document;
        env.variables.c = "C";
        const html = obj.execute(env).outerHTML;
        expect(html).to.be.equal("<div>ABC</div>");
    });
})