import { useState } from 'react';
import './Image.scss';

interface ImageProps {
    src: string
}

export const Image = (props: ImageProps) => {
    const [loading, setLoading] = useState(true);
    
    return (
        <div className={loading ? 'image-loading' : 'image'}>
            <img
                alt=''
                src={props.src} 
                onLoad={() => setLoading(false)}
            />
        </div>
    );
};
