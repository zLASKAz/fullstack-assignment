'use client';

import { Castoro } from 'next/font/google';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUserName } from '../store/userSlice';
import { AppDispatch } from '../store/store';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

const castoro = Castoro({
    variable: '--font-castoro',
    subsets: ['latin'],
    weight: ['400'],
    style: ['normal', 'italic'],
});

const SignInPage = () => {
    const isLargeScreen = useMediaQuery({ query: '(min-width: 768px)' });

    const [name, setName] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleClick = () => {
        if (name) {
            dispatch(setUserName(name));
        }
        router.push('/home-page');
    };

    return (
        <div className={`${castoro.variable} flex flex-col md:flex-row h-screen bg-[#253830]`}>
            <div className="order-2 md:order-1 md:w-[55%] md:flex-none flex-1 flex justify-center items-center text-2xl">
                <div className="flex flex-col gap-5 md:w-96 w-4/5">
                    <div className="text-white">Sign in</div>
                    <input
                        type="text"
                        placeholder="Username"
                        className="py-2.5 px-3.5 rounded-lg h-11 text-s text-sm"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button
                        className="py-2.5 px-4 rounded-lg text-sm h-10 bg-[#49A569]"
                        onClick={handleClick}
                    >
                        Sign in
                    </button>
                </div>
            </div>
            <div className="order-1 md:order-2 md:w-[45%] md:flex-none flex-1 flex justify-center items-center text-2xl bg-[#2B5F44] md:rounded-l-[36px] rounded-b-[36px]">
                <div className="flex-none text-center text-white">
                    <Image
                        src="/images/notebook-with-pencil.png"
                        alt="notebook-with-pencil"
                        width={171.46}
                        height={131.62}
                        className="md:w-[300px] md:h-[230px]"
                    />
                    <div style={{ fontFamily: 'Castoro, serif', fontWeight: 400, fontStyle: 'italic', fontSize: "28px" }} >
                        a Board
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SignInPage;
