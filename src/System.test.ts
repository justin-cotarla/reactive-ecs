import { Component, ComponentAddEvent, ComponentRemoveEvent } from './Component'
import { Entity } from './Entity'
import { System } from './System'

jest.mock('./Component', () => ({
  ...jest.requireActual('./Component'),
  Component: jest.fn(() => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
}))

class TestSystem extends System {
  getEntityCount() {
    return super.matchedEntityCount
  }

  public collect(): Generator<Entity, void, unknown> {
    return super.getMatchedEntities()
  }
}

type ComponentAddCallback = (event: ComponentAddEvent) => void
type ComponentRemoveCallback = (event: ComponentRemoveEvent) => void

describe('System', () => {
  let component1: Component
  let component2: Component
  let system: TestSystem

  beforeEach(() => {
    component1 = new Component('component 1')
    component2 = new Component('component 2')
  })

  it('registers components on creation', () => {
    system = new TestSystem([component1, component2])
    expect(jest.mocked(component1).addEventListener).toHaveBeenCalledWith(
      'componentadd',
      expect.any(Function)
    )
    expect(jest.mocked(component1).addEventListener).toHaveBeenCalledWith(
      'componentremove',
      expect.any(Function)
    )
  })

  it('registers components on creation', () => {
    system = new TestSystem([component1, component2])
    expect(jest.mocked(component1).addEventListener).toHaveBeenCalledWith(
      'componentadd',
      expect.any(Function)
    )
    expect(jest.mocked(component1).addEventListener).toHaveBeenCalledWith(
      'componentremove',
      expect.any(Function)
    )
  })

  it('throws when attempting to register a component twice', () => {
    expect(() => new TestSystem([component1, component1])).toThrow()
  })

  it('deregisters components on destroy', () => {
    system = new TestSystem([component1, component2])
    const onComponentAdd = jest.mocked(component1.addEventListener).mock
      .calls[0][1]
    const onComponentRemove = jest.mocked(component1.addEventListener).mock
      .calls[1][1]

    system.destroy()

    expect(jest.mocked(component1).removeEventListener).toHaveBeenCalledWith(
      'componentadd',
      onComponentAdd
    )
    expect(jest.mocked(component1).removeEventListener).toHaveBeenCalledWith(
      'componentremove',
      onComponentRemove
    )
  })

  it('reports the correct matched entity count', () => {
    system = new TestSystem([component1, component2])
    const onComponentAdd = jest.mocked(component1.addEventListener).mock
      .calls[0][1] as ComponentAddCallback
    const onComponentRemove = jest.mocked(component1.addEventListener).mock
      .calls[1][1] as ComponentRemoveCallback

    onComponentRemove(new ComponentRemoveEvent('component1', 1))
    expect(system.getEntityCount()).toBe(0)

    onComponentAdd(new ComponentAddEvent('component1', 1))
    onComponentAdd(new ComponentAddEvent('component1', 2))
    expect(system.getEntityCount()).toBe(0)

    onComponentAdd(new ComponentAddEvent('component2', 1))
    expect(system.getEntityCount()).toBe(1)

    onComponentRemove(new ComponentRemoveEvent('component1', 2))
    expect(system.getEntityCount()).toBe(1)

    onComponentRemove(new ComponentRemoveEvent('component1', 1))
    expect(system.getEntityCount()).toBe(0)
  })

  it('returns matched entities', () => {
    system = new TestSystem([component1])

    const onComponentAdd = jest.mocked(component1.addEventListener).mock
      .calls[0][1] as ComponentAddCallback
    const onComponentRemove = jest.mocked(component1.addEventListener).mock
      .calls[1][1] as ComponentRemoveCallback

    expect([...system.collect()]).toEqual([])

    onComponentAdd(new ComponentAddEvent('component1', 1))

    expect([...system.collect()]).toEqual([new Entity(1)])

    onComponentRemove(new ComponentRemoveEvent('component1', 1))

    expect([...system.collect()]).toEqual([])
  })
})
