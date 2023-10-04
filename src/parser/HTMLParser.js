import {XMLParser} from "./XMLParser";
import {AbstractMLParser} from "./AbstractMLParser";

export class HTMLParser extends AbstractMLParser{
    voidElements=['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    allowAutoClose = true;
    static Parse(text) {
        return (new HTMLParser(text)).parseNormal();
    }
}
