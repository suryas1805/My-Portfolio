import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

function AppRoutes() {
	const { user, loading } = useAuth();

	if (loading) return

	return (
		<Routes>
			{/* Public route */}
			<Route path="/" element={<Home />} />

			{/* Login route */}
			<Route path="/login" element={user ? <Navigate to="/admin" /> : <Login />} />

			{/* Admin route */}
			<Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/login" />} />

			{/* Catch-all */}
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</AuthProvider>
	);
}
