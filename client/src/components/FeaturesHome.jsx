import { ArrowRightCircleIcon } from "@heroicons/react/24/solid"
import { NavLink } from "react-router-dom"

// eslint-disable-next-line react/prop-types
const Card = ({ title, description }) => {
  return (
    <div className="rounded-full overflow-hidden p-10 w-80 h-80 lg:w-96 lg:h-96 text-center bg-black border-2 border-neon text-white flex flex-wrap items-center justify-between transition duration-300 ease-in-out hover:bg-neon hover:text-black">
      <p className="font-extrabold text-2xl lg:text-4xl">{title}</p>
      <p className="font-normal text-[1rem] lg:text-[1.2rem]">{description}</p>
    </div>
  )
}

const FeaturesHome = () => {

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
  ]

  return (
    <>
      <div className="p-10 md:px-20 relative lg:pb-14 flex items-center justify-between">
        <div className="absolute font-goldman font-bold left-0 right-0 lg:left-auto lg:right-auto mx-auto flex items-center justify-center">
          <p className="text-stroke-2 brightness-[40%] text-6xl lg:text-7xl">WHY US?</p>
          <div className="absolute text-white font-goldman text-4xl lg:text-5xl font-bold flex mx-auto left-0 right-0 items-center lg:items-start justify-center">
            WHY US?
          </div>
        </div>
        <NavLink to='/features' className="cursor-pointer absolute right-36 rounded-full px-5 py-2 bg-white border-2 border-neon hidden lg:flex items-center gap-4 justify-between transition duration-150 ease-in-out hover:scale-105">
          All Features
          <ArrowRightCircleIcon className="size-8" />
        </NavLink>
      </div>

      <div className="flex flex-col lg:flex-row w-full items-center justify-between p-10 md:px-10 gap-10 lg:gap-0">
        {details.map((detail, index) => (
          <Card
            key={index}
            title={detail.title}
            description={detail.description}
          />
        ))}
      </div>
    </>
  );
};

export default FeaturesHome;