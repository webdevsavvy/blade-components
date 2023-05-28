import { BladeProp, PhpVariable } from "./php";

export interface ComponentCache {
    classComponents: ClassComponent[]
    bladeComponents: BladeComponent[]
}

export interface ClassComponent {
    uri: string
    fsPath: string
    descriptor: string
    snippetString: string
}

export interface BladeComponent {
    uri: string
    fsPath: string
    descriptor: string
    snippetString: string
    slot: boolean
}