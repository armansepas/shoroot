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
import { Trophy, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters long");
			setLoading(false);
			return;
		}

		try {
			await User.register(
				formData.email,
				formData.password,
				formData.name
			);
			navigate("/dashboard");
		} catch (err) {
			setError(err.response?.data?.error || "Registration failed");
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
					<CardTitle className="text-2xl">
						Create Account
					</CardTitle>
					<CardDescription>
						Join the betting community today
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
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Enter your full name"
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>

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
								placeholder="Create a password (min 6 characters)"
								value={formData.password}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">
								Confirm Password
							</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="Confirm your password"
								value={formData.confirmPassword}
								onChange={handleChange}
								required
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading
								? "Creating account..."
								: "Create Account"}
						</Button>

						<div className="text-center text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-blue-600 hover:underline"
							>
								Sign in here
							</Link>
						</div>

						<div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
							<CheckCircle className="h-4 w-4" />
							<span>
								New users start with 1000 credits!
							</span>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
