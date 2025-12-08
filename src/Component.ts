import { Entity } from './Entity'
import { TypedEventTarget } from './TypedEventTarget'

export type ComponentData<T> = T extends Component<infer G> ? G : never

export class Component<T = never> extends (EventTarget as TypedEventTarget<{
  [ComponentAddEvent.type]: ComponentAddEvent
  [ComponentRemoveEvent.type]: ComponentRemoveEvent
}>) {
  private entityData: T[] = []

  constructor(readonly name: string) {
    super()
  }

  addToEntity(
    ...[entityId, value]: [T] extends [never]
      ? [entityId: number]
      : [entityId: number, value: T]
  ): void {
    if (this.entityData[entityId] == null) {
      this.dispatchEvent(new ComponentAddEvent(this.name, entityId))
    }

    if (value == null) {
      return
    }

    this.entityData[entityId] = value
  }

  removeFromEntity(entityId: number): void {
    delete this.entityData[entityId]
    this.dispatchEvent(new ComponentRemoveEvent(this.name, entityId))
  }

  getEntityData(entity: Entity): T
  getEntityData(entity: number): T
  getEntityData(entity: number | Entity): T {
    const entityId = entity instanceof Entity ? entity.id : entity

    const entityData = this.entityData[entityId]

    if (entityData == null) {
      throw new Error(
        `Entity ${entityId} does not have a ${this.name} component`
      )
    }

    return entityData
  }

  hasEntity(entity: Entity): boolean
  hasEntity(entity: number): boolean
  hasEntity(entity: number | Entity): boolean {
    const entityId = entity instanceof Entity ? entity.id : entity

    return entityId in this.entityData
  }
}

export class ComponentAddEvent extends Event {
  static readonly type = 'componentadd'

  constructor(
    readonly name: string,
    readonly entityId: number
  ) {
    super(ComponentAddEvent.type)
  }
}

export class ComponentRemoveEvent extends Event {
  static readonly type = 'componentremove'

  constructor(
    readonly name: string,
    readonly entityId: number
  ) {
    super(ComponentRemoveEvent.type)
  }
}
