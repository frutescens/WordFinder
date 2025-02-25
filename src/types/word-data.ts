
export type JSONEntry = {
    ANTONYMS: string[],
    MEANINGS: any[],
    SYNONYMS: string[]
}

export type WordData = {
    definitions: Definition[],
    synonynms: string[],
    antonyms: string[]
}

export type Definition = {
    partOfSpeech: string,
    meaning: string, 
    categories: string[]
    examples: string[]
}