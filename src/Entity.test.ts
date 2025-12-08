import { Component } from './Component'
import { Entity } from './Entity'

jest.mock('./Component', () => ({
  Component: jest.fn(() => ({
    addToEntity: jest.fn(),
    removeFromEntity: jest.fn(),
  })),
}))

describe('Entity', () => {
  let entity: Entity

  beforeEach(() => {
    entity = new Entity(1)
  })

  it('adds data to its underlying component', () => {
    const component = new Component<string>('component')

    entity.addComponent(component, 'test')

    expect(jest.mocked(component).addToEntity).toHaveBeenCalledWith(1, 'test')
  })

  it('does not add data if component is a tag', () => {
    const component = new Component('component')

    entity.addComponent(component)

    expect(jest.mocked(component).addToEntity).toHaveBeenCalledWith(1)
  })

  it('removes data to its underlying component', () => {
    const component = new Component<string>('component')

    entity.addComponent(component, 'test')
    entity.removeComponent(component)

    expect(jest.mocked(component).removeFromEntity).toHaveBeenCalledWith(1)
  })
})
