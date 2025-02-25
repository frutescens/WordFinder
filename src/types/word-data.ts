
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