//@flow
import Child from '../Child';
import MapSchema from '../../MapSchema';

it('can set a definition through the constructor', () => {
    const map = MapSchema();
    const child = new Child(map);
    expect(child.definition).toBe(map);
});

it('can access the definition through get', () => {
    const map = MapSchema();
    const child = new Child(map);
    expect(child.get()).toBe(map);
});

it('can change the definition through set', () => {
    const mapA = MapSchema();
    const mapB = MapSchema();
    const child = new Child(mapA);
    expect(child.get()).toBe(mapA);
    expect(child.get()).not.toBe(mapB);
    child.set(mapB);
    expect(child.get()).toBe(mapB);
});

it('can update the definition through update', () => {
    const mapA = MapSchema();
    const mapB = MapSchema();
    const child = new Child(mapA);

    child.update(definition => {
        expect(definition).toBe(mapA);
        return mapB;
    });
    expect(child.get()).toBe(mapB);
});
