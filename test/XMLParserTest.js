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
const {TEOrNull} = require("../src/nodes/expressions/TEOrNull");
const {TEProperty} = require("../src/nodes/expressions/TEProperty");
const {TEMethodCall} = require("../src/nodes/expressions/TEMethodCall");
const {UniParserTest} = require("./UniParserTest");

describe('XMLParser', () => {
    UniParserTest(XMLParser);


    it('not closed element', async () => {
        expect(()=>XMLParser.Parse("<div>")).to.throw(MptsParserError);
        expect(()=>XMLParser.Parse("<div>")).to.throw(/Element <div> not closed/);
        expect(()=>XMLParser.Parse("<div>")).to.throw(/1:5/);
    });

    it('bad order of close', async () => {
        expect(()=>XMLParser.Parse("<span><strong></span></strong>")).to.throw(MptsParserError);
        expect(()=>XMLParser.Parse("<span><strong></span></strong>")).to.throw(/Last opened element is not <span>/);
        expect(()=>XMLParser.Parse("<span><strong></span></strong>")).to.throw(/1:14/);
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

})
