import * as Events from 'events';
import { Cliam } from 'cliam';
import { RENDER_ENGINE } from 'cliam/dist/types/enums/render-engine.enum';
import { URL } from '@config/environment.config';
import { User } from '@models/user.model';

const EmailEmitter = new Events.EventEmitter();

EmailEmitter.on('user.confirm', (user: User) => {
  void Cliam.mail('user.confirm', {
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
    },
    renderEngine: 'cliam' as RENDER_ENGINE
  });
});

EmailEmitter.on('user.welcome', (user: User) => {
  void Cliam.mail('user.welcome', {
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
    },
    renderEngine: 'cliam' as RENDER_ENGINE
  });
});

EmailEmitter.on('password.request', (user: User) => {
  void Cliam.mail('password.request', {
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
    },
    renderEngine: 'cliam' as RENDER_ENGINE
  });
});

export { EmailEmitter }