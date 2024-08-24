import styled, { keyframes } from 'styled-components';

// eslint-disable-next-line react/prop-types
const Card = ({ writing, writer }) => {
    return (
        <div className="rounded-full overflow-hidden p-10 w-80 h-80 lg:w-96 lg:h-96 m-5 bg-black border-2 border-neon text-white flex flex-col justify-center items-center transition duration-300 ease-in-out hover:bg-neon hover:text-black group relative gap-5">
            <p className="text-[1rem] lg:text-xl text-center font-bold">
                &quot; {writing} &quot;
            </p>
            <p className="text-[0.7rem] lg:text-sm text-right italic font-bold text-neon group-hover:text-black">
                ~ {writer}
            </p>
        </div>
    );
};

const Testimonials = () => {
    const details = [
        {
            writing: 'This website is a game-changer! The 3D model tracking helped me realize how often I got distracted. Now, I\'m much more focused during study sessions.',
            writer: 'Sarah J., College Student',
        },
        {
            writing: 'The distraction detection feature is incredible! It’s like having a virtual study coach that keeps me on track and motivated.',
            writer: 'Mike T., High School Senior',
        },
        {
            writing: 'I never knew how much my posture and movements affected my concentration until I started using this site. The insights are invaluable.',
            writer: 'Emily R., University Student',
        },
        {
            writing: 'The 3D model technology is so advanced. It’s helped me identify my bad habits and improve my study techniques.',
            writer: 'Alex B., Graduate Student'
        },
        {
            writing: 'This website has transformed the way I study. I feel more productive and aware of when I start to drift off.',
            writer: 'Jessica M., Online Learner'
        },
        {
            writing: 'I used to get distracted so easily, but with this site, I’ve learned to maintain my focus. The results are amazing!',
            writer: 'David P., High School Junior'
        },
        {
            writing: 'The ability to track my movements and get real-time feedback has made studying more effective and less stressful.',
            writer: 'Rachel K., College Freshman'
        },
        {
            writing: 'This tool is a must-have for anyone serious about improving their study habits. The distraction alerts are a real eye-opener!',
            writer: 'Ben L., Medical Student'
        },
        {
            writing: 'Studying used to be a struggle, but now I can stay focused for longer periods, thanks to this incredible website.',
            writer: 'Megan S., University Senior'
        },
        {
            writing: 'I love how the site identifies when I’m distracted and helps me refocus. It’s like having a personal study assistant.',
            writer: 'Kevin G., Engineering Student'
        },
        {
            writing: 'This website is a breakthrough in study technology. It’s helped me recognize when I’m off track and get back to work quickly.',
            writer: 'Laura H., High School Student'
        },
        {
            writing: 'The 3D model feature is so intuitive. It’s helped me understand my study patterns and make the necessary adjustments to stay focused.',
            writer: 'Chris D., College Sophomore'
        }
    ];

    return (
        <>
            <div className="p-10 mt-20 lg:mt-36 md:px-20 relative lg:pb-14 flex items-center justify-between">
                <div className="absolute font-goldman font-bold left-0 right-0 lg:left-auto lg:right-auto mx-auto flex items-center justify-center">
                    <p className="text-stroke-2 brightness-[40%] text-[2.5rem] lg:text-7xl">
                        TESTIMONIALS
                    </p>
                    <div className="absolute text-white font-goldman text-[2rem] lg:text-5xl font-bold flex mx-auto left-0 right-0 items-center lg:items-start justify-center">
                        TESTIMONIALS
                    </div>
                </div>
            </div>

            <MarqueeWrapper>
                <Marquee>
                    <MarqueeGroup>
                        {details.concat(details).map((detail, index) => (
                            <Card
                                key={index}
                                writing={detail.writing}
                                writer={detail.writer}
                            />
                        ))}
                    </MarqueeGroup>
                    <MarqueeGroup>
                        {details.concat(details).map((detail, index) => (
                            <Card
                                key={index}
                                writing={detail.writing}
                                writer={detail.writer}
                            />
                        ))}
                    </MarqueeGroup>
                </Marquee>

                <Marquee reverse>
                    <MarqueeGroup2>
                        {details.concat(details).map((detail, index) => (
                            <Card
                                key={index}
                                writing={detail.writing}
                                writer={detail.writer}
                            />
                        ))}
                    </MarqueeGroup2>
                    <MarqueeGroup2>
                        {details.concat(details).map((detail, index) => (
                            <Card
                                key={index}
                                writing={detail.writing}
                                writer={detail.writer}
                            />
                        ))}
                    </MarqueeGroup2>
                </Marquee>
            </MarqueeWrapper>
        </>
    );
};

export default Testimonials;

const MarqueeWrapper = styled.div`
    overflow: hidden;
`;

const Marquee = styled.div`
    display: flex;
    overflow: hidden;
    position: relative;
    width: 100%;
`;

const scrollX = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const reverseScrollX = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const MarqueeGroup = styled.div`
    flex-shrink: 0;
    display: flex;
    animation: ${scrollX} 235s linear infinite;
    animation-play-state: running;
    will-change: transform;
    min-width: 100%;
`;

const MarqueeGroup2 = styled.div`
    flex-shrink: 0;
    display: flex;
    animation: ${reverseScrollX} 235s linear infinite;
    animation-play-state: running;
    will-change: transform;
    min-width: 100%;
`;