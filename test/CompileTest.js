const {XMLParser} = require("../src/parser/XMLParser");
const {TDocumentFragment} = require("../src/nodes/TDocumentFragment");
const {Environment} = require("../src/Environment");
const {expect} = require("chai");
const {JSDOM} = require("jsdom");
const {document} = (new JSDOM(`...`)).window;

function fragmentToHtml(fragment) {
    const div = document.createElement('div');
    for (const childNode of Array.from(fragment.childNodes)) {
        div.append(childNode);
    }
    return div.innerHTML;
}

describe('Compile', () => {
    it('hello world', async () => {
        const obj = XMLParser.Parse("Hello, world!");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        const result = eval(compiled.code + compiled.rootName);
        expect(fragmentToHtml(result)).to.be.equal("Hello, world!");
    });
    it('variable', async () => {
        const obj = XMLParser.Parse("{{a}}{{b}}");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        let variables = {a: 0, b: "b"}
        const result = eval(compiled.code + compiled.rootName);
        expect(fragmentToHtml(result)).to.be.equal("0b");
    });


    it('elements inside', async () => {
        const obj = XMLParser.Parse("<div><p><strong></strong><span></span></p></div>");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        const result = eval(compiled.code + compiled.rootName);
        expect(fragmentToHtml(result)).to.be.equal("<div><p><strong></strong><span></span></p></div>");
    });

    it('element with attributes', async () => {
        const obj = XMLParser.Parse("<div a=\"1\" b='2' c=3 d=d e=(e)></div>");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        let variables = {d: 4, e: 5}
        const result = eval(compiled.code + compiled.rootName);
        expect(fragmentToHtml(result)).to.be.equal("<div a=\"1\" b=\"2\" c=\"3\" d=\"4\" e=\"5\"></div>");
    });
})