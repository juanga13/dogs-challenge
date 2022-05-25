import { useState } from 'react';
import { ReactComponent as HeartIcon } from '../assets/heart.svg';
import './DogImage.scss';

interface ImageProps {
    src: string
    fav: boolean
    onHeartClick: () => void
    loading?: boolean
}

export const DogImage = (props: ImageProps) => {
    const [loading, setLoading] = useState(true);
    
    return (
        <div className={(loading || props.loading) ? 'dog-image-loading' : 'dog-image'}>
            <div
                className={'heart-container' + (props.fav ? ' fav' : '')}
                onClick={() => props.onHeartClick()}
            >
                <HeartIcon/>
            </div>
            <img
                alt=''
                src={props.src} 
                onLoad={() => setLoading(false)}
            />
        </div>
    );
};
