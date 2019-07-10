// @flow

export default function Deprecated(message: string) {
    if(process.env.NODE_ENV !== 'production') {
        console.warn(`[Enty] DEPRECATED: ${message}`);
    }
}

