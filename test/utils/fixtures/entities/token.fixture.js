const oauthFacebook = {
  id: '10226107961312549',
  username: undefined,
  displayName: undefined,
  name: { familyName: 'Doe', givenName: 'John', middleName: undefined },
  gender: undefined,
  profileUrl: undefined,
  photos: [
    {
      value: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10226107961312549&height=50&width=50&ext=1618134835&hash=AeQG7JwQDHxpvYzf5Rk'
    }
  ],
  provider: 'facebook',
  _raw: '{"id":"10226107961312549","last_name":"Doe","first_name":"John","picture":{"data":{"height":49,"is_silhouette":false,"url":"https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/?asid=10226107961312549&height=50&width=50&ext=1618134835&hash=AeQG7JwQDHxpvYzf5Rk","width":49}}}',
  _json: {
    id: '10226107961312549',
    last_name: 'Doe',
    first_name: 'John',
    picture: { data: [Object] }
  }
}

exports.oauthFacebook = oauthFacebook;

const oauthGoogle = {
  id: '100381987564055936818',
  displayName: 'Steve Lebleu',
  name: { familyName: 'Lebleu', givenName: 'Steve' },
  emails: [ { value: 'steve.lebleu1979@gmail.com', verified: true } ],
  photos: [
    {
      value: 'https://lh6.googleusercontent.com/-QmuEXYjq2Ag/AAAAAAAAAAI/AAAAAAAAFT4/AMZuucmaVXn8Gopeny7NpT9A5uM5lJH6yQ/s96-c/photo.jpg'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "100381987564055936818",\n' +
    '  "name": "Steve Lebleu",\n' +
    '  "given_name": "Steve",\n' +
    '  "family_name": "Lebleu",\n' +
    '  "picture": "https://lh6.googleusercontent.com/-QmuEXYjq2Ag/AAAAAAAAAAI/AAAAAAAAFT4/AMZuucmaVXn8Gopeny7NpT9A5uM5lJH6yQ/s96-c/photo.jpg",\n' +
    '  "email": "steve.lebleu1979@gmail.com",\n' +
    '  "email_verified": true,\n' +
    '  "locale": "fr"\n' +
    '}',
  _json: {
    sub: '100381987564055936818',
    name: 'Steve Lebleu',
    given_name: 'Steve',
    family_name: 'Lebleu',
    picture: 'https://lh6.googleusercontent.com/-QmuEXYjq2Ag/AAAAAAAAAAI/AAAAAAAAFT4/AMZuucmaVXn8Gopeny7NpT9A5uM5lJH6yQ/s96-c/photo.jpg',
    email: 'steve.lebleu1979@gmail.com',
    email_verified: true,
    locale: 'fr'
  }
}

exports.oauthGoogle = oauthGoogle;

exports.accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MjE5NzU4ODAsImlhdCI6MTYxNDcxODI4MCwic3ViIjoyfQ.qQTiFLLRIXuRLfMxQXfwul_UjIrWV5-x6CG2UIovpSA';