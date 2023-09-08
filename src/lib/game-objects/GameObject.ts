import WorldEvent from "../events/WorldEvent";
import { utils } from "../utils";
import Sprite from "./Sprite";

export default class GameObject {
  // allows any key with any value
  // TODO: make this more specific
  [key: string]: any;

  constructor(config: any) {
    // mounted
    this.isMounted = false;
    // unique identfier for this object
    this.id = null;
    // position of the object
    this.position = config.position || {
      r: utils.withGrid(0),
      c: utils.withGrid(0),
    };
    // direction the object is facing
    this.direction = config.direction || "down";
    // scale at which to draw
    this.scale = config.scale || 1;
    // sprite for the object
    this.sprite = new Sprite({
      src: config.src,
      gameObject: this,
    });
    // behavior loop
    this.behaviorLoop = config.behaviorLoop || [];
    // behavior loop index
    this.behaviorLoopIndex = 0;

    // list of talking options
    this.talking = config.talking || [];
  }

  // onDestroy() {
  //   // remove from game
  // }

  mount(map: any) {
    this.isMounted = true;

    // add a collision to the map
    map.addCollision(this.position.r, this.position.c, {
      type: "barrier",
    });

    // start behavior after some delay
    setTimeout(() => {
      this.doBehavior(map);
    }, 10);
  }

  // this is the behavior a game object does while the player is roaming the map
  // it could be an npc walking around, an item floating, a chest sparkling, etc
  async doBehavior(map: any) {
    // if a cutscene is playing, do not do behavior
    if (map.isCutscenePlaying) return;
    // if no behavior loop, do not do behavior
    if (!this.behaviorLoop.length) return;
    // if standing, do not do behavior
    if (this.isStanding) return;

    // setup the event
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    // attach a game object to the event
    eventConfig.who = this.id;

    // create event instance
    let eventHandler = new WorldEvent({ event: eventConfig, map });
    await eventHandler.init();

    // set next event to fire
    this.behaviorLoopIndex++;
    // if we are at the end of the loop, start over
    if (this.behaviorLoopIndex === this.behaviorLoop.length)
      this.behaviorLoopIndex = 0;

    // do next behavior
    this.doBehavior(map);
  }

  update(state: any) {}
}
