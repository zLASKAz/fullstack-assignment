// components/SearchBox.tsx

import React, { FC, useState } from 'react';
import Image from 'next/image';
interface SearchBoxProps {
    onSearch: (query: string) => void;
}

const SearchBox: FC<SearchBoxProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(searchQuery.trim());
    };

    return (
        <form onSubmit={handleSearchSubmit} className="flex items-center">
            <Image src="/icons/searchIcon.png" alt="search" width={20} height={20}></Image>
            <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="border border-gray-300 rounded-md py-2 px-4 mr-2 focus:outline-none focus:border-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
            >
                Search
            </button>
        </form>
    );
};

export default SearchBox;
