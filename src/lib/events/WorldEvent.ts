import Character from "../game-objects/Character";
import { Maps } from "../map/Map";
import { utils } from "../utils";

export default class WorldEvent {
  [key: string]: any;

  constructor(config: any) {
    const { event, map } = config;
    this.event = event;
    this.map = map;
  }

  init() {
    return new Promise((resolve) => this[this.event.type](resolve));
  }

  stand(resolve: any) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      { map: this.map },
      {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
      }
    );

    const completeHandler = (e: any) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener(
          "person-standing-complete",
          completeHandler
        );
        resolve();
      }
    };
    document.addEventListener("person-standing-complete", completeHandler);
  }

  walk(resolve: any) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      { map: this.map },
      {
        type: "walk",
        direction: this.event.direction,
        retry: true,
      }
    );

    // set up a handler to complete when correct person is done walking,
    // then resolve the event
    const completeHandler = (e: any) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener(
          "person-walking-complete",
          completeHandler
        );
        resolve();
      }
    };
    // no clear signal to listen to for when the walk is done
    document.addEventListener("person-walking-complete", completeHandler);
  }

  textMessage(resolve: any) {
    if (this.event.faceHero) {
      const gameObject = this.map.gameObjects[this.event.faceHero];
      gameObject.direction = utils.oppositeDirection(
        this.map.gameObjects.hero.direction
      );
    }
    utils.emitEvent("textMessage", {
      message: this.event.message,
      onComplete: () => {
        resolve();
      },
    });
  }

  changeMap(resolve: any) {
    utils.emitEvent("sceneTransition");
    setTimeout(() => {
      this.map.game.startMap({
        rows: 3,
        cols: 9,
        gameObjects: {
          npc3: new Character({
            position: { r: utils.withGrid(1), c: utils.withGrid(2) },
            src: "assets/images/characters/people/npcs/npc3.png",
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    message: "Welcome to the new map!",
                    faceHero: "npc3",
                  },
                ],
              },
            ],
          }),
        },
        groundTileset: "assets/images/tilesets/overworld.png",
        obstaclesTileset: "assets/images/tilesets/obstacles.png",
      });
    }, 500);
    setTimeout(() => {
      utils.emitEvent("sceneTransitionEnd");
    }, 500);

    resolve();
  }

  battle(resolve: any) {
    // utils.emitEvent("textMessage", {
    //   message: this.event.message,
    //   onComplete: () => {
    //     resolve();
    //   },
    // });
    utils.emitEvent("battle", {
      onComplete: () => {
        resolve();
      },
    });
  }
}
