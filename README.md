# data-transformer
Helper to transform a data structure from one view to another

## Usages
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
const result = await dataToModel(User, users, { output: Array });
```
You will get the structure
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
const source = await modelToData(User, result);
```
You will get a new `source` structure in the same presentation as the original` users` structure
