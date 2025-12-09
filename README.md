# reactive-ecs

A Typescript, browser-based reactive ECS framework.

## Installation
```
$ npm install reactive-ecs
```

> [!NOTE]
> This library is only compatible with web runtimes (or anything that supports [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)).

## Usage

Create components:
```ts
import { Component } from 'reactive-ecs'

export const width = new Component<number>('WIDTH')
export const height = new Component<number>('HEIGHT')
```

Create system:
```ts
import { System } from 'reactive-ecs'

import { width, height } from './components'

class AreaSystem extends System {
  constructor() {
    super([width, height])
  }

  computeAreas() {
    for (const entity of this.getMatchedEntities()) {
      const area = width.getEntityData(entity) * height.getEntityData(entity)
      console.log(`area: ${area}`)
    }
  }

  printMatchedEntityCount() {
    console.log(this.matchedEntityCount)
  }
}
```

Collect matched entities:

```ts
import { Entity } from 'reactive-ecs'

import { AreaSystem } from './area-system'
import { width, height } from './components'

const areaSystem = new AreaSystem()

const square = new Entity(1)

square.addComponent(width, 5)
square.addComponent(height, 10)

areaSystem.computeAreas()

// "area: 50"

areaSystem.printMatchedEntityCount()

// "1"
```

### Tags (data-less components)
Components can be configured to not accept data, in which case they behave like tags:

```ts
import { Component } from 'reactive-ecs'

export const special = new Component('SPECIAL')

// ...

entity.addComponent(special)
```

### Clean up
Destroy systems before dereferencing to clean up dangling event listeners:
```ts
system.destroy()
```
