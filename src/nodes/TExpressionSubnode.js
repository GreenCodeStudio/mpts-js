import {TNode} from "./TNode.js";

export class TExpressionSubnode extends TNode {
    execute(env) {
        let frag=env.document.createDocumentFragment();
        let div=env.document.createElement('div');
        div.innerHTML=this.expression.execute(env);
        frag.append(...div.childNodes);
        return frag;
    }
}
