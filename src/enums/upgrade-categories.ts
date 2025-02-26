import { ALL_INPUT_UPGRADES } from "./input-upgrades";
import { ALL_OTHER_UPGRADES } from "./other-upgrades";

export enum UpgradeCategories {
    INPUT,
    OTHER
}

export const NUMBER_OF_UPGRADES = ALL_INPUT_UPGRADES.length + ALL_OTHER_UPGRADES.length;