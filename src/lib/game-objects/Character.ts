import { utils } from "../utils";
import GameObject from "./GameObject";

export default class Character extends GameObject {
  [key: string]: any;

  constructor(config: any) {
    super(config);

    // character stats
    this.stats = {
      maxHp: 10,
      hp: 10,
    };
    // character equipment
    // character inventory
    // character status effects

    // is player controlled
    this.isPlayerControlled = config.isPlayerControlled || false;

    // movement
    this.subCellPosition = 0;
    this.movingProgressRemaining = 0;
    this.directionUpdate = {
      up: { r: -1, c: 0 },
      down: { r: 1, c: 0 },
      left: { r: 0, c: -1 },
      right: { r: 0, c: 1 },
    };
    this.isStanding = false;
  }

  update(state: any) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      if (
        this.isPlayerControlled &&
        state.arrow &&
        !state.map.isCutscenePlaying
      ) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow,
        });
      }
      // update sprite
      this.updateSprite();
    }
  }

  startBehavior(state: any, behavior: any) {
    // set direction
    this.direction = behavior.direction;
    // check the behavior
    switch (behavior.type) {
      case "walk":
        // if space to move to is taken
        const canMoveTo = state.map.canMoveTo(
          this.position.r,
          this.position.c,
          this.direction
        );
        if (!canMoveTo) {
          // if the behavior should be retried (as in an npc movement path)
          behavior.retry &&
            setTimeout(() => this.startBehavior(state, behavior), 10);
          return;
        }

        // start walking
        state.map.moveCollision(
          this.position.r,
          this.position.c,
          this.direction
        );
        this.movingProgressRemaining = 24;
        this.updateSprite();

        break;
      case "stand":
        this.isStanding = true;
        setTimeout(() => {
          // emit a standing complete event
          utils.emitEvent("person-standing-complete", {
            whoId: this.id,
          });
          this.isStanding = false;
        }, behavior.time);
        break;
    }
  }

  updatePosition() {
    const { r, c } = this.directionUpdate[this.direction];

    this.position.r += r;
    this.position.c += c;
    this.movingProgressRemaining--;

    if (this.movingProgressRemaining === 0)
      utils.emitEvent("person-walking-complete", {
        whoId: this.id,
      });
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0)
      return this.sprite.setAnimation("walk-" + this.direction);

    this.sprite.setAnimation("idle-" + this.direction);
  }
}
