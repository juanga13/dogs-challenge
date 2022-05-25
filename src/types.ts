export interface QueryState {
    data: {[key: string]: any}
    loading: boolean
    error: string | null
}

export interface BreedSearchParam {
    breed: string | null
    subBreed: string | null
}
