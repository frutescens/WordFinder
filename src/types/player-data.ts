import { Fonts } from "../enums/fonts";
import { Unlocks } from "../enums/unlocks";

export type PlayerData = {
    playerId: number;
    startTime: number;
    font: Fonts;
}

export type PlayerProgress = {
    wordsFound: string[];
    unlocks: Unlocks[]
}