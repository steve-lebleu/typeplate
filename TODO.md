### FIXMEs
| Filename | line # | FIXME
|:------|:------:|:------
| ./src/api/config/environment.config.ts | 15 | encrypt confidential data on env variables (ie typeorm)
| ./src/api/controllers/media.controller.ts | 58 | Fallback on upload -> delete file when data is not saved
| ./src/api/controllers/media.controller.ts | 94 | set headers after response write error
| ./src/api/middlewares/resolver.middleware.ts | 34 | Should be reviewed because it can be at origin of non-blocking error HEADER_CANNOT_BE_SET_AFTER_RESPONSE_SENDING
| ./src/api/models/media.model.ts | 12 | Media fieldname management. Seems to be always 'media'. Check and add e2e tests
| ./src/api/repositories/media.repository.ts | 17 | Media seems to expose User critical data

### TODOs
| Filename | line # | TODO
|:------|:------:|:------
| ./src/api/middlewares/sanitizer.middleware.ts | 24 | safe decorator ?
| ./src/api/repositories/user.repository.ts | 105 | rename
| ./src/api/repositories/user.repository.ts | 106 | don't create user if not exists
| ./src/api/repositories/user.repository.ts | 107 | deprecated ?
| ./src/api/utils/auth.util.ts | 15 | move it in technical or business service
| ./src/api/utils/sanitize.util.ts | 22 | these methods should be work with sanitize middleware. Look to group it
