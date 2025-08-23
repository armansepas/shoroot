import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Bet } from "@/entities/Bet";
import { BetParticipation } from "@/entities/BetParticipation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Calendar as CalendarIcon,
	ArrowLeft,
	PlusCircle,
	X,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CreateBetPage() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [optionA, setOptionA] = useState("");
	const [optionB, setOptionB] = useState("");
	const [deadline, setDeadline] = useState(null);
	const [allUsers, setAllUsers] = useState([]);
	const [assignedUsers, setAssignedUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const users = await User.list();
				// Filter for users with role 'user' or if no role is specified
				const playerUsers = users.filter(
					(user) => user.role === "user" || !user.role
				);
				setAllUsers(playerUsers);
			} catch (error) {
				console.error("Error fetching users:", error);
				setAllUsers([]);
			}
		};
		fetchUsers();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title || !description || !amount || !optionA || !optionB) {
			alert("Please fill all required fields.");
			return;
		}
		setLoading(true);

		try {
			const betData = {
				title,
				description,
				amount: parseFloat(amount),
				option_a: optionA,
				option_b: optionB,
				deadline: deadline ? deadline.toISOString() : null,
				assigned_users: assignedUsers.map((u) => u.email),
				status: "open",
			};

			const newBet = await Bet.create(betData);

			// Create participations for assigned users
			if (assignedUsers.length > 0) {
				const participations = assignedUsers.map((user) => ({
					bet_id: newBet.id,
					user_email: user.email,
					status: "invited",
				}));

				await BetParticipation.bulkCreate(participations);
			}

			navigate(createPageUrl("Dashboard"));
		} catch (error) {
			console.error("Failed to create bet:", error);
			alert("An error occurred while creating the bet.");
		} finally {
			setLoading(false);
		}
	};

	const toggleUserSelection = (user) => {
		setAssignedUsers((prev) => {
			const isSelected = prev.some((u) => u.id === user.id);
			if (isSelected) {
				return prev.filter((u) => u.id !== user.id);
			} else {
				return [...prev, user];
			}
		});
	};

	const removeUser = (userToRemove) => {
		setAssignedUsers((prev) =>
			prev.filter((u) => u.id !== userToRemove.id)
		);
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="flex items-center gap-4 mb-8">
				<Button
					variant="outline"
					size="icon"
					onClick={() => navigate(createPageUrl("Dashboard"))}
					className="border-gray-600 text-gray-300 hover:text-white"
				>
					<ArrowLeft className="w-4 h-4" />
				</Button>
				<div>
					<h1 className="text-3xl font-bold text-white">
						Create a New Bet
					</h1>
					<p className="text-gray-400">
						Set up the details and assign players.
					</p>
				</div>
			</div>

			<Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-3">
						<PlusCircle className="w-6 h-6 text-yellow-400" />
						Bet Details
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label
									htmlFor="title"
									className="text-gray-300"
								>
									Bet Title
								</Label>
								<Input
									id="title"
									value={title}
									onChange={(e) =>
										setTitle(e.target.value)
									}
									placeholder="e.g., World Cup Final"
									className="bg-gray-700 border-gray-600 text-white"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="amount"
									className="text-gray-300"
								>
									Amount (Toman)
								</Label>
								<Input
									id="amount"
									type="number"
									value={amount}
									onChange={(e) =>
										setAmount(e.target.value)
									}
									placeholder="e.g., 10000"
									className="bg-gray-700 border-gray-600 text-white"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="description"
								className="text-gray-300"
							>
								Description
							</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) =>
									setDescription(e.target.value)
								}
								placeholder="Provide details about the bet..."
								className="bg-gray-700 border-gray-600 text-white"
								required
							/>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label
									htmlFor="optionA"
									className="text-gray-300"
								>
									Option A
								</Label>
								<Input
									id="optionA"
									value={optionA}
									onChange={(e) =>
										setOptionA(e.target.value)
									}
									placeholder="e.g., Team A wins"
									className="bg-gray-700 border-gray-600 text-white"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="optionB"
									className="text-gray-300"
								>
									Option B
								</Label>
								<Input
									id="optionB"
									value={optionB}
									onChange={(e) =>
										setOptionB(e.target.value)
									}
									placeholder="e.g., Team B wins"
									className="bg-gray-700 border-gray-600 text-white"
									required
								/>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label className="text-gray-300">
									Acceptance Deadline (Optional)
								</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:text-white"
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{deadline ? (
												format(
													deadline,
													"PPP"
												)
											) : (
												<span>
													Pick a date
												</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={deadline}
											onSelect={setDeadline}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
						</div>

						{/* User Selection */}
						<div className="space-y-4">
							<Label className="text-gray-300">
								Assign Users (Optional)
							</Label>

							{/* Selected Users */}
							{assignedUsers.length > 0 && (
								<div className="space-y-2">
									<p className="text-sm text-gray-400">
										Selected Users:
									</p>
									<div className="flex flex-wrap gap-2">
										{assignedUsers.map((user) => (
											<div
												key={user.id}
												className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1"
											>
												<span className="text-yellow-400 text-sm">
													{user.full_name}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="h-4 w-4 p-0 text-yellow-400 hover:text-red-400"
													onClick={() =>
														removeUser(
															user
														)
													}
												>
													<X className="h-3 w-3" />
												</Button>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Available Users */}
							<div className="max-h-48 overflow-y-auto space-y-2">
								{allUsers.map((user) => (
									<div
										key={user.id}
										className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg"
									>
										<Checkbox
											id={`user-${user.id}`}
											checked={assignedUsers.some(
												(u) =>
													u.id === user.id
											)}
											onCheckedChange={() =>
												toggleUserSelection(
													user
												)
											}
											className="border-gray-500"
										/>
										<Label
											htmlFor={`user-${user.id}`}
											className="text-white cursor-pointer flex-1"
										>
											<div>
												<p className="font-medium">
													{user.full_name}
												</p>
												<p className="text-sm text-gray-400">
													{user.email}
												</p>
											</div>
										</Label>
									</div>
								))}
								{allUsers.length === 0 && (
									<p className="text-gray-500 text-center py-4">
										No users available
									</p>
								)}
							</div>
						</div>

						<div className="flex justify-end pt-4">
							<Button
								type="submit"
								disabled={loading}
								className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold w-full md:w-auto"
							>
								{loading
									? "Creating Bet..."
									: "Create Bet"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
