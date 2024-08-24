import bgVideo from '../assets/bgVideo.mp4';
import { useEffect, useRef } from "react";
import Footer from '../components/Footer';

const video = [bgVideo];

// eslint-disable-next-line react/prop-types
const Card = ({ title, description }) => {
  return (
    <div className="rounded-full overflow-hidden p-10 w-80 h-80 lg:w-[24.8rem] lg:h-[24.8rem] text-center bg-black border-2 border-neon text-white flex flex-wrap items-center justify-between transition duration-300 ease-in-out hover:bg-neon hover:text-black">
      <p className="font-extrabold text-2xl lg:text-3xl">{title}</p>
      <p className="font-bold lg:font-normal text-[0.9rem] lg:text-[1.2rem]">{description}</p>
    </div>
  );
};

const Features = () => {

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
      videoRef.current.style.willChange = 'transform';
    }
  }, []);


  const details = [
    {
      title: 'Easy Access for Everyone',
      description: 'Our platform is designed to be intuitive, ensuring that even those unfamiliar with AI technology can effortlessly use it.'
    },
    {
      title: 'Boost Your Productivity',
      description: 'Maximize your efficiency with our tools that streamline tasks, helping you achieve more in less time.'
    },
    {
      title: 'Your Study Companion',
      description: 'Enhance your learning experience with our AI-driven study aid, providing support for better understanding and retention.'
    },
    {
      title: 'Personalized Learning Experience',
      description: 'Tailor your education journey with our AI, which adapts to your unique learning style and pace.'
    },
    {
      title: 'Real-Time Monitoring',
      description: 'Stay on top of your progress with real-time tracking, enabling you to make immediate adjustments and improvements.'
    },
    {
      title: 'Multi-Language Support',
      description: 'Communicate and learn in your preferred language with our improved multi-language input feature.'
    },
    {
      title: 'Raising Awareness About GPT',
      description: 'Educate yourself and others about the potential of GPT technology and its impact on various fields.'
    },
    {
      title: 'Assistive Technology for Disabled Individuals',
      description: 'Empower disabled individuals with AI tools that provide accessible and customized support for various needs.'
    },
    {
      title: 'Seamless Integration with Your Workflow',
      description: 'Effortlessly incorporate our AI tools into your existing processes, enhancing your workflow without disruption.'
    },
  ]

  return (
    <div className='relative w-full min-h-screen overflow-hidden bg-fixed bg-center bg-cover'>

      <video
        ref={videoRef}
        className='absolute top-0 left-0 w-full h-full object-cover -z-10 transition duration-150 ease-in-out brightness-[50%] lg:brightness-[30%]'
        src={video}
        autoPlay
        loop
        muted
      />

      <div className='mt-28 md:mt-28 lg:mb-0 px-6 w-full md:min-h-screen'>
        <div className="p-10 md:px-6 relative lg:pb-14 flex items-center justify-between">
          <div className="absolute font-goldman font-bold left-0 right-0 lg:left-auto lg:right-auto mx-auto flex items-center justify-center">
            <p className="text-stroke-2 brightness-[40%] text-[3.5rem] lg:text-7xl">
              FEATURES
            </p>
            <div className="absolute text-white font-goldman text-4xl lg:text-5xl font-bold flex mx-auto left-0 right-0 items-center lg:items-start justify-center">
              FEATURES
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 w-full items-center justify-center p-10 lg:px-0 gap-10">
          {details.map((detail, index) => (
            <Card
              key={index}
              title={detail.title}
              description={detail.description}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
};

export default Features