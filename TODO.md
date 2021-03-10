### FIXMEs
| Filename | line # | FIXME
|:------|:------:|:------
| ./src/api/config/environment.config.ts | 16 | encrypt confidential data on env variables (ie typeorm)
| ./src/api/controllers/media.controller.ts | 56 | Fallback on upload -> delete file when data is not saved
| ./src/api/models/media.model.ts | 12 | Media fieldname management. Seems to be always 'media'. Check and add e2e tests
| ./src/api/repositories/media.repository.ts | 17 | Media seems to expose User critical data

### TODOs
| Filename | line # | TODO
|:------|:------:|:------
| ./src/api/middlewares/sanitizer.middleware.ts | 23 | safe decorator ?
| ./src/api/repositories/user.repository.ts | 105 | don't create user if not exists
| ./src/api/subscribers/media.subscriber.ts | 48 | Fallback when rollback commited
| ./src/api/utils/auth.util.ts | 15 | move it in technical or business service
| ./src/api/utils/sanitize.util.ts | 22 | these methods should be work with sanitize middleware. Look to group it
