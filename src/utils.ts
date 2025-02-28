import { ALL_INPUT_UPGRADES } from "./enums/input-upgrades";
import { PlayerProgress } from "./types/player-data";
import WordDict from "./word_list.json" assert { type: "json" };
import { WordData, Definition } from "./types/word-data";

/**
 * Uppercases the contents of a string array
 * @param array a list of strings
 * @returns the string array with its contents uppercased
 */
export function uppercaseList(array: string[]): string[] {
  array.forEach((x) => {
    x = x.toUpperCase();
  });
  return array;
}

/**
 * Helper function that generates a random value
 * @param max the maximum value
 * @param min the minimum value
 * @returns a random integer between max and min
 */
export function randInt(max: number, min: number = 0): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Helper function that selects and returns a random item from a provided array object
 * @param items an array object
 * @returns a random item from the provided array
 */
export function randItem<T>(items: T[]): T {
  return items.length === 1 ? items[0] : items[randInt(items.length)];
}

/**
 * Helper function that processes the dictionary entry from the JSON dictionary and transforms it into a more accessible function
 * @param inputWord 
 * @returns a {@linkcode WordData} object
 */
export function processDictionaryEntry(inputWord: string): WordData {
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