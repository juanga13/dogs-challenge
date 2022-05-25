import './SearchInput.scss';
import { MouseEvent, useState } from "react";
import { Text } from "./Text";
import { toFirstUpperCase } from "../utils";
import { BreedSearchParam } from '../types';
import { ReactComponent as ZoomIcon } from '../assets/zoom.svg';

interface SearchInputProps {
    onChange: (data: BreedSearchParam) => void
    placeholder: string
    loading: boolean
    buttonProps: {
        icon: any
        text: string
        onClick: () => void
    }
    autocompleteProps: {
        options: { [breed: string]: string[] }
        loading: boolean
        error: string | null
    }
}

export const SearchInput = (props: SearchInputProps) => {
    const [searchText, setSearchText] = useState("");
    const [openAutocomplete, setOpenAutocomplete] = useState(false);

    const handleSelect = (e: MouseEvent, breed: string, subBreed: string | null) => {
        if (subBreed) setSearchText(toFirstUpperCase(subBreed))
        else setSearchText(toFirstUpperCase(breed))
        props.onChange({breed, subBreed});
        setOpenAutocomplete(false);
        e.stopPropagation();
    };

    const handleChange = (value1: string) => {
        const value = value1.toLowerCase();
        setSearchText(value);
        const breed = props.autocompleteProps.options[value];
        if (breed) props.onChange({breed: value, subBreed: null});
        else {
            let noSubBreedFound = false;
            const breedsData = props.autocompleteProps.options
            Object.keys(breedsData).forEach((breed) => {
                const subBreeds = breedsData[breed];
                const subBreedFound = subBreeds.find((subBreed) => subBreed === value)
                if (subBreedFound) {
                    noSubBreedFound = true;
                    props.onChange({breed: breed, subBreed: value})
                }
            })
            if (noSubBreedFound) props.onChange({breed: null, subBreed: null});
        }
    }

    return (
        <div className="search-input">
            <input
                onFocus={() => setOpenAutocomplete(true)}
                value={searchText}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={props.placeholder}
                autoFocus
                className={openAutocomplete ? 'focused' : ''}
            />
            {props.buttonProps && (
                <button onClick={() => props.buttonProps?.onClick()}>
                    <ZoomIcon/>
                    {props.buttonProps.text}
                </button>
            )}
            {openAutocomplete && <Autocomplete
                {...props.autocompleteProps}
                filterText={searchText}
                onSelect={handleSelect}
                onBlur={() => setOpenAutocomplete(false)}
            />}
        </div>
    );
}

interface AutocompleteProps {
    options: { [breed: string]: string[] }
    filterText: string
    onSelect: (e: MouseEvent, breed: string, subBreed: string | null) => void
    onBlur: () => void
    loading: boolean
    error: string | null
}

const Autocomplete = (props: AutocompleteProps) => {
    const breeds = Object.keys(props.options);

    const renderBreedOption = (breed: string) => {
        const subBreeds = props.options[breed];
        if (subBreeds.length === 0) return (
            <div
                key={breed}
                className="option"
                onClick={(e) => props.onSelect(e, breed, null)}
            >
                <Text>{toFirstUpperCase(breed)}</Text>
            </div>
        );
        return (
            <div
                key={breed}
                className="option-container"
                onClick={(e) => props.onSelect(e, breed, null)}
            >
                <div className="option">
                    <Text>{toFirstUpperCase(breed)}</Text>
                </div>
                {subBreeds.filter((subBreed) => subBreed.includes(props.filterText)).map((subBreed) => (
                    <div
                        key={subBreed}
                        className="sub-option"
                        onClick={(e) => props.onSelect(e, breed, subBreed)}
                    >
                        <Text>{toFirstUpperCase(subBreed)}</Text>
                    </div>
                ))}
            </div>
        );
    }

    const filteredBreeds = breeds.filter((breed) => {
        const subBreeds = props.options[breed].filter((subBreed) => subBreed.includes(props.filterText));
        if (props.options[breed].length > 0 && subBreeds.length > 0) return true;
        else return breed.includes(props.filterText);
    })

    return (
        <>
            <div className="options-container-mask" onClick={() => props.onBlur()}/>
            <div className="options-container">
                {props.loading && <Text>loading</Text>}
                {props.error && <Text>error</Text>}
                {filteredBreeds.length === 0 && !props.loading && !props.error && <Text>No breed matching that name</Text>}
                {filteredBreeds.map(renderBreedOption)}
            </div>
        </>
    );
}