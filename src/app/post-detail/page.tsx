"use client"
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from '../components/ButtonDefault';
import Link from 'next/link';
import ButtonOutline from '../components/ButtonOutline';
import Image from 'next/image';
import axios from 'axios';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useRouter } from 'next/navigation';
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
    const userName = useSelector((state: RootState) => state.user.userName);
    const router = useRouter()
    const searchParams = useSearchParams();
    const postDetailID = searchParams.get('postDetailID');
    const DataId: Kratu | null = postDetailID ? JSON.parse(postDetailID) : null;
    const [kratuData, setKratuData] = useState<Kratu>()
    const [loading, setLoading] = useState(true)
    const [textComment, setTextComment] = useState<string>('')
    const BASE_URL = process.env.BASE_URL

    const isLargeScreen = useMediaQuery({ query: '(min-width: 768px)' });
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

    useEffect(() => {
        const callKratuDataByID = async () => {
            try {
                const response = await axios.get<Kratu>(`${BASE_URL}/kratu/${DataId}`);
                setKratuData(response.data);
                setLoading(false);
            } catch (err) {
                console.log(err)
                setLoading(false);
            }
        };
        callKratuDataByID()
    }, [])
    if (loading) {
        return <Loading />;
    }

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
    const messageFiltered = kratuData?.comments.sort((a, b) => Number(b.timeStampComment) - Number(a.timeStampComment))
    const callKratuDataByIDAfterPost = async () => {
        try {
            const response = await axios.get<Kratu>(`${BASE_URL}/kratu/${DataId}`);
            setKratuData(response.data);
            setLoading(false);
        } catch (err) {
            console.log(err)
            setLoading(false);
        }
    };
    const handlePostComment = async () => {
        const currentTimestamp = dayjs().valueOf().toString();

        let comment = {
            "nameComment": userName,
            "image": userName,
            "timeStampComment": currentTimestamp,
            "textComment": textComment
        }
        try {
            setLoading(true);
            console.log(comment)
            const response = await axios.post(`${BASE_URL}/kratu/${DataId}/comments`, comment);
            console.log('Post request successful:', response.data);
            setLoading(false);
            callKratuDataByIDAfterPost()

        } catch (error) {
            console.error('Error making POST request:', error);
        }
    }
    return (
        <div className="relative min-h-screen">
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
            <div className='flex mb-4' >

                <div className=' flex-col items-start p-8 gap-6 min-h-screen w-[280px] bg-[#BBC2C0] hidden md:flex'>
                    <div className="flex gap-3">
                        <Image src="/icons/homeIcon.png" alt='home-icon' width={24} height={24} />
                        <Link href="/home-page" className='text-[16px] text-[#243831]'>Home</Link>
                    </div>
                    <div className="flex gap-3">
                        <Image src="/icons/blogIcon.png" alt='blog-icon' width={24} height={24} />
                        <Link href="/our-blog" className='text-[16px] text-[#243831]'>Our Blog</Link>
                    </div>
                </div>
                <div className='flex p-4 md:w-3/4 bg-white w-screen '>
                    <div className='md:ml-24 w-[800px]'>
                        <div className='p-4 flex'>
                            <Link href="/home-page" className="bg-[#D8E9E4] rounded-full p-2.5 flex">
                                <Image src="/icons/backIcon.png" alt="back-icon" width={24} height={24} />
                            </Link>
                        </div>
                        {kratuData && (
                            <div className='flex flex-col gap-5 bg-[white] p-4 '>
                                <div className='flex gap-2.5 items-center'>
                                    <div className="bg-[#D8E9E4] rounded-full p-2.5 flex">

                                        <Image src="/icons/avatarIcon.png" alt="avatarIcon" width={20} height={20} />
                                    </div>
                                    <div className='font-medium text-sm text-[#191919]'>{kratuData.name}</div>
                                    <div className=" text-gray-300 text-[12px] font-normal">{handleDate(kratuData.timeStamp)}</div>
                                </div>
                                <div className='py-1 px-2 rounded-2xl w-fit text-xs' style={{ backgroundColor: '#F3F3F3', color: "#4A4A4A" }}>History</div>
                                <div className='text-[#101828] font-semibold text-[28px]'>{kratuData.title}</div>
                                <div className='w-auto text-xs text-[#191919] font-normal'>{kratuData.content}</div>
                                <div className='flex gap-2'>
                                    <Image src="/icons/commentIcon.png" alt="back-icon" width={16} height={16} />

                                    <div className='text-xs flex items-center text-[#939494]'>{kratuData.comments.length} Comments</div>
                                </div>
                                {userName !== "" && isLargeScreen ? (<>
                                    <textarea onChange={(e) => setTextComment(e.target.value)} value={textComment} name="comment" id="comment" placeholder="What's on your mind..." className='rounded-lg w-auto h-24 border border-[#49A569] pt-3.5 px-2.5 text-base' ></textarea>
                                    <div className='flex justify-end gap-4'>
                                        <ButtonOutline className='w-24' onClick={() => setTextComment("")}>Cancel</ButtonOutline>
                                        <Button className='w-24 ' onClick={handlePostComment}>Post</Button>
                                    </div>
                                </>
                                ) : (
                                    <ButtonOutline className='w-fit flex items-center py-2.5 px-4 text-sm h-10'>Add Comments</ButtonOutline>
                                )}
                                {messageFiltered?.map((data, index) => (
                                    <div key={index} className='flex flex-col gap-2.5 md:gap-5 bg-white md:p-4 rounded-lg'>
                                        <div className='flex gap-2 items-center'>
                                            <div className="bg-[#D8E9E4] rounded-full p-2.5 flex">

                                                <Image src="/icons/avatarIcon.png" alt="avatarIcon" width={20} height={20} />
                                            </div>
                                            <div>{data.nameComment}</div>
                                            <div className=" text-gray-300 text-[12px] font-normal">{handleDate(data.timeStampComment)}</div>
                                        </div>
                                        <div className='w-auto'>{data.textComment}</div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
