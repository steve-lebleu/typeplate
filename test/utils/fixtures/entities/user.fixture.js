const chance = require('chance').Chance();
const pool = require(process.cwd() + '/test/utils').pools;

const chars    = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const numbers  = [0,1,2,3,4,5,6,7,8,9];
const roles    = ["admin", "user", "ghost"];

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join('');
};

exports.apikey = () => {
  return shuffle(chars.concat(numbers)).substr(0,63);
};

exports.password =  () => {
  return chance.hash({ length: 8 });
};

exports.credentials = () => {
  return {
    email: chance.email(),
    password: chance.hash({ length: 8 })
  }
};

exports.entity = (role, pwd, apiKey) => {
  return {
    avatar: null,
    status: 'REGISTERED',
    username: chance.string({ length: 16, pool: pool.username }),
    email: shuffle(chars).slice(0,10) + chance.email({domain: 'example.com'}),
    password: pwd || chance.hash({ length: 8 }),
    apikey: apiKey || chance.string({ length: 64 }),
    role: role
  };
};