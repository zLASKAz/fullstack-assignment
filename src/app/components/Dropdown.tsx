import React, { FC, useState } from 'react';
import Image from 'next/image';

interface DropdownProps {
    title: string;
    items: string[];
    selectedItem?: string | null;
    selectedItemFilter?: string;
    onItemSelected: (item: string, type: string) => void;
    type: string;
    className?: string;
}

const Dropdown: FC<DropdownProps> = ({ title, items, selectedItem, onItemSelected, type, className }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleItemClick = (item: string) => {
        onItemSelected(item, type);
        setIsOpen(false);
    };

    return (
        <div className="relative ">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex justify-center items-center font-semibold rounded-md text-medium ${className || ''}`}
            >
                {selectedItem ? selectedItem : title}
                <Image src="/icons/dropdownIcon.png" alt='dropdown' width={10} height={5} className='ml-2'></Image>
            </button>

            {isOpen && (
                <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                    {items.map((item, index) => (
                        <div key={index} className="py-1">
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleItemClick(item)}
                            >
                                {item}
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
