export const utils = {
  withGrid(n: number) {
    return n * 24;
  },
  asGridCoord(r: number, c: number) {
    return `${r * 24},${c * 24}`;
  },
  nextPosition(initialR: number, initialC: number, direction: string) {
    let r = initialR;
    let c = initialC;
    const size = 24;
    switch (direction) {
      case "up":
        r -= size;
        break;
      case "down":
        r += size;
        break;
      case "left":
        c -= size;
        break;
      case "right":
        c += size;
        break;
    }
    return { r, c };
  },
  oppositeDirection(direction: string) {
    switch (direction) {
      case "up":
        return "down";
      case "down":
        return "up";
      case "left":
        return "right";
      case "right":
        return "left";
    }
  },

  emitEvent(name: string, detail?: any) {
    const event = new CustomEvent(name, {
      detail,
    });
    document.dispatchEvent(event);
  },
};
