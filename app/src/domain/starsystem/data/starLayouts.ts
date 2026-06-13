export interface StarLayout {
  innerSystemCount: number;
  outerSystemCount: number;
}

export const starLayouts: [StarLayout, number][] = [
  [{innerSystemCount: 1, outerSystemCount: 0 }, 40],
  [{innerSystemCount: 2, outerSystemCount: 0 }, 30],
  [{innerSystemCount: 1, outerSystemCount: 1 }, 20],
  [{innerSystemCount: 2, outerSystemCount: 1 }, 5],
  [{innerSystemCount: 1, outerSystemCount: 2 }, 5],
]
