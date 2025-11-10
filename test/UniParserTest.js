import {expect} from "chai";
import {TDocumentFragment} from "../src/nodes/TDocumentFragment.js";
import {TText} from "../src/nodes/TText.js";
import {TElement} from "../src/nodes/TElement.js";
import {MptsParserError} from "../src/parser/MptsParserError.js";
import {TAttribute} from "../src/nodes/TAttribute.js";
import {TEString} from "../src/nodes/expressions/TEString.js";
import {TEVariable} from "../src/nodes/expressions/TEVariable.js";
import {TEMethodCall} from "../src/nodes/expressions/TEMethodCall.js";
import {TComment} from "../src/nodes/TComment.js";
import {TIf} from "../src/nodes/TIf.js";
import {TEBoolean} from "../src/nodes/expressions/TEBoolean.js";
import {TLoop} from "../src/nodes/TLoop.js";
import {TENumber} from "../src/nodes/expressions/TENumber.js";
import {TForeach} from "../src/nodes/TForeach.js";

export function UniParserTest(parser){
    it('basic text', async () => {
        const obj = parser.Parse("Hello, world!");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].text).to.be.equals("Hello, world!");
    });

    it('basic element', async () => {
        const obj = parser.Parse("<br/>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("br");
    });
    it('basic element2', async () => {
        const obj = parser.Parse("<div></div>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("div");
    });

    it('not opened element', async () => {
        expect(()=>parser.Parse("<section></div>")).to.throw(MptsParserError);
        expect(()=>parser.Parse("<section></div>")).to.throw(/Last opened element is not <div> but <section>/);
        expect(()=>parser.Parse("<section></div>")).to.throw(/1:9/);
    });

    it('not opened element2', async () => {
        expect(()=>parser.Parse("</div>")).to.throw(MptsParserError);
        expect(()=>parser.Parse("</div>")).to.throw(/There is no opened elements, <div> closed/);
        expect(()=>parser.Parse("</div>")).to.throw(/1:0/);
    });

    it('elementsinside', async () => {
        const obj = parser.Parse("<div><p><strong></strong><span></span></p></div>");
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
        const obj = parser.Parse("<img src=\"a.png\" alt='a'/>");
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
        const obj = parser.Parse("<img src=(v1) alt=v2 class=(getClass())/>");
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
        expect(obj.children[0].attributes[2]).to.be.instanceOf(TAttribute);
        expect(obj.children[0].attributes[2].name).to.be.equals("class");
        expect(obj.children[0].attributes[2].expression).to.be.instanceOf(TEMethodCall);
        expect(obj.children[0].attributes[2].expression.source).to.be.instanceOf(TEVariable);
        expect(obj.children[0].attributes[2].expression.source.name).to.be.equal("getClass");
    });
    it('element with syntax error in attribute', async () => {
      expect(()=>parser.Parse("<img src=.value/>")).to.throw(MptsParserError);
      expect(()=>parser.Parse("<img src=.value/>")).to.throw(/source object expected before dot/);
      expect(()=>parser.Parse("<img src=.value/>", "file.mpts")).to.throw(/file\.mpts:1:9/);
    })

    it('element with boolean atributes', async () => {
        const obj = parser.Parse("<textarea required/>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("textarea");
        expect(obj.children[0].attributes[0]).to.be.instanceOf(TAttribute);
        expect(obj.children[0].attributes[0].name).to.be.equals("required");
        expect(obj.children[0].attributes[0].expression).to.be.equal(null);
    });

    it('comment', async () => {
        const obj = parser.Parse("<!--comment-->");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TComment);
        expect(obj.children[0].text).to.be.equals("comment");
    });

    it('2 comments', async () => {
        const obj = parser.Parse("<!--comment1--><!--comment2-->");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TComment);
        expect(obj.children[0].text).to.be.equals("comment1");
        expect(obj.children[1]).to.be.instanceOf(TComment);
        expect(obj.children[1].text).to.be.equals("comment2");
    });

    it('if', async () => {
        const whitespace=' \t\n\r'
        const obj = parser.Parse("<:if condition=false>text</:if>"+whitespace+"<:else>text</:else>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TIf);
        expect(obj.children[0].conditions[0].expression).to.be.instanceOf(TEBoolean);
        expect(obj.children[0].conditions[0].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].else.children[0]).to.be.instanceOf(TText);
    });
    it('else-if', async () => {
        const whitespace=' \t\n\r'
        const obj = parser.Parse("<:if condition=false>text</:if>"+whitespace+"<:else-if condition=false>text</:else-if>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TIf);
        expect(obj.children[0].conditions[0].expression).to.be.instanceOf(TEBoolean);
        expect(obj.children[0].conditions[0].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].conditions[1].expression).to.be.instanceOf(TEBoolean);
        expect(obj.children[0].conditions[1].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].else).to.be.null;
    });
    it('else-if-else', async () => {
        const whitespace=' \t\n\r'
        const obj = parser.Parse("<:if condition=false>text</:if>"+whitespace+"<:else-if condition=false>text</:else-if><:else>text</:else>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TIf);
        expect(obj.children[0].conditions[0].expression).to.be.instanceOf(TEBoolean);
        expect(obj.children[0].conditions[0].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].conditions[1].expression).to.be.instanceOf(TEBoolean);
        expect(obj.children[0].conditions[1].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].else.children[0]).to.be.instanceOf(TText);
    });
    it('loop', async () => {
        const obj = parser.Parse("<:loop count=10>b</:loop>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TLoop);
        expect(obj.children[0].count).to.be.instanceOf(TENumber);
        expect(obj.children[0].count.value).to.be.equal(10);
        expect(obj.children[0].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].children[0].text).to.be.equal('b');
    })
    it('foreach basic', async () => {
        const obj = parser.Parse("<:foreach collection=a>b</:foreach>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TForeach);
        expect(obj.children[0].collection).to.be.instanceOf(TEVariable);
        expect(obj.children[0].collection.name).to.be.equal('a');
        expect(obj.children[0].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].children[0].text).to.be.equal('b');
    });
    it('foreach advanced', async () => {
        const obj = parser.Parse("<:foreach collection=a item=b key=c><div>{{c}}:{{b}}</div></:foreach>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TForeach);
        expect(obj.children[0].collection).to.be.instanceOf(TEVariable);
        expect(obj.children[0].collection.name).to.be.equal('a');
        expect(obj.children[0].item).to.be.equal('b');
        expect(obj.children[0].key).to.be.equal('c');
        expect(obj.children[0].children[0]).to.be.instanceOf(TElement);
    });
    it('foreach inside element', async () => {
        const obj = parser.Parse("<select><:foreach collection=a>b</:foreach></select>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].children[0]).to.be.instanceOf(TForeach);
    });

    it('complex expression in attribute', async () => {
        const obj = parser.Parse('<div data-value=(a + b * c)></div>');
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].attributes[0]).to.be.instanceOf(TAttribute);
        const attr = obj.children[0].attributes[0];
        expect(attr.name).to.be.equal("data-value");
    });

    it('nested loops', async () => {
        const obj = parser.Parse('<:loop count=2><:loop count=3>test</:loop></:loop>');
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TLoop);
        expect(obj.children[0].children[0]).to.be.instanceOf(TLoop);
        expect(obj.children[0].children[0].children[0]).to.be.instanceOf(TText);
        expect(obj.children[0].count.value).to.be.equal(2);
        expect(obj.children[0].children[0].count.value).to.be.equal(3);
    });

    it('nested conditions', async () => {
        const obj = parser.Parse('<:if condition=true><:if condition=false>test</:if></:if>');
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TIf);
        expect(obj.children[0].conditions[0].children[0]).to.be.instanceOf(TIf);
        expect(obj.children[0].conditions[0].expression.value).to.be.equal(true);
        expect(obj.children[0].conditions[0].children[0].conditions[0].expression.value).to.be.equal(false);
    });

    it('comment after element', async () => {
        const obj = parser.Parse("<tr data-amount=article.amount><!--comment--></tr>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].children[0]).to.be.instanceOf(TComment);
    });

    it('comment with special characters', async () => {
        const obj = parser.Parse("<!-- comment with < > & \" ' -->");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TComment);
        expect(obj.children[0].text).to.be.equals(" comment with < > & \" ' ");
    });

    it('attribute with single quotes', async () => {
        const obj = parser.Parse("<div attr='value'></div>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        const attr = obj.children[0].attributes[0];
        expect(attr).to.be.instanceOf(TAttribute);
        expect(attr.name).to.be.equals("attr");
        expect(attr.expression).to.be.instanceOf(TEString);
        expect(attr.expression.value).to.be.equal("value");
    });

    it('DTD html5', async () => {
        const obj = parser.Parse("<!DOCTYPE html>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TDocumentType)
        expect(obj.children[0].text).to.be.equal('html');
    });

    it('DTD custom', async ()=>{
        const obj = parser.Parse("<!DOCTYPE PUBLIC SYSTEM \"file.dtd\">");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TDocumentType)
        expect(obj.children[0].text).to.be.equal('PUBLIC SYSTEM "file.dtd"');
    })

}
