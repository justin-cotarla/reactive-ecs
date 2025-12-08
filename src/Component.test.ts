import { Component } from './Component'
import { Entity } from './Entity'

describe('Component', () => {
  describe('components with values', () => {
    let component: Component<string>

    beforeEach(() => {
      component = new Component<string>('test')
    })

    it('stores entity data', () => {
      component.addToEntity(1, 'foo')

      expect(component.hasEntity(1)).toBe(true)
      expect(component.getEntityData(1)).toBe('foo')
    })

    it('dispatches an event when an entity is added', async () => {
      const eventId = new Promise((res) =>
        component.addEventListener('componentadd', (ev) => res(ev.entityId))
      )

      component.addToEntity(1, 'foo')

      await expect(await eventId).toBe(1)
    })

    it('dispatches an event when an entity is removed', async () => {
      const eventId = new Promise((res) =>
        component.addEventListener('componentremove', (ev) => res(ev.entityId))
      )

      component.addToEntity(1, 'foo')
      component.removeFromEntity(1)

      await expect(await eventId).toBe(1)
    })

    it('throws an error if entity data is not found', () => {
      expect(() => component.getEntityData(1)).toThrow()
    })

    it('deletes entity data', () => {
      component.addToEntity(1, 'foo')
      component.removeFromEntity(1)

      expect(component.hasEntity(1)).toBe(false)
    })

    it('parses entities', () => {
      const entity = new Entity(1)

      component.addToEntity(1, 'test')

      expect(component.hasEntity(entity)).toBe(true)
      expect(component.getEntityData(entity)).toBe('test')
    })
  })

  describe('tag components', () => {
    let component: Component

    beforeEach(() => {
      component = new Component('test')
    })

    it('create the component', async () => {
      const eventId = new Promise((res) =>
        component.addEventListener('componentadd', (ev) => res(ev.entityId))
      )

      component.addToEntity(1)

      await expect(await eventId).toBe(1)
      expect(() => component.getEntityData(1)).toThrow()
    })
  })
})
