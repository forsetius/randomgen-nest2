export class DoublyLinkedNode<T = unknown> {
  constructor(
    public value: T,
    public prev: DoublyLinkedNode<T> | undefined,
    public next: DoublyLinkedNode<T> | undefined,
  ) {
    if (prev) {
      prev.next = this;
    }

    if (next) {
      next.prev = this;
    }
  }

  public insertBefore(value: T) {
    new DoublyLinkedNode<T>(value, this.prev, this);
  }

  public insertAfter(value: T) {
    new DoublyLinkedNode<T>(value, this, this.next);
  }

  public remove() {
    if (this.prev) {
      this.prev.next = this.next;
    }

    if (this.next) {
      this.next.prev = this.prev;
    }
  }
}
