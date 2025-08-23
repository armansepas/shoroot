import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProfilePage() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [fullName, setFullName] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await User.me();
				setUser(userData);
				setFullName(userData.full_name || "");
			} catch (e) {
				setError("You must be logged in to view this page.");
				navigate(createPageUrl("Dashboard"));
			}
			setLoading(false);
		};
		fetchUser();
	}, []);

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			await User.updateMyUserData({ full_name: fullName });
			alert("Profile updated successfully!");
		} catch (error) {
			console.error("Failed to update profile:", error);
			alert("An error occurred while updating your profile.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center text-red-400">
				{error}
			</div>
		);
	}

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white">My Profile</h1>
				<p className="text-gray-400">
					Manage your personal information.
				</p>
			</div>

			<Card className="bg-gray-800/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-3">
						<UserCircle className="w-6 h-6 text-yellow-400" />
						Profile Details
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSave} className="space-y-6">
						<div className="space-y-2">
							<Label className="text-gray-300">
								Email Address
							</Label>
							<Input
								value={user?.email || ""}
								disabled
								className="bg-gray-700/50 border-gray-600 text-gray-400"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="fullName"
								className="text-gray-300"
							>
								Display Name
							</Label>
							<Input
								id="fullName"
								value={fullName}
								onChange={(e) =>
									setFullName(e.target.value)
								}
								className="bg-gray-700 border-gray-600 text-white"
							/>
						</div>
						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={saving}
								className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
							>
								<Save className="w-4 h-4 mr-2" />
								{saving ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
