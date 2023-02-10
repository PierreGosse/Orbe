export interface IIndexRule {
    keys: string[];
    link: string;
}
export interface IIndexNode {
    next: {
        [key: string]: IIndexNode;
    };
    res?: string;
}
export interface IParseNode extends IIndexNode {
    offset: number;
    end: number;
}
export interface IParseResult {
    offset: number;
    end: number;
    link: string;
}
export declare class KeyIndex {
    index: IIndexNode;
    findNode(keys: string[]): IIndexNode;
    load(rules: IIndexRule[]): void;
    replace(link: string, oldKeys: string[][], newKeys: string[][]): void;
    parse(str: string): IParseResult[];
    getIndex(): IIndexNode;
}
