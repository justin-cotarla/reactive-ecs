import { Component, ComponentData } from './Component'

export class Entity {
  constructor(readonly id: number) {}

  addComponent<T, C extends Component<T>>(
    ...[component, value]: [T] extends [never]
      ? [component: Component<T>]
      : [component: Component<T>, value: ComponentData<C>]
  ): void {
    if (value != null) {
      ;(component as Component<unknown>).addToEntity(this.id, value)
      return
    }
    component.addToEntity(this.id)
  }

  removeComponent(component: Component<unknown>) {
    component.removeFromEntity(this.id)
  }
}
