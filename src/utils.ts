import { ALL_INPUT_UPGRADES } from "./enums/input-upgrades";
import { ALL_OTHER_UPGRADES } from "./enums/other-upgrades";
import { PlayerProgress } from "./types/player-data";
import WordDict from "./word_list.json" assert { type: "json" };

export function uppercaseList(array: string[]): string[] {
  array.forEach((x) => {
    x = x.toUpperCase();
  });
  return array;
}

export function getWordsFound(): string[] {
  const playerProgress = JSON.parse(
    localStorage.getItem("PlayerProgress")!
  ) as PlayerProgress;
  return playerProgress.wordsFound;
}

export function randInt(max: number, min: number = 0): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randItem<T>(items: T[]): T {
  return items.length === 1 ? items[0] : items[randInt(items.length)];
}

export const DICTIONARY_KEYS = Object.keys(WordDict);
export const DICTIONARY_SIZE = DICTIONARY_KEYS.length;
export const TOTAL_UPGRADES_COUNT =
  ALL_INPUT_UPGRADES.length + ALL_OTHER_UPGRADES.length;
