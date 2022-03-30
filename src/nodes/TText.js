import {getUniqName} from "../utils";
import he from "he";

export class TText {
    text = "";

    execute(env) {
        return env.document.createTextNode(he.decode(this.text));
    }

    compileJS() {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createTextNode(' + JSON.stringify(he.decode(this.text)) + ');';
        return {code, rootName};
    }
}