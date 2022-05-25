import { QueryState } from "./types"

export const API_URLS = {
    ALL_BREEDS: 'https://dog.ceo/api/breeds/list/all',
    IMAGE_FROM_BREED: (breedString: string) => 
        `https://dog.ceo/api/breed/${breedString}/images/random/40`,
}

export const initialQueryState: QueryState = {
    data: {},
    loading: false,
    error: null,
}
