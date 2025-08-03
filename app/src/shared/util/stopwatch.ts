class Stopwatch {
  private events: [number, string][] = [];

  get startTime() {
    return this.events[0]![0];
  }

  constructor() {
    this.record('start');
  }

  record(event: string) {
    const timestamp = Date.now();
    this.events.push([timestamp, event]);

    console.log(
      `[StopWatch] @${(timestamp - this.startTime).toString()}: ${event}`,
    );
  }

  list() {
    console.log('[StopWatch] Events:');

    let previousTimestamp = this.startTime;
    this.events.forEach(([timestamp, event]) => {
      const elapsed = (timestamp - this.startTime).toString().padStart(6, ' ');
      const delta = (timestamp - previousTimestamp).toString().padStart(5, ' ');
      console.log(`  - ${elapsed} / ${delta}ms - ${event}`);

      previousTimestamp = timestamp;
    });
  }
}

const stopwatch = new Stopwatch();

export default stopwatch;
