export class TText {
    text = "";
    execute(env){
        return env.document.createTextNode(this.text);
    }
}