import {XMLParser} from "./XMLParser";

export class HTMLParser extends XMLParser{
    voidElements=['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    static Parse(text) {
        return (new HTMLParser(text)).parseNormal();
    }
}
