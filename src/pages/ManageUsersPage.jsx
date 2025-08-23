import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Users,
	Crown,
	Trophy,
	Eye,
	TrendingUp,
	TrendingDown,
	RefreshCw,
	Info,
	Edit,
} from "lucide-react";

export default function ManageUsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);
	const [editingUser, setEditingUser] = useState(null);
	const [editForm, setEditForm] = useState({
		role: "",
		status: "",
		credits: 0,
	});

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			const [usersData, currentUserData] = await Promise.all([
				User.list(),
				User.me(),
			]);
			setUsers(usersData);
			setCurrentUser(currentUserData);
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (user) => {
		setEditingUser(user.id);
		setEditForm({
			role: user.role,
			status: user.status,
			credits: user.credits,
		});
	};

	const handleSaveEdit = async (userId) => {
		try {
			await User.update(userId, editForm);
			setEditingUser(null);
			await loadData(); // Refresh the data
		} catch (error) {
			console.error("Error updating user:", error);
			alert("Failed to update user");
		}
	};

	const handleCancelEdit = () => {
		setEditingUser(null);
		setEditForm({ role: "", status: "", credits: 0 });
	};

	const getRoleBadge = (role) => {
		switch (role) {
			case "admin":
				return (
					<Badge className="bg-purple-500 text-white">
						<Crown className="h-3 w-3 mr-1" />
						Admin
					</Badge>
				);
			case "user":
				return (
					<Badge
						variant="outline"
						className="border-blue-500 text-blue-600"
					>
						<Trophy className="h-3 w-3 mr-1" />
						User
					</Badge>
				);
			case "viewer":
				return (
					<Badge
						variant="outline"
						className="border-gray-500 text-gray-600"
					>
						<Eye className="h-3 w-3 mr-1" />
						Viewer
					</Badge>
				);
			default:
				return <Badge variant="outline">{role || "Unknown"}</Badge>;
		}
	};

	const getStatusBadge = (status) => {
		switch (status) {
			case "active":
				return (
					<Badge className="bg-green-500 text-white">
						<TrendingUp className="h-3 w-3 mr-1" />
						Active
					</Badge>
				);
			case "inactive":
				return (
					<Badge variant="destructive">
						<TrendingDown className="h-3 w-3 mr-1" />
						Inactive
					</Badge>
				);
			default:
				return (
					<Badge variant="outline">{status || "Unknown"}</Badge>
				);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p>Loading users...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Manage Users
					</h1>
					<p className="text-gray-600 mt-1">
						Manage user roles, status, and credits
					</p>
				</div>
				<Button onClick={loadData} variant="outline">
					<RefreshCw className="h-4 w-4 mr-2" />
					Refresh
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5 text-blue-500" />
						User Management
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Credits</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user.id}>
										<TableCell className="font-medium">
											{user.name}
											{user.id ===
												currentUser?.id && (
												<Badge
													variant="outline"
													className="ml-2 text-xs"
												>
													You
												</Badge>
											)}
										</TableCell>
										<TableCell>
											{user.email}
										</TableCell>
										<TableCell>
											{editingUser ===
											user.id ? (
												<select
													value={
														editForm.role
													}
													onChange={(e) =>
														setEditForm(
															{
																...editForm,
																role: e
																	.target
																	.value,
															}
														)
													}
													className="border rounded px-2 py-1"
												>
													<option value="user">
														User
													</option>
													<option value="admin">
														Admin
													</option>
													<option value="viewer">
														Viewer
													</option>
												</select>
											) : (
												getRoleBadge(
													user.role
												)
											)}
										</TableCell>
										<TableCell>
											{editingUser ===
											user.id ? (
												<select
													value={
														editForm.status
													}
													onChange={(e) =>
														setEditForm(
															{
																...editForm,
																status: e
																	.target
																	.value,
															}
														)
													}
													className="border rounded px-2 py-1"
												>
													<option value="active">
														Active
													</option>
													<option value="inactive">
														Inactive
													</option>
												</select>
											) : (
												getStatusBadge(
													user.status
												)
											)}
										</TableCell>
										<TableCell>
											{editingUser ===
											user.id ? (
												<Input
													type="number"
													value={
														editForm.credits
													}
													onChange={(e) =>
														setEditForm(
															{
																...editForm,
																credits: parseInt(
																	e
																		.target
																		.value
																),
															}
														)
													}
													className="w-20"
												/>
											) : (
												user.credits
											)}
										</TableCell>
										<TableCell>
											{new Date(
												user.created_at
											).toLocaleDateString()}
										</TableCell>
										<TableCell>
											{editingUser ===
											user.id ? (
												<div className="flex space-x-2">
													<Button
														size="sm"
														onClick={() =>
															handleSaveEdit(
																user.id
															)
														}
													>
														Save
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={
															handleCancelEdit
														}
													>
														Cancel
													</Button>
												</div>
											) : (
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														handleEdit(
															user
														)
													}
													disabled={
														user.id ===
														currentUser?.id
													}
												>
													<Edit className="h-3 w-3 mr-1" />
													Edit
												</Button>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{users.length === 0 && (
						<div className="text-center py-12">
							<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No users found
							</h3>
							<p className="text-gray-600">
								No users have been registered yet.
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Info className="h-5 w-5 text-blue-500" />
						User Statistics
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-500">
								{users.length}
							</div>
							<div className="text-sm text-gray-600">
								Total Users
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-500">
								{
									users.filter(
										(u) => u.role === "admin"
									).length
								}
							</div>
							<div className="text-sm text-gray-600">
								Admins
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-500">
								{
									users.filter(
										(u) => u.status === "active"
									).length
								}
							</div>
							<div className="text-sm text-gray-600">
								Active Users
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-yellow-500">
								{users.reduce(
									(sum, u) => sum + (u.credits || 0),
									0
								)}
							</div>
							<div className="text-sm text-gray-600">
								Total Credits
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
