import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import MemberPage from './pages/MemberPage';
import LoansPage from './pages/LoansPage';
import ReportsPage from './pages/ReportsPage';
import BackupPage from './pages/BackupPage';
import RestorePage from './pages/RestorePage';
const PrivateRoute = ({ element }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // Or a loading spinner
    return user ? element : <Navigate to="/" />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                {/* Private routes */}
                <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
                <Route path="/user" element={<PrivateRoute element={<UserPage />} />} />
                <Route path="/member" element={<PrivateRoute element={<MemberPage />} />} />
                <Route path="/loans" element={<PrivateRoute element={<LoansPage />} />} />
                <Route path="/reportgen" element={<PrivateRoute element={<ReportsPage />} />} />
                <Route path="/backup" element={<PrivateRoute element={<BackupPage />} />} />
                <Route path="/restore" element={<PrivateRoute element={<RestorePage />} />} />
            </Routes>
        </Router>
    );
}

export default App;
