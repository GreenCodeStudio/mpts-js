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

describe('Compile', () => {
    it('hello world', async () => {
        const obj = XMLParser.Parse("Hello, world!");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        const result = eval(compiled.code+compiled.rootName);
        expect(fragmentToHtml(result)).to.be.equal("Hello, world!");
    });
})