import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

function ProtectedRoute({ element }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" />;
    }

    return element;
}

export default ProtectedRoute;