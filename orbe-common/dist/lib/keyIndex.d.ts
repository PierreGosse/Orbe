export interface IIndexRule {
    keys: string[];
    link: string[];
}
export interface IIndexNode {
    next: {
        [key: string]: IIndexNode;
    };
    res?: string[];
}
export interface IParseNode extends IIndexNode {
    offset: number;
    end: number;
}
export interface IParseResult {
    offset: number;
    end: number;
    link: string[];
}
export declare const KEYINDEXREG: RegExp;
export declare class KeyIndex {
    index: IIndexNode;
    findNode(keys: string[]): IIndexNode;
    loadRule(sreg: IIndexRule): void;
    load(rules: IIndexRule[]): void;
    serialize(): IIndexRule[];
    addLevel(resp: IIndexRule[], cur: IIndexNode, path: string[]): void;
    replace(link: string, oldKeys: string[][], newKeys: string[][]): void;
    parse(str: string): IParseResult[];
    getIndex(): IIndexNode;
}
