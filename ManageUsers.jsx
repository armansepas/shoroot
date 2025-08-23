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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ManageUsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			const [usersData, me] = await Promise.all([
				User.list("-created_date"),
				User.me(),
			]);
			setUsers(usersData);
			setCurrentUser(me);
		} catch (error) {
			console.error("Failed to load users:", error);
		}
		setLoading(false);
	};

	const handleResetCredit = async (userId) => {
		try {
			await User.update(userId, { credit: 0 });
			loadData();
		} catch (error) {
			console.error("Failed to reset credit:", error);
			alert("An error occurred while resetting credit.");
		}
	};

	const handleChangeRole = async (userId, newRole) => {
		try {
			await User.update(userId, { role: newRole });
			loadData();
		} catch (error) {
			console.error("Failed to change role:", error);
			alert("An error occurred while changing the user role.");
		}
	};

	const RoleBadge = ({ role }) => {
		const roleConfig = {
			admin: {
				icon: Crown,
				text: "Admin",
				className:
					"bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
			},
			user: {
				icon: Trophy,
				text: "Player",
				className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
			},
			viewer: {
				icon: Eye,
				text: "Viewer",
				className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
			},
		};
		const config = roleConfig[role] || roleConfig.viewer;
		const Icon = config.icon;
		return (
			<Badge
				variant="outline"
				className={`gap-1.5 ${config.className}`}
			>
				<Icon className="w-3.5 h-3.5" />
				{config.text}
			</Badge>
		);
	};

	const ChangeRoleDialog = ({ userToChange }) => {
		const [newRole, setNewRole] = useState(userToChange.role);
		return (
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="text-gray-400 hover:text-white flex-1"
					>
						<Edit className="w-4 h-4 mr-2" /> Change Role
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Change role for {userToChange.full_name}
						</AlertDialogTitle>
						<AlertDialogDescription>
							Select a new role for this user. Admins have
							full control over the platform.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<Select value={newRole} onValueChange={setNewRole}>
						<SelectTrigger>
							<SelectValue placeholder="Select a role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="admin">Admin</SelectItem>
							<SelectItem value="user">Player</SelectItem>
							<SelectItem value="viewer">Viewer</SelectItem>
						</SelectContent>
					</Select>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								handleChangeRole(
									userToChange.id,
									newRole
								)
							}
						>
							Save Role
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white">
					User Management
				</h1>
				<p className="text-gray-400">
					View and manage all users on the platform.
				</p>
			</div>

			<Alert className="mb-8 bg-blue-500/10 border-blue-500/20 text-blue-300">
				<Info className="h-4 w-4 !text-blue-300" />
				<AlertTitle>How to Add New Users</AlertTitle>
				<AlertDescription>
					To invite new users to the platform, please use the
					"Users" tab in your main application dashboard. This
					ensures a secure invitation process.
				</AlertDescription>
			</Alert>

			<Card className="bg-gray-800/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-3">
						<Users className="w-6 h-6 text-yellow-400" />
						All Users
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="border-gray-700 hover:bg-transparent">
									<TableHead className="text-white">
										User
									</TableHead>
									<TableHead className="text-white">
										Role
									</TableHead>
									<TableHead className="text-white text-right">
										Credit (Toman)
									</TableHead>
									<TableHead className="text-white text-center">
										W/L Record
									</TableHead>
									<TableHead className="text-white text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow
										key={user.id}
										className="border-gray-700"
									>
										<TableCell>
											<div className="font-medium text-white">
												{user.full_name}
											</div>
											<div className="text-sm text-gray-400">
												{user.email}
											</div>
										</TableCell>
										<TableCell>
											<RoleBadge
												role={user.role}
											/>
										</TableCell>
										<TableCell className="text-right">
											<span
												className={`font-semibold ${
													user.credit >= 0
														? "text-green-400"
														: "text-red-400"
												}`}
											>
												{user.credit?.toLocaleString() ||
													0}
											</span>
										</TableCell>
										<TableCell className="text-center">
											<div className="flex items-center justify-center gap-2">
												<span className="flex items-center gap-1 text-green-400">
													<TrendingUp className="w-4 h-4" />
													{user.total_wins ||
														0}
												</span>
												<span className="text-gray-500">
													/
												</span>
												<span className="flex items-center gap-1 text-red-400">
													<TrendingDown className="w-4 h-4" />
													{user.total_losses ||
														0}
												</span>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												{user.role ===
													"user" && (
													<AlertDialog>
														<AlertDialogTrigger
															asChild
														>
															<Button
																variant="ghost"
																size="sm"
																className="text-gray-400 hover:text-white flex-1"
															>
																<RefreshCw className="w-4 h-4 mr-2" />{" "}
																Reset
																Credit
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Reset{" "}
																	{
																		user.full_name
																	}
																	's
																	Credit?
																</AlertDialogTitle>
																<AlertDialogDescription>
																	This
																	will
																	set
																	the
																	user's
																	credit
																	to
																	0
																	Toman.
																	This
																	action
																	is
																	useful
																	for
																	settling
																	debts
																	and
																	cannot
																	be
																	undone.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>
																	Cancel
																</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() =>
																		handleResetCredit(
																			user.id
																		)
																	}
																>
																	Confirm
																	Reset
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												)}
												{currentUser?.id !==
													user.id && (
													<ChangeRoleDialog
														userToChange={
															user
														}
													/>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
