import './Text.scss';

interface TextProps {
    children: string
    className?: string
    title?: boolean
}

export const Text = (props: TextProps) => {
    const className = 'text' + (props.title ? ' title' : '') + (props.className ? ' ' + props.className : '');
    return (
        <p className={className}>
            {props.children}
        </p>
    )    
};
