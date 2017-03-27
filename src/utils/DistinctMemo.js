
export default class DistinctMemo {
    cachedValue: null;
    memoValue: null;
    update: null;

    constructor(update: Function) {
        this.update = update;
    }
    value(value: any, ...rest): any {
        if(value === this.memoValue) {
            return this.cachedValue;
        }

        this.cachedValue = this.update(value, ...rest);
        this.memoValue = value;
        return this.cachedValue;
    }
}
