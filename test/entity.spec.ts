import { expect } from 'chai';
import { ChildEntityImpl, EntityImpl, toEntity, Entity, $snapshot, $levelOf, $local, $rxMap, $rewind, getEntity } from '../source/entity';
import { combine } from 'rxvalue';

describe('Entity', () => {
  type User = { name: string, login: string, extra?: string };
  type ChildUser = { firstName: string, lastName: string, name: number };
  type keys = keyof User | keyof ChildUser | 'phone';
  const userData: User = { name: 'user', login: 'user@email' };
  const userData2: User = { ...userData, name: 'user2' };
  const userData3: User = { ...userData, name: 'user3' };
  const userEntity = new EntityImpl<keys, User, User, null>(userData, null);
  describe('Top Level Entity', () => {
    it('should implement local to give the same result as the current data', () => {
      expect(userEntity.local).deep.eq(userData);
    })
    it('should implement snapshot to give the same result as the current data', () => {
      expect(userEntity.snapshot).deep.eq(userData);
    })
    it('should implement update to update only the givin data', () => {
      userEntity.update({ name: userData2.name })
      expect(userEntity.snapshot).deep.eq(userData2);
    })
    it('should ignore rewind, setParent, levelOf', () => {
      userEntity.rewind();
      userEntity.setParent();
      expect(userEntity.snapshot).deep.eq(userData2);
      expect(userEntity.levelOf('name').value).eq(0);
    })
    it('should have valued subjects as rx fields', () => {
      expect(userEntity.rx('name').value).eq(userData2.name);
      userEntity.rx('name').next(userData3.name);
      expect(userEntity.snapshot).deep.eq(userData3);
    })
  });
  const user = toEntity(userEntity);
  describe('toEntity', () => {
    it('should proxify fields', () => {
      expect(user.name.value).eq(userData3.name);
      user.name.next(userData2.name);
      expect($snapshot(user)).deep.eq(userData2);
      expect(userEntity.snapshot).deep.eq(userData2);
    })
  });
  describe('Child Entity', () => {
    describe('Parent ready', () => {
      type ChildUser = { name: string, phone: string, login?: undefined };
      type AnyUser = User | ChildUser;
      const child = toEntity(new ChildEntityImpl<keys, AnyUser, ChildUser, User, null>({
        parent: user, data: { login: undefined }, ready: true, store: null
      }));
      it('should inherit keys', () => {
        expect($rxMap(child)).keys(Object.keys(userData));
      });
      it('should present the new values', () => {
        expect($snapshot(child)).deep.eq({ name: userData2.name, login: undefined });
      });
      it('should implement levelOf to give the distance to the source subject', () => {
        expect(combine([$levelOf(child, 'name'), $levelOf(child, 'login')]).value).deep.eq([1, 0]);
      });
      it('should depend on parent values but not the overridden ones', () => {
        user.name.next(userData.name);
        user.login.next(userData.login);
        expect($snapshot(child)).deep.eq({ name: userData.name, login: undefined });
      });
      it('should implement local to give only new values', () => {
        expect($local(child)).deep.eq({ login: undefined });
      });
      it('should implement rewind to go back to parent value', () => {
        $rewind(child);
        expect($local(child)).deep.eq({});
        expect($snapshot(child)).deep.eq(userData);
        expect($snapshot(user)).deep.eq(userData);
      });
      it('should limit next of child fields to child V type', () => {
        type assertType<T, V extends T> = Exclude<T, V>;
        type childLogin = Parameters<typeof child.login.next>[0];
        type childName = Parameters<typeof child.name.next>[0];
        type childPhone = Parameters<typeof child.phone.next>[0];
        type _ = assertType<never,
          assertType<childLogin, ChildUser['login']> |
          assertType<childName, ChildUser['name']> |
          assertType<childPhone, ChildUser['phone']>>;
      });
    });
    describe('Parent not ready', () => {
      type AnyUser = User | ChildUser;
      let parentSetter!: (parent: Entity<keys, User, any, any>) => void;
      const childData = { firstName: 'fn', lastName: 'ln', name: 13 };
      const child = toEntity(new ChildEntityImpl<keys, AnyUser, ChildUser, User, null>({
        data: childData, parentPromise: { then: (setParent) => parentSetter = setParent }, ready: false, store: null,
      }));
      it('should have a consistent snapshot', () => {
        expect(child.name.value).eq(childData.name);
        expect(child.firstName.value).eq(childData.firstName);
        expect($snapshot(child)).deep.eq(childData);
        $rewind(child, 'name');
        expect(child.name.value).deep.eq(childData.name);
      });
      it('should inherit parent values once it is ready', () => {
        parentSetter(user);
        expect($snapshot(child)).deep.eq(childData);
        $rewind(child, 'name');
        expect($snapshot(child)).deep.eq({ ...childData, name: userData.name });
        expect(child.login.value).eq(userData.login);
        user.extra.next('extra');
        expect($snapshot(child)).deep.eq({ ...childData, name: userData.name, login: userData.login });
        expect(child.extra.value).eq('extra');
        expect($snapshot(child)).deep.eq({ ...childData, name: userData.name, login: userData.login, extra: 'extra' });
      });
      it('should use new parent values and forget the old parent values', () => {
        type U = { login: string, name: string };
        const parentData = { login: 'login', name: 'n' };
        const parent = toEntity(new EntityImpl<keys, User, U, null>(parentData, null));
        getEntity(child).setParent(parent);
        expect($snapshot(child)).deep.eq({ ...childData, ...parentData, extra: undefined });
      });
    });
  });
});
