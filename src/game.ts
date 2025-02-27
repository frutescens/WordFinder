import Phaser from "phaser";
import BBCodeTextPlugin from "phaser3-rex-plugins/plugins/bbcodetext-plugin";
import InputTextPlugin from "phaser3-rex-plugins/plugins/inputtext-plugin";
import DataManagerPlugin from "phaser3-rex-plugins/plugins/localstorage-data-plugin";
import TransitionImagePackPlugin from "phaser3-rex-plugins/templates/transitionimagepack/transitionimagepack-plugin";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import pkg from "../package.json";
import { BaseScene } from "./scenes/base-scene";
import { SaveManager } from "./scenes/save-manager";
import { MainGame } from "./scenes/main-game";
import { UnlockManager } from "./scenes/unlock-manager";
import { ProgressDisplayManager } from "./scenes/progress-display-manager";
import { InputManager } from "./scenes/input-manager";

declare module 'phaser' {
  interface Scene {
    rexUI: UIPlugin;
    dataManager: DataManagerPlugin;
  }
}
export const game: Phaser.Game = initGame();

function initGame() {
  return new Phaser.Game({
    type: Phaser.WEBGL,
    parent: 'app',
    scale: {
      width: 1920,
      height: 1080,
      mode: Phaser.Scale.FIT,
    },
    plugins: {
      global: [
        {
          key: "rexInputTextPlugin",
          plugin: InputTextPlugin,
          start: true,
        },
        {
          key: "rexBBCodeTextPlugin",
          plugin: BBCodeTextPlugin,
          start: true,
        },
        {
          key: "rexTransitionImagePackPlugin",
          plugin: TransitionImagePackPlugin,
          start: true,
        },
      ],
      scene: [
        {
          key: "rexUI",
          plugin: UIPlugin,
          mapping: "rexUI",
        },
        {
          key: 'rexDataManagerPlugin',
          plugin: DataManagerPlugin,
          mapping: 'dataManager'
        }
      ],
    },
    input: {
      mouse: {
      },
      keyboard: {
      },
    },
    dom: {
      createContainer: true,
    },
    pixelArt: true,
    scene: [BaseScene, SaveManager, MainGame, UnlockManager, ProgressDisplayManager, InputManager],
    version: pkg.version,
  });
}
