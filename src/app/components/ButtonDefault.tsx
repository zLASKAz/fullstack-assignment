import React, { FC, CSSProperties, MouseEventHandler } from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    style?: CSSProperties;
    className?: string;
}

const Button: FC<ButtonProps> = ({ children, onClick, style, className }) => {
    const hasBgColor = className?.includes('bg-');

    return (
        <button
            onClick={onClick}
            style={style}
            className={`py-2.5 px-4 rounded-lg text-sm h-10 ${hasBgColor ? '' : 'bg-[#49A569] text-white'} ${className || ''}`}
        >
            {children}
        </button>
    );
};

export default Button;
