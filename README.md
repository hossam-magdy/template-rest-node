# REST template, using NodeJs and koa

**Checklist**

- [x] routing
- [ ] params validation
  - [x] use decorator
  - [ ] validator implementation, ex: [here](https://ranvir.xyz/blog/how-to-write-a-request-parameter-validation-middleware-in-node.js)
- [ ] IoC container
- [ ] db connection
- [ ] Exceptions/Errors
- [x] static file serving
- [ ] protect routes (auth) (`passport`, `koa-passport`)
- [ ] tests
  - [ ] unit
  - [ ] e2e
- [ ] layered architecture:
  - [ ] models (~ use TypeORM, Prisma, …)
  - [ ] repositories
  - [ ] services
  - [ ] controllers
- [ ] [`debug`](https://github.com/visionmedia/debug)

Extra

- [x] use TS decorators (for routing & params validation): https://www.typescriptlang.org/docs/handbook/decorators.html & https://github.com/tc39/proposal-decorators
  - [x] build custom decorators as in https://github.com/senpng/koa-typescript-boilerplate
  - `koa-swagger-decorator` as in https://github.com/javieraviles/node-typescript-koa-rest
  - `dekoa` provides routing & parameters validation through decorators

**Refs**

- https://inviqa.com/blog/how-build-basic-api-typescript-koa-and-typeorm
- https://medium.com/@masnun/typescript-with-koa-part-2-428e82ba4ddb
- http://nodeframework.com/
- https://medium.com/@magnusjt/ioc-container-in-nodejs-e7aea8a89600
