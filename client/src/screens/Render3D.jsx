import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/solid";
import bgVideo from "../assets/bgVideo.mp4";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";

const Render3D = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isDistracted, setIsDistracted] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const checkDistractionRepeatedly = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/detect_distraction"
      );
      console.log(response.data);
      setIsDistracted(response.data.distracted);
      setTimeout(checkDistractionRepeatedly, 1000); // Adjust interval as needed
    } catch (error) {
      console.error("Error detecting distraction:", error);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
      videoRef.current.style.willChange = "transform";
    }
    setSessionStartTime(new Date());

    checkDistractionRepeatedly();

  }, []); 

  const handleEndSession = async () => {
    const endTime = new Date();
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const sessionData = {
        startTime: sessionStartTime.toISOString().split("T")[1].split(".")[0],
        endTime: endTime.toISOString().split("T")[1].split(".")[0],
        date: sessionStartTime.toISOString().split("T")[0],
        userId: user.uid,
      };
      try {
        const res = await axios.post(
          "http://127.0.0.1:5000/session",
          sessionData
        );
        if (res.status === 201) {
          console.log("Session created successfully");
        }
        navigate("/");
      } catch (error) {
        console.log("Error creating session:", error);
      }
    } else {
      console.log("User not logged in");
    }
  };

  return (
    <div className="relative h-screen w-full">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover -z-10 transition duration-150 ease-in-out brightness-[50%] lg:brightness-[30%]"
        src={bgVideo}
        autoPlay
        loop
        muted
      />
      {isMaximized ? (
        <MagnifyingGlassMinusIcon
          className="size-12 absolute bottom-2 right-2 z-50 p-2 bg-black backdrop-blur-lg rounded-full cursor-pointer text-neon border-2 border-neon"
          onClick={toggleMaximize}
        />
      ) : (
        <MagnifyingGlassPlusIcon
          className="size-12 absolute bottom-2 right-2 z-50 p-2 bg-black backdrop-blur-lg rounded-full cursor-pointer text-neon border-2 border-neon"
          onClick={toggleMaximize}
        />
      )}

      {!isMaximized && <Navbar />}

      <div
        style={{
          height: "100vh",
          padding: isMaximized ? "0px" : "100px",
          width: "100%",
          transition: "0.15s ease-in-out",
        }}
      >
        <div className="flex justify-between absolute right-2 mt-2 mb-12">
          <button
            className="hidden hover:bg-red-500 hover:text-white bg-white lg:flex items-center justify-between py-2 px-5 gap-4 rounded-full transition duration-300 ease-in-out hover:scale-105"
            onClick={handleEndSession}
          >
            End Session
          </button>
        </div>
        <iframe
          src="../../3D/StudyPlayground.html"
          title="HTML Content"
          height="100%"
          width="100%"
          style={{ border: "none", padding: "0px" }}
        />
      </div>
    </div>
  );
};

export default Render3D;
