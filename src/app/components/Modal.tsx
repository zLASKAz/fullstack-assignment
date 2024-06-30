
import React, { FC } from 'react';
import { useMediaQuery } from 'react-responsive';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: {
        h: string,
        w: string
    };
    closeButton?: boolean
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, size, closeButton }) => {
    if (!isOpen) return null;
    const widthClass = size?.w ? `w-[${size.w}]` : 'w-[685px]';
    const heightClass = size?.h ? `h-[${size.h}]` : 'h-[510px]';
    const isLargeScreen = useMediaQuery({ query: '(min-width: 768px)' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none ">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
                <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            <div className={`relative bg-white rounded-lg m-4 md:mx-auto p-4 md:p-[30px] ${!isLargeScreen ? 'h-fit w-screen' : `${widthClass} ${heightClass}`}`}>
                {closeButton ? <></> : <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>}
                {children}
            </div>
        </div>
    );
};

export default Modal;
