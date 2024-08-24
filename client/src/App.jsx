import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './screens/Home';
import Navbar from './components/Navbar';
import Features from './screens/Features';
import Render3D from './screens/Render3D';
import StudySession from './screens/StudySession';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from '../auth/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path='/' element={<Navbar />}>
                <Route index element={<Home />} />
                <Route path='features' element={<Features />} />
                <Route path='study' element={<ProtectedRoute element={<StudySession />} />} /> 
            </Route>
            <Route path='study/session' element={<Render3D />} />
        </>
    )
);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </AuthProvider>
    );
}

export default App;