//@flow

export default class KeyedMemo {
    cache: {};
    compare: {};

    constructor() {
        this.cache = {};
        this.compare = {};
    }
    value(key: string, compare: any, update: Function): any {
        if(this.compare[key] !== undefined  && compare === this.compare[key]) {
            return this.cache[key];
        }

        this.cache[key] = update();
        this.compare[key] = compare;
        return this.cache[key];
    }
}
