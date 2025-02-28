import { Fonts } from "../enums/fonts";
import { InputUpgrades } from "../enums/input-upgrades";

export type PlayerData = {
    playerId: number;
    startTime: number;
    font: Fonts;
}

export type PlayerProgress = {
    wordsFound: string[];
    inputUpgrades: InputUpgrades[];
}