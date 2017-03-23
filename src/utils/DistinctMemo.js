
export default class DistinctMemo {
    cachedValue: null;
    memoValue: null;
    update: null;

    constructor(update: Function) {
        this.update = update;
    }
    value(value: any): any {
        if(value === this.memoValue) {
            return this.cachedValue;
        }

        this.cachedValue = this.update(value);
        this.memoValue = value;
        return this.cachedValue;
    }
}
