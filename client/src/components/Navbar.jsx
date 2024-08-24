import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo_Jarvis.png';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { auth, provider, signInWithPopup, signOut, db, doc, setDoc } from '../../firebase/Firebase';
import { onAuthStateChanged } from "firebase/auth";
import { toast } from 'react-toastify';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const openSidebar = () => {
        setSidebarOpen(true);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const ref = useRef();

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (sidebarOpen && ref.current && !ref.current.contains(e.target)) {
                closeSidebar();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [sidebarOpen]);

    const location = useLocation();

    useEffect(() => {
        closeSidebar();
    }, [location]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    name: currentUser.displayName,
                    email: currentUser.email,
                    uid: currentUser.uid,
                    photoURL: currentUser.photoURL,
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const [userLogout, showUserLogout] = useState(false);

    const toggleUserLogout = () => {
        showUserLogout((prev) => !prev);
    };

    const handleLogin = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const loggedInUser = result.user;
                const userDocRef = doc(db, "users", loggedInUser.uid);

                await setDoc(userDocRef, {
                    name: loggedInUser.displayName,
                    email: loggedInUser.email,
                    uid: loggedInUser.uid,
                    photoURL: loggedInUser.photoURL
                }, { merge: true });

                setUser({
                    name: loggedInUser.displayName,
                    email: loggedInUser.email,
                    uid: loggedInUser.uid,
                    photoURL: loggedInUser.photoURL
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleStudySessionClick = () => {
        if (!user) {
            toast.error("Please login to continue!");
        }
    };

    return (
        <>
            <nav className='fixed top-4 w-[95%] mx-auto left-0 right-0 p-3 px-5 bg-navbar-bg backdrop-blur-md rounded-md flex items-center justify-between z-10 border-2 lg:border-4 border-neon'>
                <div className='w-full flex items-center justify-between'>
                    <div className='text-black text-xl font-bold cursor-pointer flex items-center justify-center gap-2 font-valorax'>
                        <div className='overflow-hidden flex items-center justify-center'>
                            <img src={Logo} alt="Chief" className='rounded-full size-10 flex items-stretch justify-stretch border-2 border-black bg-white p-[0.1rem]' />
                        </div>
                        <div>Jarvis<span className='text-neon'>AI.</span></div>
                    </div>

                    <ul className={`hidden md:flex items-center justify-center gap-5 text-[0.92rem] font-bold uppercase ${user ? 'translate-x-20' : 'translate-x-0'}`}>
                        <li className='cursor-pointer'>
                            <NavLink to="/" className={({ isActive }) => isActive ? "text-neon" : "transition duration-150 ease-in-out text-white hover:text-neon"}>
                                Home
                            </NavLink>
                        </li>
                        <li className='cursor-pointer'>
                            <NavLink to="/features" className={({ isActive }) => isActive ? "text-neon" : "transition duration-150 ease-in-out text-white hover:text-neon"}>
                                Features
                            </NavLink>
                        </li>
                        <li className='cursor-pointer'>
                            <NavLink to="/study" className={({ isActive }) => isActive ? "text-neon" : "transition duration-150 ease-in-out text-white hover:text-neon"} onClick={handleStudySessionClick}>
                                Study Session
                            </NavLink>
                        </li>
                    </ul>

                    {user ? (
                        <div className='flex items-center justify-center gap-3'>
                            <div className={`hidden md:flex items-center justify-center gap-3 bg-white border-2 border-neon py-1 px-5 rounded-sm text-[0.91rem] font-bold uppercase cursor-pointer transition duration-300 ease-in-out hover:scale-105 ${userLogout ? 'translate-x-0' : 'translate-x-24'}`} onClick={toggleUserLogout}>
                                <img 
                                    src={user.photoURL} 
                                    alt="Profile" 
                                    className='size-7 rounded-full' 
                                />
                                <p className='text-sm'>{user.name}</p>
                            </div>
                            <button className='hidden md:flex items-center justify-center text-red-600 font-bold py-1 px-5 rounded-sm hover:scale-110' onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button className='hidden md:block rounded-sm bg-white py-2 px-5 border-2 text-[0.91rem] font-bold border-neon uppercase transition duration-150 ease-in-out hover:scale-105' onClick={handleLogin}>
                            Login/Signup
                        </button>
                    )}
                </div>

                <Bars3Icon className='size-8 block md:hidden font-extrabold text-neon' onClick={openSidebar} />

            </nav>

            <div className={`fixed inset-0 bg-black z-30 transition-opacity duration-300 ${sidebarOpen ? 'opacity-60' : 'opacity-0 pointer-events-none'}`}></div>

            <div ref={ref} className={`md:hidden border-l-2 border-l-neon bg-navbar-bg backdrop-blur-md fixed top-0 bottom-0 right-0 w-[65%] p-4 pt-8 flex flex-col items-start justify-start transition-transform duration-300 ease-in-out z-40 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className='w-full flex items-center justify-start'>
                    <XMarkIcon className='size-8 font-extrasbold cursor-pointer mb-5 text-neon' onClick={closeSidebar} />
                </div>

                <ul className='flex flex-col gap-10 text-[0.91rem] font-bold uppercase mt-5 pl-6'>
                    <li className='cursor-pointer'>
                        <NavLink to="/" className={({ isActive }) => isActive ? "text-neon" : "transition duration-150 ease-in-out text-white hover:text-white"}>
                            Home
                        </NavLink>
                    </li>
                    <li className='cursor-pointer'>
                        <NavLink to="/features" className={({ isActive }) => isActive ? "text-neon" : "transition duration-150 ease-in-out text-white hover:text-[#cacaca]"}>
                            Features
                        </NavLink>
                    </li>
                    <li className='cursor-pointer'>
                        <NavLink to="/study" className={({ isActive }) => isActive ? "text-neon" : "transition duration-150 ease-in-out text-white hover:text-white"} onClick={handleStudySessionClick}>
                            Study Session
                        </NavLink>
                    </li>
                </ul>

                <hr className='w-full bg-neon h-[1px] border-0 my-10' />

                {user ? (
                    <div className='flex flex-col w-full gap-4'>
                        <div className='flex items-center justify-center w-full gap-3 bg-white border-2 border-neon py-2 px-5 rounded-sm text-[0.91rem] font-bold uppercase'>
                            <img 
                                src={user.photoURL} 
                                alt="Profile" 
                                className='size-7 rounded-full' 
                            />
                            <p className='text-sm'>{user.name}</p>
                        </div>
                        <button className='flex items-center justify-center text-red-600 text-[1.1rem] font-bold py-1 px-5 rounded-sm' onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <button className='rounded-sm bg-white p-2 px-5 w-full border-2 text-[0.91rem] font-bold border-neon uppercase' onClick={handleLogin}>
                        Login/Signup
                    </button>
                )}
            </div>

            <Outlet />
        </>
    );
}

export default Navbar;