import React from 'react';
import {mount} from 'enzyme';
import {useEffect} from 'react';
import {Message} from 'enty-state';
import useMessage from '../RequestHook';

import {fetchOnLoad} from './RequestSuite';
import {errorOnLoad} from './RequestSuite';
import {nothing} from './RequestSuite';
import {refetch} from './RequestSuite';
import {fetchOnPropChange} from './RequestSuite';
import {fetchOnCallback} from './RequestSuite';
import {fetchSeries} from './RequestSuite';
import {fetchParallel} from './RequestSuite';
import {fetchBadEntity} from './RequestSuite';
import {
    mountWithProvider,
    foo,
    fooError,
    exisitingKey,
    badEntity,
    bar,
    baz,
    keyClash
} from './RequestSuite';

describe('config', () => {
    it('will return a message', () => {
        expect.assertions(1);
        mountWithProvider(() => () => {
            const message = useMessage({
                key: 'foo',
                request: foo
            });
            expect(message).toBeInstanceOf(Message);
            return null;
        });
    });

    it('will throw if not in a provider', () => {
        const Child = () => {
            useMessage({
                key: 'foo',
                request: foo
            });
            return null;
        };

        expect(() => mount(<Child />)).toThrow();
    });
});

describe('usage', () => {
    it('can fetch on load', async () => {
        return fetchOnLoad((ExpectsMessage) => () => {
            const message = useMessage({
                key: 'foo',
                request: foo
            });

            useEffect(() => {
                message.request();
            }, []);

            return <ExpectsMessage message={message} />;
        });
    });

    it('can catch rejected requests', async () => {
        return errorOnLoad((ExpectsMessage) => () => {
            const message = useMessage({
                key: 'fooError',
                request: fooError
            });
            useEffect(() => {
                message.request();
            }, []);
            return <ExpectsMessage message={message} />;
        });
    });

    it('can catch errors in the reducer', async () => {
        return fetchBadEntity((ExpectsMessage) => () => {
            const message = useMessage({
                key: 'badEntity',
                request: badEntity
            });
            useEffect(() => {
                message.request();
            }, []);

            return <ExpectsMessage message={message} />;
        });
    });

    it('can do nothing', async () => {
        return nothing((ExpectsMessage) => () => {
            const message = useMessage({
                key: 'nothing',
                request: foo
            });
            return <ExpectsMessage message={message} />;
        });
    });

    it('can refetch content', async () => {
        return refetch((ExpectsMessage) => () => {
            const message = useMessage({
                key: 'refetch',
                request: foo
            });
            return <ExpectsMessage message={message} />;
        });
    });

    it('can predefine a responseKey', async () => {
        return exisitingKey((ExpectsMessage) => () => {
            const message = useMessage({
                key: 'initial-baz',
                request: baz
            });

            return <ExpectsMessage message={message} />;
        });
    });

    it('keys of different api functions wont clash', async () => {
        return keyClash((ExpectsMessage) => () => {
            const aa = useMessage({
                key: 'clash',
                request: baz
            });
            const bb = useMessage({
                key: 'clash',
                request: foo
            });

            return (
                <div>
                    <ExpectsMessage message={aa} />
                    <ExpectsMessage message={bb} />
                </div>
            );
        });
    });

    it('can fetch if props change', async () => {
        return fetchOnPropChange((ExpectsMessage) => (props: {id: string}) => {
            const message = useMessage({
                key: 'propsChange' + props.id,
                request: foo
            });
            useEffect(() => {
                if (props.id) message.request(props.id);
            }, [props.id]);
            return <ExpectsMessage message={message} />;
        });
    });

    it('can fetch from a callback', async () => {
        return fetchOnCallback((ExpectsMessage) => () => {
            const message = useMessage({
                key: 'callback',
                request: foo
            });
            return <ExpectsMessage message={message} />;
        });
    });

    it('can fetch multiples in series', async () => {
        return fetchSeries((ExpectsMessage) => () => {
            const aa = useMessage({
                key: 'seriesFoo',
                request: foo
            });
            const bb = useMessage({
                key: 'seriesBar',
                request: bar
            });
            useEffect(() => {
                if (aa.isEmpty) {
                    aa.request('first');
                }
                if (aa.isSuccess) {
                    bb.request('second');
                }
            }, [aa]);

            return (
                <div>
                    <ExpectsMessage message={aa} />
                    <ExpectsMessage message={bb} />
                </div>
            );
        });
    });

    it('can fetch multiples in parallel', async () => {
        return fetchParallel((ExpectsMessage) => () => {
            const aa = useMessage({
                key: 'parallelFoo',
                request: foo
            });
            const bb = useMessage({
                key: 'parallelBar',
                request: bar
            });
            useEffect(() => {
                aa.request('first');
                bb.request('second');
            }, []);

            return (
                <div>
                    <ExpectsMessage message={aa} />
                    <ExpectsMessage message={bb} />
                </div>
            );
        });
    });
});
