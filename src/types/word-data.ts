
export type WordData = {
    Definitions: Definition[],
    Synoynms: string[],
    Antonyms: string[]
}

export type Definition = {
    PartOfSpeech: string,
    Meaning: string, 
    Catagories: string[]
}