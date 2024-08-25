import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";

const PreviousSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchSession = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            const userId = user.uid;
            const res = await axios.get(`http://127.0.0.1:5000/session?userId=${userId}`);
            setSessions(res.data);
        };
        fetchSession();
    }, []);

    useEffect(() => {
        const calculateStreak = () => {
            if (sessions.length === 0) return 0;

            const sortedSessions = [...sessions].sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

            let currentStreak = 1;
            for (let i = 1; i < sortedSessions.length; i++) {
                const prevDate = dayjs(sortedSessions[i - 1].date);
                const currentDate = dayjs(sortedSessions[i].date);
                if (prevDate.diff(currentDate, 'day') === 1) {
                    currentStreak++;
                } else {
                    break;
                }
            }
            setStreak(currentStreak);
        };

        calculateStreak();
    }, [sessions]);

    const addFiveHours = (date, time) => {
        return dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm")
            .add(5, "hour")
            .add(30, "minutes")
            .format("HH:mm:ss");
    };

    const filteredSessions = sessions.filter(session =>
        session.date.includes(searchTerm)
    );

    return (
        <div className="mt-8 w-[90%] left-0 right-0 mx-auto flex flex-col justify-center gap-5">
            <div className="bg-navbar-bg backdrop-blur-lg border-2 border-neon flex flex-col lg:flex-row items-center justify-between rounded-md py-2 px-5 text-black font-extrabold tracking-wider gap-3 lg:gap-0">
                <div className="flex flex-col items-start justify-between">
                    <div>Total Study Sessions : {sessions.length}</div>
                    <div>Total Time Studied: {" "}   
                        {sessions.reduce((acc, session) => {
                            const [hours, minutes] = session.totalTime.split(':');
                            return acc + parseInt(hours) * 60 + parseInt(minutes);
                        }, 0)} minutes
                    </div>
                    <div>Streak : {streak} 🔥</div>
                </div>
                <div className="relative flex items-center border-2 rounded-full border-neon">
                    <input
                        type="text"
                        placeholder="Search by Date"
                        className="bg-black rounded-full py-2 lg:px-10 pl-10 text-sm pr-0 lg:pl-12 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="absolute left-3 size-5 text-white" />
                </div>
            </div>
            <div className="bg-navbar-bg backdrop-blur-lg border-2 border-neon rounded-md py-2 px-5 text-black font-bold tracking-wider">
                <div className="overflow-x-auto lg:overflow-x-hidden">
                    <table className="w-full">
                        <thead className="font-extrabold border-b-2 border-black">
                            <tr>
                                <th className="py-2 px-4 lg:px-0 text-center align-middle whitespace-nowrap">Date</th>
                                <th className="py-2 px-4 lg:px-0 text-center align-middle whitespace-nowrap">Start Time</th>
                                <th className="py-2 px-4 lg:px-0 text-center align-middle whitespace-nowrap">End Time</th>
                                <th className="py-2 px-4 lg:px-0 text-center align-middle whitespace-nowrap">Total Time</th>
                            </tr>
                        </thead>
                        <tbody className="font-normal">
                            {filteredSessions.map((session, index) => (
                                <tr key={index}>
                                    <td className="py-2 text-center align-middle whitespace-nowrap">{session.date}</td>
                                    <td className="py-2 text-center align-middle whitespace-nowrap">{addFiveHours(session.date, session.startTime)}</td>
                                    <td className="py-2 text-center align-middle whitespace-nowrap">{addFiveHours(session.date, session.endTime)}</td>
                                    <td className="py-2 text-center align-middle whitespace-nowrap">{session.totalTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PreviousSessions;
