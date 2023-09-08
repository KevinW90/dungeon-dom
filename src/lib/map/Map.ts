import { createNoise2D } from "simplex-noise";
import { utils } from "../utils";
import Character from "../game-objects/Character";
import WorldEvent from "../events/WorldEvent";
const noise2d = createNoise2D();

const typeToNumber: { [key: string]: any[] } = {
  grass: [78, 79, 94, 95],
  dirt: [120, 121, 122, 136, 137, 138, 152, 153, 154, 169, 170],
  rocks: [243, 244, 245],
  fauna: [151, 167, 167],
  stone: [14, 15, 30, 31, 46, 47, 76, 62, 63, 59, 60, 61, 75, 77, 91, 92, 93],
  structures: [
    {
      name: "stone-block",
      // prettier-ignore
      matrix: [
        [153],
        [169]
      ],
      barrierLevels: [false, true],
    },
    {
      name: "stone-pillar",
      // prettier-ignore
      matrix: [
        [91],
        [107],
        [123]
      ],
      barrierLevels: [false, false, true],
    },
    // {
    //   name: "runic-circle",
    //   matrix: [
    //     [139, 140, 141],
    //     [155, 156, 157],
    //     [171, 172, 173],
    //   ],
    //   barrierLevels: [true, true, true],
    // },
  ],
};

const imageNumTilesPerRow = 16;
const tileSize = 32;
const tileRenderSize = 24;

export default class Map {
  [key: string]: any;

  constructor(config: any) {
    this.center = config.center;
    this.rows = config.rows || 10;
    this.cols = config.cols || 10;
    this.noiseContext = config.noiseContext || this.rows;
    this.collisions = config.collisions || {};
    this.ground = this._createLayer("ground");
    this.obstacles = this._createLayer("obstacles");
    this.groundTileset = new Image();
    this.groundTileset.src = config.groundTileset;
    this.obstaclesTileset = new Image();
    this.obstaclesTileset.src = config.obstaclesTileset;
    this.tileRenderSize = config.tileRenderSize || tileRenderSize;
    this.scale = config.scale || 1;

    this.cutsceneSpaces = config.cutsceneSpaces || {};

    this.gameObjects = config.gameObjects;

    this.isCutscenePlaying = false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key: any) => {
      // TODO: determine if this object should actually mount
      // EX: a key that has been picked up should not mount
      let gameObject = this.gameObjects[key];
      gameObject.id = key;
      gameObject.mount(this);
    });
  }

  private _createLayer(layer: string) {
    let res: number[][] = [];
    if (layer === "obstacles") {
      this.groundObstacles = [];
      this.restObstacles = [];
    }

    for (let r = 0; r < this.rows; r++) {
      if (layer === "obstacles") {
        this.groundObstacles[r] = [];
        this.restObstacles[r] = [];
      }
      for (let c = 0; c < this.cols; c++) {
        const rx = r / this.noiseContext;
        const cx = c / this.noiseContext;
        let e =
          1 * noise2d(rx, cx) +
          0.5 * noise2d(2 * rx + 5.3, 2 * cx + 9.1) +
          0.25 * noise2d(4 * rx + 17.8, 4 * cx + 23.5);
        e = e / (1 + 0.5 + 0.25);
        const noiseValue = Math.pow(Math.abs(e), 0.5);
        let tileType: string = "";
        if (layer === "ground") {
          tileType = noiseValue < 0.6 ? "stone" : "dirt";
        } else if (layer === "obstacles") {
          tileType = noiseValue < 0.2 ? "structure" : "";
        }

        if (tileType === "structure") {
          // choose a random structure
          const structures = typeToNumber.structures;
          const structure = structures[(Math.random() * structures.length) | 0];
          const matrix = structure.matrix;
          const barrierLevels = structure.barrierLevels;

          // check if structure can fit
          const structureWidth = matrix[0].length;
          const structureHeight = matrix.length;

          if (r - structureHeight < 0) continue;
          if (c + structureWidth > this.cols) continue;

          // loop through matrix and place other tiles
          let matrixReversed = [...matrix].reverse();
          let barriersReversed = [...barrierLevels].reverse();
          for (let i = 0; i < matrixReversed.length; i++) {
            const row = matrixReversed[i];
            for (let j = 0; j < row.length; j++) {
              const tileNumber = row[j];
              if (barriersReversed[i]) {
                this.groundObstacles[r] = this.groundObstacles[r] || [];
                this.groundObstacles[r][c] = tileNumber;
                this.addCollision(r * 24, c * 24, {
                  type: "barrier",
                });
              } else {
                this.restObstacles[r - i] = this.restObstacles[r - i] || [];
                this.restObstacles[r - i][c + j] = tileNumber;
              }
            }
          }
        } else {
          if (tileType) {
            let tileNumber =
              typeToNumber[tileType][
                (Math.random() * typeToNumber[tileType].length) | 0
              ];

            res[r] = res[r] || [];
            res[r][c] = tileNumber;
          }
        }
      }
    }
    return res;
  }

  drawLayer(layer: string, ctx: any, cameraPerson: any) {
    for (let r = 0; r < this[layer].length; r++) {
      for (let c = 0; c < this[layer][r].length; c++) {
        const tileNumber = this[layer][r][c];
        let tileRow = (tileNumber / imageNumTilesPerRow) | 0;
        let tileCol = tileNumber % imageNumTilesPerRow | 0;
        const sx = tileCol * tileSize;
        const sy = tileRow * tileSize;
        const dx = c * tileRenderSize + this.center.c - cameraPerson.position.c;
        const dy = r * tileRenderSize + this.center.r - cameraPerson.position.r;
        ctx.drawImage(
          layer === "ground" ? this.groundTileset : this.obstaclesTileset,
          sx,
          sy,
          tileSize,
          tileSize,
          dx,
          dy,
          tileRenderSize,
          tileRenderSize
        );
      }
    }
  }

  async startCutscene(events: any[]) {
    this.isCutscenePlaying = true;

    // start a loop of async events and await each one
    for (const event of events) {
      const eventHandler = new WorldEvent({ event, map: this });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // reset npcs to do their normal behavior
    Object.values(this.gameObjects).forEach((gameObject: any) => {
      gameObject.doBehavior(this);
    });
  }

  checkForInteraction() {
    const hero = this.gameObjects.hero;
    const { r, c } = utils.nextPosition(
      hero.position.r,
      hero.position.c,
      hero.direction
    );
    const match: any = Object.values(this.gameObjects).find(
      (gameObject: any) => {
        return gameObject.position.r === r && gameObject.position.c === c;
      }
    );
    // check for certain game conditions and choose the correct event type
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects.hero;
    const match = this.cutsceneSpaces[`${hero.position.r},${hero.position.c}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  canMoveTo(currentR: number, currentC: number, direction: string) {
    const { r, c } = utils.nextPosition(currentR, currentC, direction);
    const key = `${r},${c}`;
    return this.collisions[key]?.type !== "barrier";
  }

  addCollision(r: number, c: number, data: any = {}) {
    const key = `${r},${c}`;
    this.collisions[key] = { ...data };
  }

  removeCollision(r: number, c: number) {
    const key = `${r},${c}`;
    delete this.collisions[key];
  }

  moveCollision(wasR: number, wasC: number, direction: string) {
    const collisionData = this.collisions[`${wasR},${wasC}`];
    this.removeCollision(wasR, wasC);
    const { r, c } = utils.nextPosition(wasR, wasC, direction);
    this.addCollision(r, c, collisionData);
  }
}

export const Maps: any = {
  DemoRoom: {
    rows: 10,
    cols: 10,
    gameObjects: {
      npc1: new Character({
        position: { r: utils.withGrid(5), c: utils.withGrid(5) },
        src: "assets/images/characters/people/npcs/npc1.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 800 },
          { type: "stand", direction: "up", time: 800 },
          { type: "stand", direction: "right", time: 1200 },
          { type: "stand", direction: "up", time: 300 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                message: "Welcome traveler!",
                faceHero: "npc1",
              },
              {
                type: "textMessage",
                message: "Have you checked out the store?",
              },
              // { type: "battle", message: "battle has started" },
            ],
          },
        ],
      }),
      npc2: new Character({
        position: { r: utils.withGrid(1), c: utils.withGrid(2) },
        src: "assets/images/characters/people/npcs/npc2.png",
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "stand", direction: "up", time: 800 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "down" },
        ],
      }),
    },
    groundTileset: "assets/images/tilesets/overworld.png",
    obstaclesTileset: "assets/images/tilesets/obstacles.png",
    cutsceneSpaces: {
      [`${utils.asGridCoord(4, 3)}`]: [
        {
          events: [
            {
              type: "textMessage",
              message: "Should not have stepped there!",
            },
            { who: "hero", type: "walk", direction: "up" },
          ],
        },
      ],
      [`${utils.asGridCoord(6, 0)}`]: [
        {
          events: [{ type: "changeMap" }],
        },
      ],
    },
  },
};
