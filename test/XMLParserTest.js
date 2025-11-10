import {expect} from "chai";
import {XMLParser} from "../src/parser/XMLParser.js";
import {TDocumentFragment} from "../src/nodes/TDocumentFragment.js";
import {TElement} from "../src/nodes/TElement.js";
import {TAttribute} from "../src/nodes/TAttribute.js";
import {TEVariable} from "../src/nodes/expressions/TEVariable.js";
import {TEString} from "../src/nodes/expressions/TEString.js";
import {MptsParserError} from "../src/parser/MptsParserError.js";
import {TEOrNull} from "../src/nodes/expressions/TEOrNull.js";
import {TEProperty} from "../src/nodes/expressions/TEProperty.js";
import {TEMethodCall} from "../src/nodes/expressions/TEMethodCall.js";
import {UniParserTest} from "./UniParserTest.js";

describe('XMLParser', () => {
    UniParserTest(XMLParser);


    it('not closed element', async () => {
        expect(() => XMLParser.Parse("<div>")).to.throw(MptsParserError);
        expect(() => XMLParser.Parse("<div>")).to.throw(/Element <div> not closed/);
        expect(() => XMLParser.Parse("<div>", "file.mpts")).to.throw(/file\.mpts:1:5/);
    });

    it('bad order of close', async () => {
        expect(() => XMLParser.Parse("<span><strong></span></strong>")).to.throw(MptsParserError);
        expect(() => XMLParser.Parse("<span><strong></span></strong>")).to.throw(/Last opened element is not <span> but <strong>/);
        expect(() => XMLParser.Parse("<span><strong></span></strong>", "file.mpts")).to.throw(/file\.mpts:1:14/);
    });

    describe('cases from real life', () => {
        it('1', async () => {
            const obj = XMLParser.Parse("<input name=\"realizationTime\" type=\"number\" step=\"0.01\" value=(data.realizationTime??t('roomsList.sumPrice.realizationTime.value')) />");
            expect(obj).to.be.instanceOf(TDocumentFragment);
            expect(obj.children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].attributes[0]).to.be.instanceOf(TAttribute);
            expect(obj.children[0].attributes[0].name).to.be.equals("name");
            expect(obj.children[0].attributes[0].expression).to.be.instanceOf(TEString);
            expect(obj.children[0].attributes[0].expression.value).to.be.equal("realizationTime");
            expect(obj.children[0].attributes[1]).to.be.instanceOf(TAttribute);
            expect(obj.children[0].attributes[1].name).to.be.equals("type");
            expect(obj.children[0].attributes[1].expression).to.be.instanceOf(TEString);
            expect(obj.children[0].attributes[1].expression.value).to.be.equal("number");
            expect(obj.children[0].attributes[2]).to.be.instanceOf(TAttribute);
            expect(obj.children[0].attributes[2].name).to.be.equals("step");
            expect(obj.children[0].attributes[2].expression).to.be.instanceOf(TEString);
            expect(obj.children[0].attributes[2].expression.value).to.be.equal("0.01");
            expect(obj.children[0].attributes[3]).to.be.instanceOf(TAttribute);
            expect(obj.children[0].attributes[3].name).to.be.equals("value");
            expect(obj.children[0].attributes[3].expression).to.be.instanceOf(TEOrNull);
            expect(obj.children[0].attributes[3].expression.left).to.be.instanceOf(TEProperty);
            expect(obj.children[0].attributes[3].expression.left.source).to.be.instanceOf(TEVariable);
            expect(obj.children[0].attributes[3].expression.right).to.be.instanceOf(TEMethodCall);
            expect(obj.children[0].attributes[3].expression.right.source).to.be.instanceOf(TEVariable);

        });
    });
    it('ignore XmlDeclaration', () => {
        const obj = XMLParser.Parse("<?xml version=\"1.0\" encoding=\"UTF-8\"?><div></div>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children.length).to.be.equal(1);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equal("div");
    });
});
