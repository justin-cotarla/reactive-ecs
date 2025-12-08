import { Entity } from './Entity'

export class World {
  entityList: Entity[] = []

  createEntity(): Entity {
    const entity = new Entity(this.entityList.length)
    this.entityList.push(entity)

    return entity
  }
}
