declare module 'unmutable/*' {
    const value: any;
    export default value;
}


declare module 'unmutable/set' {
    export default function set<A,B>(key: string, value: any): (value: A) => B;
}
