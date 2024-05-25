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
        expect(()=>HTMLParser.Parse("<span><strong></span></strong>")).to.throw(MptsParserError);
        expect(()=>HTMLParser.Parse("<span><strong></span></strong>")).to.throw(/Last opened element is not <strong>/);
    });
    describe('ommiting tags',  () => {
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
           const obj= HTMLParser.Parse("<ul><li>one<li>two<li>three</ul>");

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
        /*
        8.1.2.4 Optional tags
Certain tags can be omitted.

Omitting an element's start tag does not mean the element is not present; it is implied, but it is still there. An HTML document always has a root html element, even if the string <html> doesn't appear anywhere in the markup.

An html element's start tag may be omitted if the first thing inside the html element is not a comment.

An html element's end tag may be omitted if the html element is not immediately followed by a comment.

A head element's start tag may be omitted if the element is empty, or if the first thing inside the head element is an element.

A head element's end tag may be omitted if the head element is not immediately followed by a space character or a comment.

A body element's start tag may be omitted if the element is empty, or if the first thing inside the body element is not a space character or a comment, except if the first thing inside the body element is a script or style element.
A body element's end tag may be omitted if the body element is not immediately followed by a comment.

A li element's end tag may be omitted if the li element is immediately followed by another li element or if there is no more content in the parent element.

A dt element's end tag may be omitted if the dt element is immediately followed by another dt element or a dd element.

A dd element's end tag may be omitted if the dd element is immediately followed by another dd element or a dt element, or if there is no more content in the parent element.

A p element's end tag may be omitted if the p element is immediately followed by an address, article, aside, blockquote, dir, div, dl, fieldset, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, hr, menu, nav, ol, p, pre, section, table, or ul, element, or if there is no more content in the parent element and the parent element is not an a element.

An rt element's end tag may be omitted if the rt element is immediately followed by an rt or rp element, or if there is no more content in the parent element.

An rp element's end tag may be omitted if the rp element is immediately followed by an rt or rp element, or if there is no more content in the parent element.

An optgroup element's end tag may be omitted if the optgroup element is immediately followed by another optgroup element, or if there is no more content in the parent element.

An option element's end tag may be omitted if the option element is immediately followed by another option element, or if it is immediately followed by an optgroup element, or if there is no more content in the parent element.

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
