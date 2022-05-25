import { useEffect, useState } from "react";
import { DogImage } from "./components/DogImage";
import { SearchInput } from "./components/SearchInput";
import { Text } from "./components/Text";
import { API_URLS, initialQueryState } from "./consts";
import { BreedSearchParam } from "./types";
import { request } from "./utils";
import { ReactComponent as HeartIcon } from './assets/heart.svg';

/* local storage stuff */
const FAVOURITE_DOGS_KEY = 'favouriteDogs';
const getFavouriteDogs = (): string[] => {
    const favouriteDogs = localStorage.getItem(FAVOURITE_DOGS_KEY);
    if (!favouriteDogs) return [];
    else return JSON.parse(favouriteDogs);
}
const saveFavouriteDog = (url: string, operationType: 'fav' | 'unfav') => {
    console.log(url, operationType);
    const favouriteDogsString = localStorage.getItem(FAVOURITE_DOGS_KEY);
    if (!favouriteDogsString) {
        localStorage.setItem(
            FAVOURITE_DOGS_KEY,
            JSON.stringify([url])
        );   
    } else {
        const favouriteDogs: string[] = JSON.parse(favouriteDogsString);
        localStorage.setItem(
            FAVOURITE_DOGS_KEY,
            operationType === 'fav'
                ? JSON.stringify([...favouriteDogs, url])
                : JSON.stringify(favouriteDogs.filter((imgUrl) => imgUrl !== url))
        );
    }
}

const App = () => {
    // when searching for subbreed, should be ".../<breed>/<subbreed>/..." in the fetch
    const [breedSearchParam, setBreedSearchParam] = useState<BreedSearchParam>({breed: null, subBreed: null});
    const [dogBreedsQueryData, setDogBreedsQueryData] = useState(initialQueryState);
    const [dogsQueryData, setDogsQueryData] = useState(initialQueryState);
    const [favouriteDogs, setFavouriteDogs] = useState(getFavouriteDogs());

    useEffect(() => {
        setDogBreedsQueryData({...dogBreedsQueryData, loading: true});
        request<{message: {[breed: string]: string[]}, status: boolean}>(API_URLS.ALL_BREEDS)
            .then((res) => {
                setDogBreedsQueryData({
                    ...dogBreedsQueryData,
                    data: res.status ? res.message : {},
                    error: !res.status ? 'Error!' : null,
                    loading: false,
                })
            });
    }, []);

    const handleSearchClick = () => {
        setDogsQueryData({...dogsQueryData, loading: true});
        let breedString = '';
        if (!breedSearchParam.breed) return;
        if (!breedSearchParam.subBreed) breedString = breedSearchParam.breed;
        else breedString = breedSearchParam.breed + '/' + breedSearchParam.subBreed
        request<{message: {[key: string]: string[]}, status: boolean}>(
            API_URLS.IMAGE_FROM_BREED(breedString)
        )
            .then((res) => {
                setDogsQueryData({
                    ...dogsQueryData,
                    data: res.status ? res.message : {},
                    error: !res.status ? 'Error!' : null,
                    loading: false,
                })
            });
    };

    return (
        <div className="main">
            <Text title>Dog breeds</Text>
            <SearchInput
                onChange={setBreedSearchParam}
                placeholder="Start typing to search breeds!"
                loading={dogBreedsQueryData.loading}
                buttonProps={{
                    icon: null,
                    onClick: handleSearchClick,
                    text: "Search",
                }}
                autocompleteProps={{
                    options: dogBreedsQueryData.data,
                    loading: dogBreedsQueryData.loading,
                    error: dogBreedsQueryData.error,
                }}
            />
            <div className="dogs-container">
                {dogsQueryData.error && <Text>error</Text>}
                {Object.keys(dogsQueryData.data).length === 0 && !dogsQueryData.loading && !dogsQueryData.error && <Text>No dogs searched yet!</Text>}
                {Object.values(dogsQueryData.data).map((imgSrc) => {
                    const fav = favouriteDogs.includes(imgSrc);
                    return (
                        <DogImage
                            key={imgSrc}
                            src={imgSrc}
                            loading={dogsQueryData.loading}
                            onHeartClick={() => {
                                saveFavouriteDog(imgSrc, fav ? 'unfav' : 'fav');
                                setFavouriteDogs(getFavouriteDogs());
                            }}
                            fav={fav}
                        />
                    );
                })}
            </div>
            <div className="favourite-dogs">
                <div className="title">
                    <HeartIcon/>
                    <Text>Favourites</Text>
                </div>
                <div className="dogs-container">
                    {favouriteDogs.length === 0 && <Text>{`No favourite dogs yet :(`}</Text>}
                    {favouriteDogs.map((imgSrc) => (
                        <DogImage
                            key={imgSrc}
                            src={imgSrc}
                            onHeartClick={() => {
                                saveFavouriteDog(imgSrc, 'unfav');
                                setFavouriteDogs(getFavouriteDogs());
                            }}
                            fav
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
