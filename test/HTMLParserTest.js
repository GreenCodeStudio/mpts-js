import {expect} from "chai";
import {TDocumentFragment} from "../src/nodes/TDocumentFragment.js";
import {TText} from "../src/nodes/TText.js";
import {TElement} from "../src/nodes/TElement.js";
import {MptsParserError} from "../src/parser/MptsParserError.js";
import {UniParserTest} from "./UniParserTest.js";
import {HTMLParser} from "../src/parser/HTMLParser.js";

describe('HTMLParser', () => {
    UniParserTest(HTMLParser);


    it('not closed element', async () => {
        const obj = HTMLParser.Parse("<div>");
        expect(obj).to.be.instanceOf(TDocumentFragment);
        expect(obj.children[0]).to.be.instanceOf(TElement);
        expect(obj.children[0].tagName).to.be.equals("div");
    });

    it('bad order of close', async () => {
        expect(() => HTMLParser.Parse("<span><strong></span></strong>")).to.throw(MptsParserError);
        expect(() => HTMLParser.Parse("<span><strong></span></strong>")).to.throw(/There is no opened elements, <strong> closed/);
        expect(() => HTMLParser.Parse("<span><strong></span></strong>", "file.mpts")).to.throw(/file.mpts:0:11/);
    });
    describe('auto closing tags', async () => {
        const tags = [
            'area',
            'base',
            'br',
            'col',
            'embed',
            'hr',
            'img',
            'input',
            'link',
            'meta',
            'param',
            'source',
            'track',
            'wbr'
        ];
        for (const tag of tags) {
            it('auto closing <' + tag + '>', async () => {
                const tagCase = tag.split().map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');

                const obj = HTMLParser.Parse("<" + tagCase + ">after");
                expect(obj).to.be.instanceOf(TDocumentFragment);
                expect(obj.children[0]).to.be.instanceOf(TElement);
                expect(obj.children[0].tagName).to.be.equal(tagCase);
                expect(obj.children[1]).to.be.instanceOf(TText);
                expect(obj.children[1].text).to.be.equal(after);
            });
        }
    });
    describe('ommiting tags', () => {
        it('typeDeep', async () => {
            const obj = HTMLParser.Parse("<div><div><div>");
            expect(obj).to.be.instanceOf(TDocumentFragment);
            expect(obj.children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].tagName).to.be.equals("div");
            expect(obj.children[0].children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[0].tagName).to.be.equals("div");
            expect(obj.children[0].children[0].children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[0].children[0].tagName).to.be.equals("div");
        });

        it('typeNotDeep', async () => {
            const obj = HTMLParser.Parse("<p><p><p>");
            expect(obj).to.be.instanceOf(TDocumentFragment);
            expect(obj.children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].tagName).to.be.equals("p");
            expect(obj.children[1]).to.be.instanceOf(TElement);
            expect(obj.children[1].tagName).to.be.equals("p");
            expect(obj.children[2]).to.be.instanceOf(TElement);
            expect(obj.children[2].tagName).to.be.equals("p");
        });
        it('p closed by parent', async () => {
            const obj = HTMLParser.Parse("<div><p>content</div>");
            expect(obj).to.be.instanceOf(TDocumentFragment);
            expect(obj.children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].tagName).to.be.equals("div");
            expect(obj.children[0].children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[0].tagName).to.be.equals("p");
            expect(obj.children[0].children[0].children[0]).to.be.instanceOf(TText);
            expect(obj.children[0].children[0].children[0].text).to.be.equal("content");
        });
        describe('p closed by nextElement', async () => {
            const options = ['address', 'article', 'aside', 'blockquote', 'dir', 'div', 'dl', 'fieldset', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'menu', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul',]
            for (const option of options) {

                it('p closed by nextElement <' + option + '>', async () => {

                    const obj = HTMLParser.Parse("<p>content<" + option + " />after");
                    expect(obj).to.be.instanceOf(TDocumentFragment);
                    expect(obj.children[0]).to.be.instanceOf(TElement);
                    expect(obj.children[0].tagName).to.be.equals("p");
                    expect(obj.children[1]).to.be.instanceOf(TElement);
                    expect(obj.children[1].tagName).to.be.equals(option);
                    expect(obj.children[2]).to.be.instanceOf(TText);
                    expect(obj.children[2].text).to.be.equals('after');
                });
            }
        })
        describe('autoclose by next occurence', async () => {
            const options = ['p','optgroup', 'option']
            for (const option of options) {

                it('autoclose by next occurence <' + option + '>', async () => {

                    const obj = HTMLParser.Parse("<"+option+"><" + option + ">");
                    expect(obj).to.be.instanceOf(TDocumentFragment);
                    expect(obj.children[0]).to.be.instanceOf(TElement);
                    expect(obj.children[0].tagName).to.be.equals(option);
                    expect(obj.children[1]).to.be.instanceOf(TElement);
                    expect(obj.children[1].tagName).to.be.equals(option);
                });
            }
        })        ;


        it('optgroup', async () => {
            const obj = HTMLParser.Parse("<select><option>1<optgroup><option>2<option>3</select>");
            expect(obj).to.be.instanceOf(TDocumentFragment);
            expect(obj.children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].tagName).to.be.equals("select");
            expect(obj.children[0].children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[0].tagName).to.be.equals("option");
            expect(obj.children[0].children[0].children[0]).to.be.instanceOf(TText);
            expect(obj.children[0].children[0].children[0].text).to.be.equals("1");
            expect(obj.children[0].children[1].tagName).to.be.equals("optgroup");
            expect(obj.children[0].children[1].children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[1].children[0].tagName).to.be.equals("option");
            expect(obj.children[0].children[1].children[0].children[0].text).to.be.equals("2");
            expect(obj.children[0].children[1].children[1].tagName).to.be.equals("option");
            expect(obj.children[0].children[1].children[1].children[0].text).to.be.equals("3");
        });
        it('p not closed by nextElement', async () => {
            const obj = HTMLParser.Parse("<p>content<nonexisitng>subcontent</nonexisitng>");
            expect(obj).to.be.instanceOf(TDocumentFragment);
            expect(obj.children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].tagName).to.be.equals("p");
            expect(obj.children[0].children[0]).to.be.instanceOf(TText);
            expect(obj.children[0].children[0].text).to.be.equal('content');
            expect(obj.children[0].children[1]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[1].tagName).to.be.equals("nonexisitng");
            expect(obj.children[0].children[1].children[0]).to.be.instanceOf(TText);
            expect(obj.children[0].children[1].children[0].text).to.be.equal("subcontent");
        });
        it('typeMix', async () => {
            const obj = HTMLParser.Parse("<div><br><section>");
            expect(obj).to.be.instanceOf(TDocumentFragment);
            expect(obj.children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].tagName).to.be.equals("div");
            expect(obj.children[0].children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[0].tagName).to.be.equals("br");
            expect(obj.children[0].children[1]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[1].tagName).to.be.equals("section");
        });
        it('ul li', async () => {
            const obj = HTMLParser.Parse("<ul><li>one<li>two<li>three</ul>");

            expect(obj).to.be.instanceOf(TDocumentFragment);
            expect(obj.children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].tagName).to.be.equals("ul");
            expect(obj.children[0].children[0]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[0].tagName).to.be.equals("li");
            expect(obj.children[0].children[0].children[0]).to.be.instanceOf(TText);
            expect(obj.children[0].children[0].children[0].text).to.be.equals("one");
            expect(obj.children[0].children[1]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[1].tagName).to.be.equals("li");
            expect(obj.children[0].children[1].children[0]).to.be.instanceOf(TText);
            expect(obj.children[0].children[1].children[0].text).to.be.equals("two");
            expect(obj.children[0].children[2]).to.be.instanceOf(TElement);
            expect(obj.children[0].children[2].tagName).to.be.equals("li");
            expect(obj.children[0].children[2].children[0]).to.be.instanceOf(TText);
            expect(obj.children[0].children[2].children[0].text).to.be.equals("three");
        });
        it('dt element ommiting end tag', async () => {
            // Test dt element followed by another dt element
            const obj1 = HTMLParser.Parse("<dl><dt>term1<dt>term2<dd>def</dd></dl>");
            expect(obj1).to.be.instanceOf(TDocumentFragment);
            expect(obj1.children[0]).to.be.instanceOf(TElement);
            expect(obj1.children[0].tagName).to.be.equals("dl");
            expect(obj1.children[0].children[0]).to.be.instanceOf(TElement);
            expect(obj1.children[0].children[0].tagName).to.be.equals("dt");
            expect(obj1.children[0].children[0].children[0]).to.be.instanceOf(TText);
            expect(obj1.children[0].children[0].children[0].text).to.be.equals("term1");
            expect(obj1.children[0].children[1]).to.be.instanceOf(TElement);
            expect(obj1.children[0].children[1].tagName).to.be.equals("dt");
            expect(obj1.children[0].children[1].children[0]).to.be.instanceOf(TText);
            expect(obj1.children[0].children[1].children[0].text).to.be.equals("term2");
            expect(obj1.children[0].children[2]).to.be.instanceOf(TElement);
            expect(obj1.children[0].children[2].tagName).to.be.equals("dd");
            expect(obj1.children[0].children[2].children[0]).to.be.instanceOf(TText);
            expect(obj1.children[0].children[2].children[0].text).to.be.equals("def");

            // Test dt element followed by dd element
            const obj2 = HTMLParser.Parse("<dl><dt>term<dd>def1<dd>def2</dd></dl>");
            expect(obj2).to.be.instanceOf(TDocumentFragment);
            expect(obj2.children[0]).to.be.instanceOf(TElement);
            expect(obj2.children[0].tagName).to.be.equals("dl");
            expect(obj2.children[0].children[0]).to.be.instanceOf(TElement);
            expect(obj2.children[0].children[0].tagName).to.be.equals("dt");
            expect(obj2.children[0].children[0].children[0]).to.be.instanceOf(TText);
            expect(obj2.children[0].children[0].children[0].text).to.be.equals("term");
            expect(obj2.children[0].children[1]).to.be.instanceOf(TElement);
            expect(obj2.children[0].children[1].tagName).to.be.equals("dd");
            expect(obj2.children[0].children[1].children[0]).to.be.instanceOf(TText);
            expect(obj2.children[0].children[1].children[0].text).to.be.equals("def1");
            expect(obj2.children[0].children[2]).to.be.instanceOf(TElement);
            expect(obj2.children[0].children[2].tagName).to.be.equals("dd");
            expect(obj2.children[0].children[2].children[0]).to.be.instanceOf(TText);
            expect(obj2.children[0].children[2].children[0].text).to.be.equals("def2");
        });
        /*
        8.1.2.4 Optional tags

An rt element's end tag may be omitted if the rt element is immediately followed by an rt or rp element, or if there is no more content in the parent element.

An rp element's end tag may be omitted if the rp element is immediately followed by an rt or rp element, or if there is no more content in the parent element.


A colgroup element's start tag may be omitted if the first thing inside the colgroup element is a col element, and if the element is not immediately preceded by another colgroup element whose end tag has been omitted. (It can't be omitted if the element is empty.)

A colgroup element's end tag may be omitted if the colgroup element is not immediately followed by a space character or a comment.

A thead element's end tag may be omitted if the thead element is immediately followed by a tbody or tfoot element.

A tbody element's start tag may be omitted if the first thing inside the tbody element is a tr element, and if the element is not immediately preceded by a tbody, thead, or tfoot element whose end tag has been omitted. (It can't be omitted if the element is empty.)

A tbody element's end tag may be omitted if the tbody element is immediately followed by a tbody or tfoot element, or if there is no more content in the parent element.

A tfoot element's end tag may be omitted if the tfoot element is immediately followed by a tbody element, or if there is no more content in the parent element.

A tr element's end tag may be omitted if the tr element is immediately followed by another tr element, or if there is no more content in the parent element.

A td element's end tag may be omitted if the td element is immediately followed by a td or th element, or if there is no more content in the parent element.

A th element's end tag may be omitted if the th element is immediately followed by a td or th element, or if there is no more content in the parent element.

However, a start tag must never be omitted if it has any attributes.
         */
    });
})
