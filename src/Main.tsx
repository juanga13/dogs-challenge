import { useEffect, useState } from "react";
import { Image } from "./components/Image";
import { SearchInput } from "./components/SearchInput";
import { Text } from "./components/Text";
import { API_URLS, initialQueryState } from "./consts";
import { BreedSearchParam } from "./types";
import { request } from "./utils";

const App = () => {
    // because when searching for subbreed, should be ".../<breed>/<subbreed>/..." in the fetch
    const [breedSearchParam, setBreedSearchParam] = useState<BreedSearchParam>({breed: null, subBreed: null});
    const [dogBreedsQueryData, setDogBreedsQueryData] = useState(initialQueryState);
    const [dogsQueryData, setDogsQueryData] = useState(initialQueryState);

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
        console.log('handleSearchClick', breedString);
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
            })
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
                {dogsQueryData.loading && <Text>loading</Text>}
                {dogsQueryData.error && <Text>error</Text>}
                {Object.keys(dogsQueryData.data).length === 0 && !dogsQueryData.loading && !dogsQueryData.error && <Text>No dogs searched yet!</Text>}
                {Object.values(dogsQueryData.data).map((imgSrc) => (
                    <Image key={imgSrc} src={imgSrc}/>
                ))}
            </div>
            <div className="favourite-dogs-container">
                some favourite dogs results here :D
            </div>
        </div>
    );
}

export default App;
