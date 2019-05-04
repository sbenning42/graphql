import { makeModelGQLinputDef, makeModelsGQLinputDef } from "../models/mongodb-queries";

export class Register {
    
    private dependencies: { [x: string]: any } = {};
    
    constructor() {}

    mergeDependencies(dependencies: { [x: string]: any }) {
        this.dependencies = {
            ...this.dependencies,
            ...dependencies
        };
    }

    register(models: { [x: string]: any }) {
        this.dependencies = Object.entries(models)
            .reduce((dependencies, [name, model]) => makeModelGQLinputDef(name, model, dependencies), this.dependencies);
        return makeModelsGQLinputDef(this.dependencies);
    }

    reset() {
        this.dependencies = {};
    }

}
