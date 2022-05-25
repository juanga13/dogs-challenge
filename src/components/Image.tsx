import './Image.scss';

interface ImageProps {
    src: string
}

export const Image = (props: ImageProps) => {
    return (
        <div
            className='image'
            style={{
                backgroundImage: `url("${props.src}")`,
            }}
        />
    )
};
