export class TDocumentFragment {
    children = []

    execute(env) {
        let ret = env.document.createDocumentFragment();
        for (const child of this.children) {
            ret.appendChild(child.execute(env))
        }
        return ret;
    }
}