### TODOs
| Filename | line # | TODO
|:------|:------:|:------
| src/api/app.bootstrap.ts | 5 | Test documents
| src/api/app.bootstrap.ts | 6 | Validate all tests cases
| src/api/app.bootstrap.ts | 8 | Update boilerplate vs this version
| src/api/app.bootstrap.ts | 10 | dev branch
| src/api/app.bootstrap.ts | 15 | Git flow
| src/api/app.bootstrap.ts | 16 | Git hook or other soluce to adapt mysql password before each push
| src/api/app.bootstrap.ts | 17 | Refactoring transporter / payloads (see todos)
| src/api/app.bootstrap.ts | 18 | Property render needed ? If buffer ... or data ... ?
| src/api/app.bootstrap.ts | 19 | Accept on the fly object for IPayload.provider && IPayload.smtp
| src/api/app.bootstrap.ts | 20 | Récupérer les templates chez le fournisseur, voir si on trouve une action correspondante, et dans ce cas utiliser ce template
| src/api/app.bootstrap.ts | 21 | Créer les templates à la volée sur base de modèles existants chez chaque provider ! Ensuite adapter les informations de data, le logo notamment
| src/api/app.bootstrap.ts | 22 | Encrypt provider.publicKey, provider.privateKey, smtp.username, smtp.password
| src/api/app.bootstrap.ts | 27 | Support dynamic content-type on API
| src/api/app.bootstrap.ts | 28 | Support log on mail sendings
| src/api/app.bootstrap.ts | 29 | Support SMTP transport
| src/api/app.bootstrap.ts | 30 | Support Mailgun templates
| src/api/app.bootstrap.ts | 31 | Support inlines images
| src/api/app.bootstrap.ts | 36 | Support Organization
| src/api/app.bootstrap.ts | 37 | Support Customer, Invoice, Order
| src/api/app.bootstrap.ts | 38 | NPM package for API consumer
| src/api/app.bootstrap.ts | 39 | Mode sandbox
| src/api/app.bootstrap.ts | 44 | Support AMP
| src/api/app.bootstrap.ts | 45 | Support icalEvent
| src/api/app.bootstrap.ts | 46 | Support Mjml compilation
| src/api/controllers/mail.controller.ts | 29 | Container.resolve('Logger').log('db', '', {}) see https://www.npmjs.com/package/winston-sql-transport or implements custom solution
| src/api/repositories/smtp.repository.ts | 36 | add userId paramater, and do the request only on the leftJoin parameter, or ownerId
| src/api/repositories/user.repository.ts | 21 | async really ?
| src/api/repositories/user.repository.ts | 89 | To be refactored
| src/api/repositories/user.repository.ts | 118 | rename
| src/api/repositories/user.repository.ts | 119 | don't create user if not exists
| src/api/repositories/user.repository.ts | 120 | deprecated ?
| src/api/services/transporter-provider.service.ts | 74 | set transport on one property only (smtp && provider should be merged into transport, as Abstract class or interface)
| src/api/services/transporter-provider.service.ts | 95 | to be refactored as Factory
| src/api/validations/mail.validation.ts | 12 | on there routes, set validation configuration allowUnknownBody to false
| src/api/validations/provider.validation.ts | 95 | le 9999 pas terrible
| src/api/types/interfaces/IModelize.interface.ts | 3 | change name ? That's not ... Abstract class Model should be proficient ...
| src/api/types/interfaces/IPayload.interface.ts | 26 | rename by transaction
| src/api/types/interfaces/IPayload.interface.ts | 87 | define IImage ?

### FIXMEs
| Filename | line # | FIXME
|:------|:------:|:------
| src/api/middlewares/resolver.middleware.ts | 19 | The check on id parameter should be on validation
| src/api/models/provider.model.ts | 79 | False positive
