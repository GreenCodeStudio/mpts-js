import {expect} from "chai";

import {XMLParser} from "../src/parser/XMLParser.js";

import {TDocumentFragment} from "../src/nodes/TDocumentFragment.js";

import {Environment} from "../src/Environment.js";


import {JSDOM} from "jsdom";

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
        const obj = XMLParser.Parse("<div a=\"1\" b='2' c=3 d=d e=(e) ></div>");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        let variables = {d: 4, e: 5}
        const result = eval(compiled.code + compiled.rootName);
        expect(fragmentToHtml(result)).to.be.equal("<div a=\"1\" b=\"2\" c=\"3\" d=\"4\" e=\"5\"></div>");
    });
    it('foreach basic', async () => {
        const obj = XMLParser.Parse("<:foreach collection=a>b</:foreach>");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        let variables = {a: [1, 2, 3, 4, 5]};
        const result = eval(compiled.code + compiled.rootName);
        expect(result.textContent).to.be.equal("bbbbb");
    })
    it('if basic', async () => {
        const obj = XMLParser.Parse("<:if condition=true>a</:if>");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;

        let variables = {};
        const result1 = eval(compiled.code + compiled.rootName);
        expect(result1.textContent).to.be.equal("a");
    })
    it('if basic2', async () => {
        const obj = XMLParser.Parse("<:if condition=a>a</:if><:else-if condition=b>b</:else-if><:else>c</:else>");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;

        let variables = {a: false, b: true};
        const result1 = eval(compiled.code + compiled.rootName);
        expect(result1.textContent).to.be.equal("b");


        variables = {a: true, b: true};
        const result2 = eval(compiled.code + compiled.rootName);
        expect(result2.textContent).to.be.equal("a");


        variables = {a: false, b: false};
        const result3 = eval(compiled.code + compiled.rootName);
        expect(result3.textContent).to.be.equal("c");


    })
    it('foreach advanced', async () => {
        const obj = XMLParser.Parse("<:foreach collection=a item=b key=c><div data-c=c>{{c}}:{{b}}</div></:foreach>");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        let variables = {a: ['a', 'b', 'c', 'd', 'e']};
        const result = eval(compiled.code + compiled.rootName);
        expect(fragmentToHtml(result)).to.be.equal("<div data-c=\"0\">0:a</div><div data-c=\"1\">1:b</div><div data-c=\"2\">2:c</div><div data-c=\"3\">3:d</div><div data-c=\"4\">4:e</div>");
    })
    it('foreach advanced2', async () => {
        const obj = XMLParser.Parse("<:foreach collection=a item=b><:if condition=true>{{b.name}}</:if></:foreach>");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        let variables = {a: [{name: 'c'}, {name: 'd'}]};
        const result = eval(compiled.code + compiled.rootName);
        expect(fragmentToHtml(result)).to.be.equal("cd");
    })
    it('attribute concat', async () => {
        const obj = XMLParser.Parse("<div ab=\"cd\":x:\"gh\" />");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        let variables = {x: 'ef'}
        const result = eval(compiled.code + compiled.rootName);
        expect(fragmentToHtml(result)).to.be.equal("<div ab=\"cdefgh\" ></div>");
    });
    it('disabled', async () => {
        const obj = XMLParser.Parse("<input disabled=(a==1) /><input disabled=(a==2) />");
        const compiled = obj.compileJS();
        const document = (new JSDOM(`...`)).window.document;
        let variables = {a:1}
        const result = eval(compiled.code + compiled.rootName);
        expect(result.children[0].disabled).to.be.equal(true);
        expect(result.children[1].disabled).to.be.equal(false);
    });
})
