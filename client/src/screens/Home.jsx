import { useEffect, useRef } from 'react';
import Chief1 from '../assets/Chief1.png';
import { NavLink, useNavigate } from 'react-router-dom';
import bgVideo from '../assets/bgVideo.mp4';
import FeaturesHome from '../components/FeaturesHome';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';
import { useAuth } from '../../auth/useAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.7;
            videoRef.current.style.willChange = 'transform';
        }
    }, []);

    const handleGetStartedClick = () => {
        if (!user) {
            toast.error("Please login to continue!");
        } else {
            navigate('/study');
        }
    };

    return (
        <div className='relative w-full min-h-screen overflow-hidden bg-fixed bg-center bg-cover'>
            <video
                ref={videoRef}
                className='absolute top-0 left-0 w-full h-full object-cover -z-10 transition duration-150 ease-in-out brightness-[50%] lg:brightness-[30%]'
                src={bgVideo}
                autoPlay
                loop
                muted
            />

            <div className='mt-44 md:mt-12 mb-20 lg:mb-0 flex justify-between px-10 w-full md:h-screen'>
                <div className='flex flex-col items-start md:justify-center w-full md:w-1/2 md:px-10'>
                    <div className='flex flex-col items-start justify-start pb-7'>
                        <div className='text-white font-extrabold uppercase text-3xl md:text-4xl pb-4 md:pb-4 font-valorax'>
                            Jarvis<span className='text-neon'>AI.</span>
                        </div>
                        <div className='text-white font-medium text-xl lg:text-2xl mt-4 font-goldman tracking-wide'>
                            This project is basically an <span className='text-brown-theme font-bold'>&quot;AI-based Student Study Assistant &quot;</span>, which aims to revolutionize students&#x2019; study habits and their concentration by harnessing the power of <span className='text-neon font-bold'>artificial intelligence</span>.
                        </div>
                    </div>
                    <div className='flex items-center justify-between gap-3 lg:gap-10 font-bold md:text-[1.1rem] my-10'>
                        <button className='px-3 py-3 md:px-10 bg-white border-2 text-black border-neon rounded-sm transition duration-150 ease-in-out hover:scale-105' onClick={handleGetStartedClick}>
                            Get Started
                        </button>
                        <NavLink to='/features'>
                            <button className='px-3 py-3 md:px-10 bg-neon text-black border-2 border-black rounded-sm transition duration-150 ease-in-out hover:scale-105'>
                                Learn More
                            </button>
                        </NavLink>
                    </div>
                </div>
                <div className='hidden w-1/2 md:flex items-center justify-center relative p-28'>
                    <img src={Chief1} alt="Chief" className='size-full animate-float' />
                </div>
            </div>

            <FeaturesHome />
            <Testimonials />
            <Footer />
        </div>
    );
};

export default Home;