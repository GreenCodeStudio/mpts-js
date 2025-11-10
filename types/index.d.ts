export declare class Environment {
    allowExecution: boolean;
    variables: object;
    document: any;

    scope(newVariables: object): Environment
}

export class XMLParser {
    constructor(text: string);

    static Parse(text: string): TDocumentFragment;

    addElement(
        element: TNode,
        selfclose?: boolean
    ): void;
}

export class TDocumentFragment extends TNode {

}

export class TNode {
}

export class MptsParserError extends Error{
    messageRaw:string;
    line:number;
    column:number;
    sample:string;
    totalPosition:number;
}
