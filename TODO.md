### FIXMEs
| Filename | line # | FIXME
|:------|:------:|:------
| ./src/api/config/environment.config.ts | 14 | encrypt confidential data on env variables (ie typeorm)
| ./src/api/controllers/media.controller.ts | 62 | Fallback on upload -> delete file when data is not saved
| ./src/api/controllers/media.controller.ts | 99 | set headers after response write error
| ./src/api/middlewares/resolver.middleware.ts | 20 | The check on id parameter should be on validation -> change doRequest by doQueryRequest allow 400, by validation error.
| ./src/api/repositories/media.repository.ts | 17 | Media seems to expose User critical data

### TODOs
| Filename | line # | TODO
|:------|:------:|:------
| ./src/api/repositories/user.repository.ts | 105 | rename
| ./src/api/repositories/user.repository.ts | 106 | don't create user if not exists
| ./src/api/repositories/user.repository.ts | 107 | deprecated ?
| ./src/api/utils/serializing.util.ts | 43 | no hardcode
