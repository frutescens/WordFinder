import { ALL_INPUT_UPGRADES } from "./enums/input-upgrades";
import { PlayerProgress } from "./types/player-data";
import WordDict from "./word_list.json" assert { type: "json" };
import { JSONEntry, WordData, Definition } from "./types/word-data";

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

export function processDictionaryEntry(inputWord: string) {
  const dictionaryEntry = WordDict[inputWord];
  const newEntry: WordData = {
    definitions: [],
    synonynms: [],
    antonyms: [],
  };
  newEntry.synonynms = uppercaseList(dictionaryEntry.SYNONYMS as string[]);
  newEntry.antonyms = uppercaseList(dictionaryEntry.ANTONYMS as string[]);
  dictionaryEntry.MEANINGS.forEach((element) => {
    const newMeaning: Definition = {
      partOfSpeech: element[0],
      meaning: element[1],
      categories: element[2],
      examples: element[3],
    };
    newEntry.definitions.push(newMeaning);
  });
  return newEntry;
}

export const DICTIONARY_KEYS = Object.keys(WordDict);
export const DICTIONARY_SIZE = DICTIONARY_KEYS.length;
export const TOTAL_UPGRADES_COUNT =
  ALL_INPUT_UPGRADES.length;