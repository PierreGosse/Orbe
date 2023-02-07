export interface IPage {
    type: string;
    name: string;
    keys: string[];
    content: IPara[];
}
export interface IPara {
    para: string;
    style?: string;
}
