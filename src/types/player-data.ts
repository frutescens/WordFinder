import { Fonts } from "../enums/fonts";
import { InputUpgrades } from "../enums/input-upgrades";
import { OtherUpgrades } from "../enums/other-upgrades";

export type PlayerData = {
    playerId: number;
    startTime: number;
    font: Fonts;
}

export type PlayerProgress = {
    wordsFound: string[];
    inputUnlocks: InputUpgrades[];
    otherUnlocks: OtherUpgrades[];
}