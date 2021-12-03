# Template of a REST application;<br />using Node.Js and TypeScript

### Run

- `make start-db`
- `yarn`
- `yarn start`

### Checklist

- [x] routing
- [x] validation of params (`query`, `body`, `path`)
  - [x] use decorator
  - [x] validator implementation
  - [x] params from `cookies` (`Validate.cookies().…`)
- [x] DI/IoC container
- [x] db connection
- [x] static file serving
- [x] layered architecture, separating concerns:
  - [x] models (entity/db-model, and other/custom models)
  - [x] repositories/DataMapper (the data-access layer)
  - [x] services (encapsulates _business logic_)
  - [x] controllers
- [ ] exception/error handling
- [ ] logging and debug ([here](https://www.npmtrends.com/debug-vs-loglevel-vs-loglevel-debug-vs-log4js-vs-winston-vs-logging))
- [ ] tests
  - [ ] unit
  - [ ] e2e
- [ ] ~ protect routes (authentication) (`passport`, `koa-passport`)
- [ ] ~ CLI commands: (`yarn routes`)
- [ ] ~ Workers (launched from _yarn script_, listening to any AMQP/message brokers)
- [ ] ~ CronJobs (launched from _yarn script_)

<small>~: optional</small>

### Refs, resources and decisions overview

<details>
<summary>Expand/Collapse …</summary>

- Routing framework: `koa` ✅, `fastify`, `express`, …:
  - https://medium.com/@masnun/typescript-with-koa-part-2-428e82ba4ddb
  - http://nodeframework.com/
  - https://medium.com/@magnusjt/ioc-container-in-nodejs-e7aea8a89600
  - https://www.npmtrends.com/koa-vs-express-vs-fastify-vs-adonis-vs-hapi-vs-loopback-vs-restify-vs-sails-vs-strapi-vs-@nestjs/core
  - [x] use TS decorators (for routing & params validation): https://www.typescriptlang.org/docs/handbook/decorators.html & https://github.com/tc39/proposal-decorators
    - [x] build custom decorators as in https://github.com/senpng/koa-typescript-boilerplate
    - `koa-swagger-decorator` as in https://github.com/javieraviles/node-typescript-koa-rest
    - `dekoa` provides routing & parameters validation through decorators
- DI/IoC container:
  - `TypeDI` ✅ vs `Inversify` vs `Awilix` vs `injection-js`
    - https://www.npmtrends.com/typedi-vs-inversify-vs-injection-js-vs-awilix-vs-bottlejs-vs-typescript-ioc
- ORM & data-access layer:
  - Pattern: `ActiveRecord` vs `DataMapper` ✅
    - https://github.com/typeorm/typeorm/blob/b9d7898/docs/active-record-data-mapper.md
  - `TypeORM` ✅ vs `Prisma` vs `Sequelize` vs `Knex.js`
    - https://inviqa.com/blog/how-build-basic-api-typescript-koa-and-typeorm
  - RDBMS: `Postgres` vs `MySQL`
- Validation of request parameters
  - Integration of `koa` with: `Joi` ✅ vs `Ajv` vs `already-built integration solutions` vs `build and integrate custom/manual solution`
    - https://www.npmtrends.com/joi-vs-yup-vs-ajv-vs-validator.js-vs-validate.js
  - https://ranvir.xyz/blog/how-to-write-a-request-parameter-validation-middleware-in-node.js
- Simply google: `backend application architecture in node js`
  - https://afteracademy.com/blog/design-node-js-backend-architecture-like-a-pro
  - https://blog.logrocket.com/the-perfect-architecture-flow-for-your-next-node-js-project/
  - https://scoutapm.com/blog/nodejs-architecture-and-12-best-practices-for-nodejs-development
  </details>
