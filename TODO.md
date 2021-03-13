### FIXMEs
| Filename | line # | FIXME
|:------|:------:|:------
| ./src/api/config/environment.config.ts | 14 | encrypt confidential data on env variables (ie typeorm)
| ./src/api/models/media.model.ts | 10 | Media fieldname management. Seems to be always 'media'. Check and add e2e tests
| ./src/api/repositories/user.repository.ts | 106 | user should always retrieved from her email address. If not, possible collision on username value
| ./src/api/services/auth.service.ts | 52 | promise error is not managed
| ./src/api/services/auth.service.ts | 78 | promise error is not managed
| ./src/api/utils/string.util.ts | 38 | not working

### TODOs
| Filename | line # | TODO
|:------|:------:|:------
| ./src/api/decorators/safe.decorator.ts | 28 | fallback in catch
| ./src/api/middlewares/sanitizer.middleware.ts | 18 | safe decorator on this middleware and each other
