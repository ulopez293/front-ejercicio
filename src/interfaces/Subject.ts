export interface Subtema {
    id_subtema: number
    name: string
}

export interface Subject {
    id_tema: number
    tema: string
    subtemas: Subtema[]
}