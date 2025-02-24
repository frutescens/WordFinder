import Phaser from "phaser";
import BBCodeTextPlugin from "phaser3-rex-plugins/plugins/bbcodetext-plugin";
import InputTextPlugin from "phaser3-rex-plugins/plugins/inputtext-plugin";
import TransitionImagePackPlugin from "phaser3-rex-plugins/templates/transitionimagepack/transitionimagepack-plugin";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import pkg from "../package.json";
import { BaseScene } from "./scenes/base-scene";
import { LoadPlayer } from "./scenes/load-player";
import { MainGame } from "./scenes/main-game";
import { UnlockManager } from "./scenes/unlock-manager";

declare module 'phaser' {
  interface Scene {
    rexUI: UIPlugin;
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
    scene: [BaseScene, LoadPlayer, MainGame, UnlockManager],
    version: pkg.version,
  });
}
