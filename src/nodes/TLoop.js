import {TNode} from "./TNode";
import {base} from "mocha/lib/reporters";

export class TLoop extends TNode {
    children = [];

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