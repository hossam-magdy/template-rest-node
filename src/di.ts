import { useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

useContainer(Container); // instruct "typeorm" to use container of "typedi"

export { Inject, InjectMany, Service } from 'typedi';
export { Entity, EntityRepository, Repository } from 'typeorm';
export {
  InjectConnection,
  InjectManager,
  InjectRepository
} from 'typeorm-typedi-extensions';
export { Container };

