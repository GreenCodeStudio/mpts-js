import {getUniqName} from "../utils";

export class TText {
    text = "";

    execute(env) {
        return env.document.createTextNode(this.text);
    }

    compileJS() {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createTextNode(' + JSON.stringify(this.text) + ');';
        return {code, rootName};
    }
}