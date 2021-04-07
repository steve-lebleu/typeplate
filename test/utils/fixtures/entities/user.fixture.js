const chance = require('chance').Chance();
const pool = require(process.cwd() + '/test/utils').pools;

const chars    = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join('');
};

exports.entity = (pwd, apikey) => {
  return {
    avatar: null,
    status: 'REGISTERED',
    username: chance.string({ length: 16, pool: pool.username }),
    email: shuffle(chars).slice(0,10) + chance.email({ domain: 'example.com'} ),
    password: pwd || chance.hash({ length: 8 }),
    role: 'user'
  };
};

exports.register = (pwd, email) => {
  return {
    username: chance.string({ length: 16, pool: pool.username }),
    email: email || shuffle(chars).slice(0,10) + chance.email({ domain: 'example.com'} ),
    password: pwd || chance.hash({ length: 8 })
  };
};