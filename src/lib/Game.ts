import Map, { Maps } from "./map/Map";
import DirectionInput from "./input/DirectionInput";
import KeyPressListener from "./input/KeyPressListener";
import Character from "./game-objects/Character";
import { utils } from "./utils";
import game from "./stores";

export default class Game {
  [key: string]: any;

  constructor(config: any) {
    this.center = config.center;
    this.element = config.element;
    this.canvas = this.element.querySelector("#game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this.cameraPerson = {
      position: {
        r: utils.withGrid(0),
        c: utils.withGrid(0),
      },
    };

    this.init();
  }

  startMap(mapConfig: any) {
    mapConfig.center = this.center;
    this.map = new Map(mapConfig);
    this.map.game = this;
    this.hero.position = { r: utils.withGrid(0), c: utils.withGrid(0) };
    this.map.gameObjects.hero = this.hero;
    this.map.mountObjects();
  }

  init() {
    this.hero = new Character({
      // position: { r: 0, c: 0 },
      isPlayerControlled: true,
      src: "assets/images/characters/people/heroes/hero1.png",
    });
    this.startMap(Maps.DemoRoom);

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.bindActionInput();
    this.bindHeroPositionChange();

    this.startGameLoop();

    // this.map.startCutscene([
    //   // { type: "textMessage", message: "Hello World! This is the game stuff!" },
    //   { type: "changeMap" },
    // ]);
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // is there something to interact with at this spot?
      this.map.checkForInteraction();
    });
  }

  bindHeroPositionChange() {
    document.addEventListener("person-walking-complete", (e: any) => {
      if (e.detail.whoId === "hero") {
        // the hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startGameLoop() {
    const step = () => {
      // clean up canvas before each draw
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.cameraPerson = this.hero;

      // update all objects
      Object.values(this.map.gameObjects).forEach((gameObject: any) => {
        gameObject.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      // draw first layer
      this.map.drawLayer("ground", this.ctx, this.cameraPerson);

      this.map.drawLayer("groundObstacles", this.ctx, this.cameraPerson);
      // draw game objects
      Object.values(this.map.gameObjects)
        .sort((a: any, b: any) => {
          return a.position.r - b.position.r;
        })
        .forEach((gameObject: any) => {
          gameObject.sprite.draw(this.ctx, this.cameraPerson, this.center);
        });

      this.map.drawLayer("restObstacles", this.ctx, this.cameraPerson);

      // TODO: draw second layer

      game.set(this);

      requestAnimationFrame(() => {
        step();
      });
    };

    step();
  }
}
