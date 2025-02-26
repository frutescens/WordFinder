import eventsCenter from "./events-center";
import { PlayerProgress } from "./types/player-data";


export function uppercaseList(array: string[]): string[] {
    array.forEach(x => { 
        x = x.toUpperCase();
    });
    return array;
}

export function getWordsFound(): string[] {
    const playerProgress = JSON.parse(localStorage.getItem('PlayerProgress')!) as PlayerProgress;
    return playerProgress.wordsFound;
}