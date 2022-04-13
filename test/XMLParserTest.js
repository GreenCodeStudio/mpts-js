const {expect} = require("chai");
const {XMLParser} = require("../src/parser/XMLParser");
const {TDocumentFragment} = require("../src/nodes/TDocumentFragment");
const {TText} = require("../src/nodes/TText");
const {TElement} = require("../src/nodes/TElement");
const {TAttribute} = require("../src/nodes/TAttribute");
const {TExpressionAttribute} = require("../src/nodes/TExpressionAttribute");
const {TEVariable} = require("../src/nodes/expressions/TEVariable");

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
    it('element with attributes', async () => {
        const obj = XMLParser.Parse("<img src=\"a.png\" alt='a'/>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("img");
        expect(obj.children[0].attributes[0]).to.be.instanceOf(TAttribute);
        expect(obj.children[0].attributes[0].name).to.be.equals("src");
        expect(obj.children[0].attributes[0].value).to.be.equals("a.png");
        expect(obj.children[0].attributes[1]).to.be.instanceOf(TAttribute);
        expect(obj.children[0].attributes[1].name).to.be.equals("alt");
        expect(obj.children[0].attributes[1].value).to.be.equals("a");
    });

    it('element with attributes with variables', async () => {
        const obj = XMLParser.Parse("<img src=(v1) alt=v2/>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("img");
        expect(obj.children[0].attributes[0]).to.be.instanceOf(TExpressionAttribute);
        expect(obj.children[0].attributes[0].name).to.be.equals("src");
        expect(obj.children[0].attributes[0].expression).to.be.instanceOf(TEVariable);
        expect(obj.children[0].attributes[0].expression.name).to.be.equal("v1");
        expect(obj.children[0].attributes[1]).to.be.instanceOf(TExpressionAttribute);
        expect(obj.children[0].attributes[1].name).to.be.equals("alt");
        expect(obj.children[0].attributes[1].expression).to.be.instanceOf(TEVariable);
        expect(obj.children[0].attributes[1].expression.name).to.be.equal("v2");
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
        expect(obj.children[0].conditions[0].expression).to.be.instanceOf(TEBool);
        expect(obj.children[0].conditions[0].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].conditions[0].expression).to.be.instanceOf(TEBool);
        expect(obj.children[0].elseChildren[0]).to.be.instanceOf(TText);
    });
})