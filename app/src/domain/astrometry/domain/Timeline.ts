import { DoublyLinkedList } from '@shared/util/struct/DoublyLinkedList';
import { StarSystem } from './StarSystem';
import { DoublyLinkedNode } from '@shared/util/struct/DoublyLinkedNode';

export class Timeline extends DoublyLinkedList<Event> {
  public constructor(public starSystem: StarSystem) {
    super();
  }

  public insertAt(age: number, action: () => void) {
    let previousNode = this.first;
    while (previousNode && previousNode.value.age < age) {
      previousNode = previousNode.next;
    }

    previousNode?.insertAfter({ age, action });
  }
}

interface Event {
  age: number;
  action: () => void;
}
