import { Property, Type } from '../../src/decorators';
import { findPath } from '../../src';

describe('Find abstract path', () => {
  it('case #1', () => {
    class Model {
      @Property('user_id')
      id;
    }

    const target = findPath(Model, 'user_id');

    expect(target).toBe('id');

  });

  // it('case #2', () => {
  //   class Friend {
  //     @Property('first_name')
  //     firstName;
  //   }
  //
  //   class Model {
  //     @Property('personal_props.friends_list')
  //     @Type(Friend, Array)
  //     friends;
  //   }
  //
  //   const target1 = findPath(Model, 'personal_props.friends_list[0].first_name');
  //   const target2 = findPath(Model, 'personal_props.friends_list');
  //
  //   expect(target1).toBe('friends[0].firstName');
  //   expect(target2).toBe('friends');
  //
  // });
  //
  // it('case #3', () => {
  //   class Contacts {
  //     @Property('phone_number')
  //     phone;
  //   }
  //
  //   class Model {
  //     @Property('contacts_block')
  //     @Type(Contacts, Array)
  //     contacts;
  //   }
  //
  //   const target = findPath(Model, 'contacts_block.phone_number');
  //
  //   expect(target).toBe('contacts.phone');
  // });
});
