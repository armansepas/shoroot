import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateBetPage from "./pages/CreateBetPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import { User } from "./entities/User";

// Protected Route component
function ProtectedRoute({ children, adminOnly = false }) {
	const [user, setUser] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const checkAuth = async () => {
			try {
				const userData = await User.me();
				setUser(userData);
			} catch (error) {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		checkAuth();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (adminOnly && user.role !== "admin") {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
}

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					{/* Public routes */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					{/* Protected routes */}
					<Route
						path="/dashboard"
						element={
							<Layout>
								<DashboardPage />
							</Layout>
						}
					/>

					<Route
						path="/createbet"
						element={
							<ProtectedRoute adminOnly={true}>
								<Layout>
									<CreateBetPage />
								</Layout>
							</ProtectedRoute>
						}
					/>

					<Route
						path="/manageusers"
						element={
							<ProtectedRoute adminOnly={true}>
								<Layout>
									<ManageUsersPage />
								</Layout>
							</ProtectedRoute>
						}
					/>

					{/* Redirect root to dashboard */}
					<Route
						path="/"
						element={<Navigate to="/dashboard" replace />}
					/>

					{/* Catch all route */}
					<Route
						path="*"
						element={<Navigate to="/dashboard" replace />}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
