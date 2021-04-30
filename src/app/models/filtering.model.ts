export interface FilterButton{
    type: Filter;
    laber: string;
    isActive: boolean;
}

export enum Filter{
    All,
    Active,
    Complete,
}