export class AbstractParser{

    readUntill(regexp) {
        let ret = '';
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (regexp.test(char))
                break;
            ret += char;
            this.position++;
        }
        return ret;
    }

    skipWhitespace() {
        this.readUntill(/\S/)
    }
    readUntillText(text){
        let ret = '';
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (this.text.substr(this.position, this.position+text.length) == text)
                break;
            ret += char;
            this.position++;
        }
        return ret;
    }
}