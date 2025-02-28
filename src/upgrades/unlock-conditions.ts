import { InputUpgrades } from "../enums/input-upgrades";
import { OtherUpgrades } from "../enums/other-upgrades";

export type UnlockConditionFunc = (wordsFound: string[]) => boolean;

export const INPUT_UPGRADES_CONDITIONS = {
  [InputUpgrades.ALPHABET_SOUP]: (wordsFound: string[]) => {
    return alphabetCounter(wordsFound, 5);
  },
  [InputUpgrades.ALPHABET_CITY]: (wordsFound: string[]) => {
    return alphabetCounter(wordsFound, 25)
  },
  [InputUpgrades.FOUR_LETTERS]: (wordsFound: string[]) => {
    return wordLengthCounter(wordsFound, 4, 1000);
  },
  [InputUpgrades.FIVE_LETTERS]: (wordsFound: string[]) => {
    return wordLengthCounter(wordsFound, 5, 500);
  },
  [InputUpgrades.SIX_LETTERS]: (wordsFound: string[]) => {
    return wordLengthCounter(wordsFound, 6, 250);
  },
  [InputUpgrades.SEVEN_LETTERS]: (wordsFound: string[]) => {
    return wordLengthCounter(wordsFound, 7, 100);
  },
  [InputUpgrades.SYNONYMS]: (wordsFound: string[]) => {
    return wordsFound.length >= 10000;
  },
  [InputUpgrades.ANTONYMS]: (wordsFound: string[]) => {
    return wordsFound.length >= 20000;
  },
  [InputUpgrades.CAT]: (wordsFound: string[]) => {
    return wordsFound.includes("MUMBLE");
  }
};

function alphabetCounter(wordsFound: string[], threshold: number): boolean {
    const counter = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: 0, N: 0, O: 0, P: 0, Q: 0, R: 0, S: 0, T: 0, U: 0, V: 0, W: 0, X: 0, Y: 0, Z: 0 };
    wordsFound.forEach(word => {
        if (counter[word[0]]) {
            counter[word[0]]++;
        }
    });
    return Object.values(counter).every(x => x >= threshold);
}

function wordLengthCounter(
  wordsFound: string[],
  wordLength: number,
  threshold: number
): boolean {
  return wordsFound.filter((x) => x.length === wordLength).length >= threshold;
}
