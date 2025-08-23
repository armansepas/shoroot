import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, AlertCircle } from "lucide-react";

export default function LoginPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await User.login(formData.email, formData.password);
			navigate("/dashboard");
		} catch (err) {
			setError(err.response?.data?.error || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="flex items-center space-x-2">
							<Trophy className="h-8 w-8 text-yellow-500" />
							<span className="text-2xl font-bold">
								BetApp
							</span>
						</div>
					</div>
					<CardTitle className="text-2xl">Welcome Back</CardTitle>
					<CardDescription>
						Sign in to your account to continue betting
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
								<AlertCircle className="h-4 w-4" />
								<span className="text-sm">{error}</span>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="Enter your email"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Enter your password"
								value={formData.password}
								onChange={handleChange}
								required
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? "Signing in..." : "Sign In"}
						</Button>

						<div className="text-center text-sm text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="text-blue-600 hover:underline"
							>
								Sign up here
							</Link>
						</div>

						<div className="text-center text-xs text-gray-500 mt-4">
							<p>Demo Admin Account:</p>
							<p>Email: admin@betting.com</p>
							<p>Password: admin123</p>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
