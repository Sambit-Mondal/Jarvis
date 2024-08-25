import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import bgVideo from '../assets/bgVideo.mp4';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { NavLink } from 'react-router-dom';
import PreviousSessions from '../components/PreviousSessions';
import Footer from '../components/Footer';

const StudySession = () => {
  const videoRef = useRef(null);
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
      videoRef.current.style.willChange = 'transform';
    }

    if (user) {
      const fullName = user.displayName;
      const firstName = fullName ? fullName.split(' ')[0] : '';
      setFirstName(firstName);
    }
  }, [user]);

  return (
    <div className='relative min-h-screen overflow-hidden bg-fixed bg-center bg-cover '>
      <video
        ref={videoRef}
        className='absolute top-0 left-0 w-full h-full object-cover -z-10 transition duration-150 ease-in-out brightness-[50%] lg:brightness-[30%]'
        src={bgVideo}
        autoPlay
        loop
        muted
      />
      <div className='mt-32 md:mt-36 mb-20 lg:mb-0 w-full'>
        <div className='flex items-center justify-between w-full h-auto px-16'>
          <div className='text-white text-3xl'>
            <p>Welcome, <span className='text-neon text-6xl'>{firstName}</span></p>
          </div>
          <NavLink to='/study/session?maximize=true'>
            <button className='hidden bg-white lg:flex items-center justify-between py-2 px-5 gap-4 rounded-full transition duration-300 ease-in-out hover:scale-105'>
              <PlusCircleIcon className='size-7' />
              Create a New Study Session
            </button>
          </NavLink>
        </div>
        <div className='mt-5 px-2 flex flex-col items-center justify-center'>
          <NavLink to='/study/session?maximize=true'>
            <button className='bg-white lg:hidden flex items-center justify-between py-2 px-5 mx-2 gap-4 rounded-full transition duration-300 ease-in-out hover:scale-105'>
              <PlusCircleIcon className='size-7' />
              Create a New Study Session
            </button>
          </NavLink>
          <hr className='w-72 bg-white my-10 lg:hidden' />
          <div className='w-full flex items-center justify-center text-center text-xl text-white lg:mt-14 lg:mb-6'>
            <div className='flex items-center w-5/6 text-neon'>
              <div className='flex-grow border-t border-white hidden lg:block'></div>
              <span className='mx-4'>Your previous study sessions</span>
              <div className='flex-grow border-t border-white hidden lg:block'></div>
            </div>
          </div>
          <hr className='w-44 bg-neon border-0 h-[1px] mt-4 lg:hidden' />
        </div>
      </div>
      <PreviousSessions />
      <Footer />
    </div>
  );
};

export default StudySession;