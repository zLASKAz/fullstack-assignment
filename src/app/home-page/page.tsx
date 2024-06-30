'use client'
import React, { useEffect, useState } from 'react';
import Button from '../components/ButtonDefault';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';
import ButtonOutline from '../components/ButtonOutline';
import { useRouter } from 'next/navigation';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loading from '../components/Loading';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';


interface Comment {
    nameComment: string;
    image: string;
    timeStampComment: string;
    textComment: string;
}

// Define the type for a Kratu entity
interface Kratu {
    id: number;
    name: string;
    timeStamp: string;
    tagName?: string;
    title: string;
    content: string;
    comments: Comment[];
}

const Home = () => {
    const router = useRouter();
    const BASE_URL = process.env.BASE_URL
    const userName = useSelector((state: RootState) => state.user.userName);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDropdownSelectCreatePost, setIsOpenDropdownSelectCreatePost] = useState<boolean>(false);
    const [isOpenDropdownSelectFilter, setIsOpenDropdownSelectFilter] = useState<boolean>(false);
    const [isOpenSuccess, setIsOpenSuccess] = useState(false);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [dataFiltered, setDataFiltered] = useState<Kratu[]>([]);
    const dropdownItems = ['Community', 'History', 'Food', 'Pets', 'Health', 'Fashion', 'Exercise', 'Others'];
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [selectedItemFilter, setSelectedItemFilter] = useState<string>('Community');
    const [kratuData, setKratuData] = useState<Kratu[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const isLargeScreen = useMediaQuery({ query: '(min-width: 768px)' });
    const [placeholder, setPlaceholder] = useState('');
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
    useEffect(() => {
        if (isLargeScreen) {
            setPlaceholder("Search");
        } else {
            setPlaceholder('');
        }
    }, [isLargeScreen]);
    const fetchDataAfterCreate = async () => {
        try {
            const response = await axios.get<Kratu[]>(`${BASE_URL}/kratu`);
            const data = response.data;
            let sortedData = data.sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp))

            setKratuData(sortedData);
            if (selectedItemFilter !== 'Community') {
                const filteredData = data.filter((kratu) => kratu.tagName === selectedItemFilter);
                let sortedData = filteredData.sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp))

                setKratuData(sortedData);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userName === '') {
            router.push('/signin-page')
        }
        const fetchData = async () => {
            try {
                const response = await axios.get<Kratu[]>(`${BASE_URL}/kratu`);
                const data = response.data;
                let sortedData = data.sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp))
                console.log(sortedData)
                setKratuData(sortedData);
                if (selectedItemFilter !== 'Community') {
                    const filteredData = data.filter((kratu) => kratu.tagName === selectedItemFilter);
                    let sortedData = filteredData.sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp))
                    setKratuData(sortedData);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedItemFilter]);

    const handleSelectFilter = (selectedItem: string) => {
        setSelectedItemFilter(selectedItem);
        setIsOpenDropdownSelectFilter(!isOpenDropdownSelectFilter);
    };
    const handleSelectCreatePost = (selectedItem: string) => {
        setSelectedItem(selectedItem);
        setIsOpenDropdownSelectCreatePost(!isOpenDropdownSelectCreatePost)
    };

    const handleCreateKratu = async () => {
        const currentTimestamp = dayjs().valueOf().toString();
        if (userName && currentTimestamp && selectedItem && title && content) {
            const data = {
                name: userName,
                timeStamp: currentTimestamp,
                tagName: selectedItem,
                title,
                content,
                comments: []
            };
            try {
                setLoading(true);
                console.log(data)
                const response = await axios.post(`${BASE_URL}/kratu/post`, data);
                console.log('Post request successful:', response.data);
                setLoading(false);
                setIsOpen(false);
                fetchDataAfterCreate()
            } catch (error) {
                console.error('Error making POST request:', error);
            }
        }
    };

    const handleDate = (timeStamp: string) => {
        const dateInt = Number(timeStamp);
        if (isNaN(dateInt)) {
            return '';
        }
        const pastDate = dayjs(dateInt);
        const currentTimestamp = dayjs();
        const yearsDiff = currentTimestamp.diff(pastDate, 'year');
        const monthsDiff = currentTimestamp.diff(pastDate, 'month');
        const daysDiff = currentTimestamp.diff(pastDate, 'day');
        const hoursDiff = currentTimestamp.diff(pastDate, 'hour');
        const minutesDiff = currentTimestamp.diff(pastDate, 'minute');

        if (yearsDiff > 0) {
            return `${yearsDiff} y ago`;
        } else if (monthsDiff > 0) {
            return `${monthsDiff} mo. ago`;
        } else if (daysDiff > 0) {
            return `${daysDiff} day ago`;
        } else if (hoursDiff > 0) {
            return `${hoursDiff} h ago`;
        } else {
            return `${minutesDiff} min ago`;
        }
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    const filteredPosts = searchQuery
        ? kratuData.filter((kratu) =>
            kratu.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            kratu.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : kratuData;

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="relative min-h-screen bg-[#BBC2C0]">
            <header className="flex justify-between bg-[#253830]">
                <div className="text-white items-center flex ml-8 my-4">a Board</div>

                {!isLargeScreen ? <div className='flex items-center mr-5'>
                    <button onClick={() => setIsOpenMenu(true)}>

                        <Image src="/icons/menuIcon.png" alt="menu" width={24} height={24} />
                    </button>

                </div> : <>{userName ? (
                    <div className="flex gap-5 mr-8 my-2.5 w-[118px] items-center">
                        <div className="text-base font-medium text-white">{userName}</div>
                        <Image src="/icons/avatarIcon.png" alt="avatar-signin-already" width={40} height={40} />
                    </div>
                ) : (
                    <Button onClick={() => router.push('/signin-page')} className="mr-8 my-2.5 w-[105px] ">
                        Sign in
                    </Button>
                )}</>}
            </header>
            <div className="flex" >
                <div className="flex-1 flex-col items-start p-8  min-h-screen w-2/5 hidden md:flex">
                    <div className="flex gap-3 py-2 px-3">
                        <Image src="/icons/homeIcon.png" alt="home-icon" width={24} height={24} />
                        <Link href="/home-page" className="text-[16px] text-[#243831] focus:text-black">
                            Home
                        </Link>
                    </div>
                    <div className="flex gap-3 py-2 px-3">
                        <Image src="/icons/blogIcon.png" alt="blog-icon" width={24} height={24} />
                        <Link href="/our-blog" className="text-[16px] text-[#243831] focus:text-black">
                            Our Blog
                        </Link>
                    </div>
                </div>
                <div className="flex-3 p-4  md:w-3/5 w-screen">
                    <div className="flex justify-between h-10 mb-6 mt-7 items-center ">
                        <div className="flex rounded-lg md:border md:border-[1px solid #D8E9E4] px-3.5 py-2.5 gap-2 h-10">
                            <Image src="/icons/searchIcon.png" alt="search" width={20} height={20}></Image>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                placeholder={placeholder}
                                className="md:w-[535px] bg-[#BBC2C0] md:focus:outline-none md:focus:border-transparent w-2 focus:w-screen md:focus:w-[535px]"
                            />
                        </div>
                        <div>
                            <button
                                onClick={() => setIsOpenDropdownSelectFilter(!isOpenDropdownSelectFilter)}
                                className="inline-flex justify-center items-center font-semibold rounded-md text-medium "
                            >
                                {selectedItemFilter ? selectedItemFilter : 'Community'}
                                <Image src="/icons/dropdownIcon.png" alt="dropdown" width={10} height={5} className="ml-2"></Image>
                            </button>

                            {isOpenDropdownSelectFilter && (
                                <div className="origin-top-right absolute mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                                    {dropdownItems.map((item, index) => (
                                        <div key={index} className="py-1">
                                            <a
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleSelectFilter(item)}
                                            >
                                                {item}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button onClick={() => setIsOpen(!isOpen)}>Create +</Button>
                    </div>

                    <div className="gap-0.5 flex flex-col">
                        {filteredPosts.map((data, index) => (
                            <Link
                                href={{
                                    pathname: '/post-detail',
                                    query: {
                                        postDetailID: JSON.stringify(data.id),
                                    },
                                }}
                                key={index}
                            >
                                <div
                                    className={`flex flex-col gap-2.5 md:gap-5 bg-white p-4  ${index === 0 ? 'rounded-t-lg' : ''
                                        }`}
                                >
                                    <div className="flex gap-2 items-center">
                                        <Image src="/icons/avatarJessica.png" alt="jessica" width={30} height={30}></Image>
                                        <div className="text-sm font-medium">{data.name}</div>
                                        <div className=" text-gray-300 text-[12px] font-normal">{handleDate(data.timeStamp)}</div>
                                    </div>
                                    <div className="py-1 px-2 rounded-2xl w-fit text-xs" style={{ backgroundColor: '#F3F3F3', color: '#4A4A4A' }}>
                                        {data.tagName}
                                    </div>
                                    <div className="font-semibold text-medium">{data.title}</div>
                                    <div className="w-auto line-clamp-2">{data.content}</div>
                                    <div className="flex gap-2">
                                        <Image src="/icons/commentIcon.png" alt="back-icon" width={16} height={16} />
                                        <div>{data.comments.length} comments</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex-1"></div>
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
                <div className="flex flex-col">
                    <h1 className="text-[28px] text-[#192338] font-semibold mb-4">Create Post</h1>
                    <div className="flex flex-col gap-2.5">
                        <div className="relative ">
                            <button
                                onClick={() => setIsOpenDropdownSelectCreatePost(!isOpenDropdownSelectCreatePost)}
                                className="inline-flex justify-center items-center font-semibold rounded-md text-medium text-[#49A569] border border-[1px solid #49A569] py-2.5 px-3.5 "
                            >
                                {selectedItem ? selectedItem : 'Choose a community'}
                                <Image src="/icons/dropdownIcon.png" alt="dropdown" width={10} height={5} className="ml-2"></Image>
                            </button>

                            {isOpenDropdownSelectCreatePost && (
                                <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                                    {dropdownItems.map((item, index) => (
                                        <div key={index} className="py-1">
                                            <a
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleSelectCreatePost(item)}
                                            >
                                                {item}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder="Title"
                            className="rounded-lg w-auto border border-[#49A569] py-2.5 px-3.5 text-base"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            name="comment"
                            id="comment"
                            placeholder="What's on your mind..."
                            className="rounded-lg w-auto  h-[120px] md:h-[234px] border border-[#49A569] py-2.5 px-3.5 text-base"
                        ></textarea>
                        <div className="gap-3 flex flex-col md:flex-row justify-end">
                            <ButtonOutline className=" md:w-[105px]">Cancel</ButtonOutline>
                            <Button className=" md:w-[105px]" onClick={handleCreateKratu}>
                                Post
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <div className={`fixed top-0 right-0 h-full w-[280px] bg-[#243831] text-[#D8E9E4] p-4 transform ${isOpenMenu ? 'translate-x-0' : 'translate-x-full'}  transition-transform duration-200 ease-in-out`}>
                {isOpenMenu &&
                    <div>
                        <div className="px-[33px] py-[6px] " onClick={() => setIsOpenMenu(false)}>
                            <Image src="/icons/menuBackIcon.png" alt="menu" width={16} height={12} />
                        </div>
                        <div className="flex gap-3 ml-[28px] mt-9">
                            <Image src="/icons/home.png" alt="home-icon" width={24} height={24} />
                            <Link href="/home-page" className="text-[16px]  ">
                                Home
                            </Link>
                        </div>
                        <div className="flex gap-3 ml-[28px] mt-5 ">
                            <Image src="/icons/blog.png" alt="blog-icon" width={24} height={24} />
                            <Link href="/our-blog" className="text-[16px]  ">
                                Our Blog
                            </Link>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Home;