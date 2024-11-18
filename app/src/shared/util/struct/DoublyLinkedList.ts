import { DoublyLinkedNode as Node } from '@shared/util/struct/DoublyLinkedNode';

export class DoublyLinkedList<T> {
  protected first: Node<T> | undefined = undefined;
  protected last: Node<T> | undefined = undefined;

  public constructor(list: Iterable<T> = []) {
    for (const item of list) {
      this.insertLast(item);
    }
  }

  public insertFirst(value: T) {
    const newNode = new Node(value, undefined, this.first);

    if (this.isEmpty()) {
      this.last = newNode;
    }

    this.first = newNode;
  }

  public insertLast(value: T) {
    const newNode = new Node(value, this.last, undefined);

    if (this.isEmpty()) {
      this.first = newNode;
    }

    this.last = newNode;
  }

  public insertBefore(value: T, existingNode: Node<T>) {
    existingNode.insertBefore(value);
  }

  public insertAfter(value: T, existingNode: Node<T>) {
    existingNode.insertAfter(value);
  }

  public removeFirst() {
    if (this.isEmpty()) {
      return;
    }

    this.first = this.first!.next;
    this.first!.prev = undefined;

    if (this.isEmpty()) {
      this.last = undefined;
    }
  }

  public removeLast() {
    if (this.isEmpty()) {
      return;
    }

    this.last = this.last!.prev;
    this.last!.next = undefined;

    if (this.isEmpty()) {
      this.first = undefined;
    }
  }

  public getFirst(): Node<T> | undefined {
    return this.first;
  }

  public getLast(): Node<T> | undefined {
    return this.last;
  }

  public count(): number {
    let count = 0;
    let node = this.first;
    while (node) {
      count++;
      node = node.next;
    }

    return count;
  }

  public clear(): void {
    this.first = undefined;
    this.last = undefined;
  }

  public find(
    value: T | ((v: T) => boolean),
    startAfter: Node<T> | undefined = undefined,
  ): Node<T> | undefined {
    let node = startAfter?.next ?? this.first;
    while (node) {
      if (
        value instanceof Function ? value(node.value) : node.value === value
      ) {
        return node;
      }
      node = node.next;
    }

    return undefined;
  }

  public findPrevious(
    value: T | ((v: T) => boolean),
    startBefore: Node<T> | undefined = undefined,
  ): Node<T> | undefined {
    let node = startBefore?.prev ?? this.last;
    while (node) {
      if (
        value instanceof Function ? value(node.value) : node.value === value
      ) {
        return node;
      }
      node = node.next;
    }

    return undefined;
  }

  public filter(cb: (v: T) => boolean): DoublyLinkedList<T> {
    const list = new DoublyLinkedList<T>();
    let node = this.first;
    while (node) {
      if (cb(node.value)) {
        list.insertLast(node.value);
      }
      node = node.next;
    }

    return list;
  }

  public isEmpty() {
    return (
      typeof this.first === 'undefined' || typeof this.last === 'undefined'
    );
  }
}
