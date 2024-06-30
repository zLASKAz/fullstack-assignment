import React, { FC, CSSProperties, MouseEventHandler } from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    style?: CSSProperties;
    className?: string;
}

const ButtonOutline: FC<ButtonProps> = ({ children, onClick, style, className }) => {
    return (
        <button
            onClick={onClick}
            style={{ ...defaultStyle, ...style }}
            className={`py-2.5 px-4 rounded-lg text-sm h-10 ${className || ''}`}
        >
            {children}
        </button>
    );
};

const defaultStyle: CSSProperties = {
    color: '#49A569',
    border: "1px solid #49A569"
};

export default ButtonOutline;