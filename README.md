# data-transformer
Helper for simple data transformation from one view to another

## Install
```
npm i -P data-transformer
```

## Usage
For example, you have a list of users from your backend
```javascript
const users = [
  {
    'user_id': '476a44d6-8082-42b8-aa1e-378feb713169',
    'first_name': 'Marilyn',
    'second_name': 'Charles',
    'contacts': {
      'email': 'marilyncharles@apextri.com',
      'phone': '+1 (860) 439-2219',
      'address': '836 Lewis Place, Camas, Puerto Rico, 7243',
    },
  },
  {
    'user_id': '10d25293-9a17-4df0-8045-17ca5f4e8b5f',
    'first_name': 'Corrine',
    'second_name': 'Huffman',
    'contacts': {
      'email': 'corrinehuffman@artworlds.com',
      'phone': '+1 (812) 534-3924',
      'address': '450 Highland Avenue, Ryderwood, Colorado, 7095',
    },
  },
];
```
And a transformer class to convert data to a flat presentation format
```javascript
import { Property, Transform } from 'data-transformer';

class User {
  @Property('user_id')
  id;

  @Property({
    first: 'first_name',
    second: 'second_name'
  })
  @Transform({
    from: ({ value }) => [value.first, value.second].join(' '),
    to: ({ value }) => {
      const [first, second] = value.split(' ');
      return { first, second };
    } 
  })
  name;
  
  @Property('contacts.email')
  email;
  
  @Property('contacts.phone')
  phone;

  @Property('contacts.address')
  address;
}
```
As a result of transformation
```javascript
import { dataToModel } from 'data-transformer';

const result = await dataToModel(User, users, { output: Array });
```
you will get the structure
```javascript
[
  {
    id: '476a44d6-8082-42b8-aa1e-378feb713169',
    name: 'Marilyn Charles',
    email: 'marilyncharles@apextri.com',
    phone: '+1 (860) 439-2219',
    address: '836 Lewis Place, Camas, Puerto Rico, 7243',
  },
  {
    id: '10d25293-9a17-4df0-8045-17ca5f4e8b5f',
    name: 'Corrine Huffman',
    email: 'corrinehuffman@artworlds.com',
    phone: '+1 (812) 534-3924',
    address: '450 Highland Avenue, Ryderwood, Colorado, 7095',
  },  
];
```
Also, as a result of reverse transformation
```javascript
import { modelToData } from 'data-transformer';

const source = await modelToData(User, result);
```
you will get a new `source` structure in the same presentation as the original` users` structure.


Note. Transformer has no internal state,
therefore, he doesn't  remember the initial data of the initial transformation.
During reverse transformation, to obtain the initial data, 
all initial properties should be declared in the transformer class.

## How it works
Each transformer class property decorate via micro-transformers(decorators)
each of which, returns a new property value.

The transformer has some important features that you should pay attention to:
1. Transformer has no internal state. If as a result of reverse transformation you want to get an object,
identical to the initial one - in the class of the transformer is necessary to declare all the necessary properties.
2. One property can have an unlimited number of decorators. Each of which,
in the order of declaration, from the top to the bottom, one by one will transform the value. 

## Property decorators

#### @Property
If declared, always the first. Takes property value by given key.
Available key type is `string`, `object`, `array`. 
If this decorator is not used, the property will be virtual, watch the decorator [`@Transform`](#@Transform)
```javascript
const data = {
  user_id: 123,
  first_name: 'Corrine',
  second_name: 'Huffman',
  contacts: {
    phone: '+1 (812) 534-3924',
    address: '450 Highland Avenue, Ryderwood, Colorado, 7095',
  },
  docSerial: 'ZZ',
  docNumber: '123456'
};
```

```javascript
import { dataToModel, Property } from 'data-transformer';

class User {
  @Property('user_id')
  id;

  @Property('contacts.phone')
  phone;

  @Property({
    first: 'first_name',
    second: 'second_name',
  })
  name;

  @Property(['docSerial', 'docNumber'])
  passport;
}

const user = await dataToModel(User, data);
```

`user` result is:

```javascript
{
  id: 123,
  phone: '+1 (812) 534-3924',
  name: {
    first: 'Corrine',
    second: 'Huffman',
  },
  passport: ['ZZ', '123456'],
}
```

#### @Enum
Return value from map.
```javascript
const data = {
  role: '1',
};
```
```javascript
import { dataToModel, Property, Enum } from 'data-transformer';

class User {
  @Property('role')
  @Enum({
    1: 'DEVELOPER',
    2: 'USER'
  })
  role;
}

const user = await dataToModel(User, data);
```
`user` result is:
```javascript
{
  role: 'DEVELOPER',
}
```
#### @Date
Transform `from` one format `to` another one. Under the hood is used [Moment.js](https://momentjs.com/).
```javascript
const data = {
  create_date: 1529442000,
};
```
```javascript
import { dataToModel, Property, Date } from 'data-transformer';

class User {
  @Property('create_date')
  @Date({
    from: 'X',
    to: 'DD.MM.YYYY'
  })
  date;
}

const user = await dataToModel(User, data);
```
`user` result is:
```javascript
{
  date: '20.06.2018',
}
```
#### @Type
Transform initial value to required format or transform nested objects
```javascript
const data = {
  user_id: 123,
  is_active: null,
  age: '24',
  contacts: {
    phone: '+1 (812) 534-3924',
  },
  friends: [
    {
      first_name: 'Iris',
      second_name: 'Sexton',
    },
    {
      first_name: 'Ava',
      second_name: 'Wilcox'
    }
  ]
};
```
```javascript
import { dataToModel, Property, Type } from 'data-transformer';

class Contact {
   @Property('phone')
   phone;
}

class Friend {
  @Property({
    first: 'first_name',
    second: 'second_name'
  })
  @Transform({
    from: ({ value }) => [value.first, value.second].join(' '),
    to: ({ value }) => {
      const [first, second] = value.split(' ');
      return { first, second };
    } 
  })
  name;
}

class User {
  @Property('user_id')
  @Type(String)
  id;
  
  @Property('is_active')
  @Type(Boolean)
  isActive;

  @Property('contacts')
  @Type(Contact)
  contacts;

  @Property('friends')
  @Type(Friend, Array)
  friends;
}

const user = await dataToModel(User, data);
```
`user` result is:
```javascript
{
  id: '20.06.2018',
  isActive: false,
  contacts: {
    phone: '+1 (812) 534-3924',
  },
  friends: [
    {
      name:'Iris Sexton',
    },
    {
      name:'Ava Wilcox',
    },
  ]
}
```
#### @Transform
Used for custom value transformations. For transformations you should declare one or both optional methods, 
`from` for transformation your data to model representation and `to` for reverse transformation.
Both methods, `from` and `to`, receive one argument `object` with four parameters:
* value - value, obtained by key(-s) from [@Property](#@Property)
* source - initial data
* target - transformed data at the time of transformation of a given value
* meta - helper, custom object which you can declare in a method [dataToModel](#datatomodel)

As result methods should return value.
```javascript
const data = {
  residency: false,
  internal: true,
  firstName: 'Ava',
  secondName: 'Wilcox',
  document: 'ZZ_123456   '
};
```
```javascript
import { dataToModel, Property, Transform } from 'data-transformer';

class User {
  @Property('document')
  @Transform({
    from: ({ value, source, target, meta }) => value.replace(/[\s_]/g, ''),
    to: ({ value, source, target, meta }) => value.replace(/(\D)(\d)/, '$1_$2'),
  })
  document;

  @Transform({
    from: ({ value, source, target, meta }) => !source.residency && source.internal,
  })
  nonresident;

  @Transform({
    from: ({ value, source, target, meta }) => [source.firstName, source.secondName].join(' '),
  })
  name;
}

const user = await dataToModel(User, data);
```
`user` result is:
```javascript
{
  document: 'ZZ123456',
  nonresident: true,
  name:'Ava Wilcox'
}
```
Note. After reverse transformation the result will be as follows. 
Cause properties without `@Property` decorator - are virtual.
```javascript
{
  document: 'ZZ_123456',
}
```
## Class decorators
#### @DataTransform
Used for top-level data transformations. For transformations you should declare one or both optional methods `from`, `to`. 
Method `from` is called before all properties transformations. 
Method `to` is called after all properties transformations. 
Both methods, `from` and `to`, receive one argument `object` with two parameters:
* value - initial data
* meta - helper, custom object which you can declare in a method [dataToModel](#datatomodel-modeltodata)

As result methods should return value.
```javascript
const data = [
  {
    price: '200.20',
  },
  {
    price: '100',
  },
  {
    price: '98.56',
  },
];
```
```javascript
import { dataToModel, Property, DataTransform, Type } from 'data-transformer';

@DataTransform({
  from: ({ value }) => value.filter(({ price }) => price >= 100)
})
class Product {
  @Property('price')
  @Type(Number)
  price;
}

const products = await dataToModel(Product, data, { output: Array });
```
`products` result is:
```javascript
[
  {
    price: 200.20,
  },
  {
    price: 100,
  },
];
```
## Methods
#### dataToModel modelToData
Both methods are asynchronous. 
`dataToModel` transforms the initial data according to the transformer class. 
`modelToData` does the reverse transformation. 
Both methods еakes three arguments:
* class transformer, is required
* initial data, is required
* optional parameters, is optional
    * output - is optional, accept only one value - `Array`. Necessary if the initial data is an array.
    * meta - helper, custom object which will be available in methods `from` and `to` decorators `@Transform` and `@DataTransform`. 
```javascript
import { dataToModel, modelToData } from 'data-transformer';

class Transformer {
  ...
}

const target = await dataToModel(Transformer, data, { output: Array, meta: { ... } });
const source = await modelToData(Transformer, target, { output: Array, meta: { ... } });
```
#### findPath
Synchronous method for finding abstract path. Correctly work only with `@Property`(key is `string`) and `@Type` decorators
```javascript
import { findPath, Property, Type } from 'data-transformer';

class Friend {
  @Property('first_name')
  firstName;

  @Property('second_name')
  secondName;
}

class User {
  @Property('friends_list')
  @Type(Friend, Array)
  friends;
}

const path = findPath(User, 'friends_list[0].first_name');
```
`path` result is:
```javascript
'friends[0].firstName'
```
#### createDecorator
Method that allows you to create your custom decorator, with your custom logic.
`createDecorator`
```javascript
import { createDecorator } from 'data-transformer';

export const Custom = createDecorator((option1, option2, optionN) => ({
  from({ value, target, source, meta }) {
    return value;
  },
  to({ value, target, source, meta }) {
    return value;
  },
}));

class Transform {
  @Custom(option1, option2, optionN)
  key;
}
```
## Inheritance
Transformer classes can be inherited.
```javascript
const data = {
  first_name: 'John',
  second_name: 'Doe',
  role: '1',
  last_modify: '20.11.2019',
};
```
```javascript
import { Property, Date } from 'data-transformer';

class User {
  @Property({
    first: 'first_name',
    second: 'second_name',
  })
  @Transform({
    from: ({ value }) => [value.first, value.second].join(' '),
    to: ({ value }) => {
      const [first, second] = value.split(' ');
      return { first, second };
    },
  })
  name;

  @Property('last_modify')
  @Date({
    from: 'DD.MM.YYYY',
    to: 'X',
  })
  lastModify;
}

class Employee extends User {
  @Property('role')
  @Enum({
    1: 'ADMIN',
  })
  role;
}

const user = await dataToModel(Employee, data);
```
`user` result is:
```javascript
{ 
  name: 'John Doe', 
  lastModify: 1574200800, 
  role: 'ADMIN', 
}
```

