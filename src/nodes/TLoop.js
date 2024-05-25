import {TNode} from "./TNode.js";

export class TLoop extends TNode {
    children = [];
    count;

    constructor(count) {
        super();
        this.count = count;
    }

    execute(env) {
        let ret = env.document.createDocumentFragment();
        let count=this.count.execute(env);
        for(let i=0;i<count;i++) {
            for (const child of this.children) {
                ret.appendChild(child.execute(env))
            }
        }
        return ret;
    }
}
