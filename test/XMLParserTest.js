const {expect} = require("chai");
const {XMLParser} = require("../src/parser/XMLParser");
const {TDocumentFragment} = require("../src/nodes/TDocumentFragment");
const {TText} = require("../src/nodes/TText");
const {TElement} = require("../src/nodes/TElement");
const {TAttribute} = require("../src/nodes/TAttribute");
const {TIf} = require("../src/nodes/TIf");
const {TEVariable} = require("../src/nodes/expressions/TEVariable");
const {TEString} = require("../src/nodes/expressions/TEString");
const {TEBoolean} = require("../src/nodes/expressions/TEBoolean");
const {TENumber} = require("../src/nodes/expressions/TENumber");
const {TLoop} = require("../src/nodes/TLoop");
const {TComment} = require("../src/nodes/TComment");
const {TForeach} = require("../src/nodes/TForeach");
const {MptsParserError} = require("../src/parser/MptsParserError");

describe('Parser', () => {
    it('basic text', async () => {
        const obj = XMLParser.Parse("Hello, world!");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].text).to.be.equals("Hello, world!");
    });

    it('basic element', async () => {
        const obj = XMLParser.Parse("<br/>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("br");
    });
    it('basic element2', async () => {
        const obj = XMLParser.Parse("<div></div>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("div");
    });
    it('not closed element', async () => {
        expect(()=>XMLParser.Parse("<div>")).to.throw(MptsParserError);
        expect(()=>XMLParser.Parse("<div>")).to.throw(/Element <div> not closed/);
        expect(()=>XMLParser.Parse("<div>")).to.throw(/1:5/);
    });
    it('not opened element', async () => {
        expect(()=>XMLParser.Parse("</div>")).to.throw(MptsParserError);
        expect(()=>XMLParser.Parse("</div>")).to.throw(/Last opened element is not <div>/);
        expect(()=>XMLParser.Parse("</div>")).to.throw(/1:0/);
    });
    it('elementsinside', async () => {
        const obj = XMLParser.Parse("<div><p><strong></strong><span></span></p></div>");
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("div");
        expect(obj.children[0].children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].children[0].tagName).to.be.equals("p");
        expect(obj.children[0].children[0].children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].children[0].children[0].tagName).to.be.equals("strong");
        expect(obj.children[0].children[0].children[1]).to.be.instanceOf(TElement);
        expect(obj.children[0].children[0].children[1].tagName).to.be.equals("span");
    });
    it('bad order of close', async () => {
        expect(()=>XMLParser.Parse("<span><strong></span></strong>")).to.throw(MptsParserError);
        expect(()=>XMLParser.Parse("<span><strong></span></strong>")).to.throw(/Last opened element is not <span>/);
    });
    it('element with attributes', async () => {
        const obj = XMLParser.Parse("<img src=\"a.png\" alt='a'/>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("img");
        expect(obj.children[0].attributes[0]).to.be.instanceOf(TAttribute);
        expect(obj.children[0].attributes[0].name).to.be.equals("src");
        expect(obj.children[0].attributes[0].expression).to.be.instanceOf(TEString);
        expect(obj.children[0].attributes[0].expression.value).to.be.equal("a.png");
        expect(obj.children[0].attributes[1]).to.be.instanceOf(TAttribute);
        expect(obj.children[0].attributes[1].name).to.be.equals("alt");
        expect(obj.children[0].attributes[1].expression).to.be.instanceOf(TEString);
        expect(obj.children[0].attributes[1].expression.value).to.be.equal("a");
    });

    it('element with attributes with variables', async () => {
        const obj = XMLParser.Parse("<img src=(v1) alt=v2/>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("img");
        expect(obj.children[0].attributes[0]).to.be.instanceOf(TAttribute);
        expect(obj.children[0].attributes[0].name).to.be.equals("src");
        expect(obj.children[0].attributes[0].expression).to.be.instanceOf(TEVariable);
        expect(obj.children[0].attributes[0].expression.name).to.be.equal("v1");
        expect(obj.children[0].attributes[1]).to.be.instanceOf(TAttribute);
        expect(obj.children[0].attributes[1].name).to.be.equals("alt");
        expect(obj.children[0].attributes[1].expression).to.be.instanceOf(TEVariable);
        expect(obj.children[0].attributes[1].expression.name).to.be.equal("v2");
    });

    it('element with boolean atributes', async () => {
        const obj = XMLParser.Parse("<textarea required/>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("textarea");
        expect(obj.children[0].attributes[0]).to.be.instanceOf(TAttribute);
        expect(obj.children[0].attributes[0].name).to.be.equals("required");
        expect(obj.children[0].attributes[0].expression).to.be.equal(null);
    });

    it('comment', async () => {
        const obj = XMLParser.Parse("<!--comment-->");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TComment);
        expect(obj.children[0].text).to.be.equals("comment");
    });

    it('if', async () => {
        const obj = XMLParser.Parse("<:if condition=false>text</:if><:else>text</:else>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TIf);
        expect(obj.children[0].conditions[0].expression).to.be.instanceOf(TEBoolean);
        expect(obj.children[0].conditions[0].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].else.children[0]).to.be.instanceOf(TText);
    });
    it('loop', async () => {
        const obj = XMLParser.Parse("<:loop count=10>b</:loop>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TLoop);
        expect(obj.children[0].count).to.be.instanceOf(TENumber);
        expect(obj.children[0].count.value).to.be.equal(10);
        expect(obj.children[0].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].children[0].text).to.be.equal('b');
    })
    it('foreach basic', async () => {
        const obj = XMLParser.Parse("<:foreach collection=a>b</:foreach>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TForeach);
        expect(obj.children[0].collection).to.be.instanceOf(TEVariable);
        expect(obj.children[0].collection.name).to.be.equal('a');
        expect(obj.children[0].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].children[0].text).to.be.equal('b');
    });
    it('foreach advanced', async () => {
        const obj = XMLParser.Parse("<:foreach collection=a item=b key=c><div>{{c}}:{{b}}</div></:foreach>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TForeach);
        expect(obj.children[0].collection).to.be.instanceOf(TEVariable);
        expect(obj.children[0].collection.name).to.be.equal('a');
        expect(obj.children[0].item).to.be.equal('b');
        expect(obj.children[0].key).to.be.equal('c');
        expect(obj.children[0].children[0]).to.be.instanceOf(TElement);
    });
    it('foreach inside element', async () => {
        const obj = XMLParser.Parse("<select><:foreach collection=a>b</:foreach></select>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].children[0]).to.be.instanceOf(TForeach);
    });
})