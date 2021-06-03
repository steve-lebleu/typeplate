import * as Events from 'events';
import { Cliam } from 'cliam';

import { URL } from '@config/environment.config';
import { User } from '@models/user.model';

const EmailEmitter = new Events.EventEmitter();

EmailEmitter.on('user.confirm', (user: User) => {
  void Cliam.emit('user.confirm', {
    meta: {
      subject: 'Confirm your account',
      to: [
        { name: user.username, email: user.email }
      ]
    },
    data: {
      user: {
        username: user.username
      },
      cta: `${URL}/auth/confirm?token=${user.token(120)}`
    }
  });
});

EmailEmitter.on('user.welcome', (user: User) => {
  void Cliam.emit('user.welcome', {
    meta: {
      subject: `Welcome on board, ${user.username}`,
      to: [
        { name: user.username, email: user.email }
      ]
    },
    data: {
      user: {
        username: user.username
      }
    }
  });
});

EmailEmitter.on('password.request', (user: User) => {
  void Cliam.emit('password.request', {
    meta: {
      subject: 'Update password request',
      to: [
        { name: user.username, email: user.email }
      ]
    },
    data: {
      user: {
        username: user.username
      },
      cta: `${URL}/auth/change-password?token=${user.token()}`
    }
  });
});

export { EmailEmitter }