import { utils } from "../utils";

export default class Sprite {
  [key: string]: any;

  constructor(config: any) {
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // shadow
    this.shadow = new Image();
    this.useShadow = true;
    if (this.useShadow) this.shadow.src = "assets/images/characters/shadow.png";
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    // animations and initial state
    this.animations = config.animations || {
      "idle-down": [[1, 0]],
      "idle-right": [[1, 2]],
      "idle-up": [[1, 3]],
      "idle-left": [[1, 1]],
      "walk-down": [
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 0],
      ],
      "walk-right": [
        [0, 2],
        [1, 2],
        [2, 2],
        [1, 2],
      ],
      "walk-up": [
        [0, 3],
        [1, 3],
        [2, 3],
        [1, 3],
      ],
      "walk-left": [
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 1],
      ],
    };
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;
    // how many frames to wait before updating the animation
    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = 0;

    // game object for drawing reference
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key: string) {
    if (this.currentAnimation === key) return;
    this.currentAnimation = key;
    this.currentAnimationFrame = 0;
    this.animationFrameProgress = this.animationFrameLimit;
  }

  updateAnimationProgress() {
    // downtick the animation frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress--;
      return;
    }

    // reset the animation frame progress
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame++;

    // reset the animation frame if it's at the end
    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx: any, cameraPerson: any, center: any) {
    const r =
      this.gameObject.position.r - 12 + center.r - cameraPerson.position.r; // include nudge values
    const c =
      this.gameObject.position.c - 4 + center.c - cameraPerson.position.c; // include nudge values

    const [frameX, frameY] = this.frame;
    if (this.isShadowLoaded)
      ctx.drawImage(
        this.shadow,
        c,
        r,
        32,
        32 // destination x,y
      );
    if (this.isLoaded) {
      ctx.drawImage(
        this.image,
        frameX * 32,
        frameY * 32, // source x,y
        32,
        32, // source width, height
        c,
        r, // destination x,y
        32,
        32 // destination width, height
      );
    }

    this.updateAnimationProgress();
  }
}
