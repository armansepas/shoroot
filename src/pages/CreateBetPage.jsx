import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Bet } from "@/entities/Bet";
import { BetParticipation } from "@/entities/BetParticipation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, PlusCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CreateBetPage() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [options, setOptions] = useState(["", ""]); // Start with 2 empty options
	const [deadline, setDeadline] = useState("");
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
		setLoading(true);

		try {
			// Validate options
			if (options.length < 2) {
				alert("At least 2 options are required");
				setLoading(false);
				return;
			}

			// Check for empty options
			if (options.some((opt) => !opt.trim())) {
				alert("All options must have content");
				setLoading(false);
				return;
			}

			// Create bet with options array format
			const betData = {
				title,
				description,
				amount: parseInt(amount),
				options: options.filter((opt) => opt.trim()), // Filter out empty options
				deadline,
			};

			const bet = await Bet.create(betData);

			// Redirect to dashboard
			navigate(createPageUrl("Dashboard"));
		} catch (error) {
			console.error("Error creating bet:", error);
			alert("Failed to create bet. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	const handleGoBack = () => {
		navigate(createPageUrl("Dashboard"));
	};

	const addUser = (user) => {
		if (!assignedUsers.find((u) => u.id === user.id)) {
			setAssignedUsers([...assignedUsers, user]);
		}
	};

	const removeUser = (userId) => {
		setAssignedUsers(assignedUsers.filter((u) => u.id !== userId));
	};

	const availableUsers = allUsers.filter(
		(user) => !assignedUsers.find((assigned) => assigned.id === user.id)
	);

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="flex items-center mb-6">
				<Button
					variant="ghost"
					onClick={handleGoBack}
					className="mr-4"
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Dashboard
				</Button>
				<h1 className="text-3xl font-bold">Create New Bet</h1>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Bet Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="title">Bet Title</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) =>
									setTitle(e.target.value)
								}
								placeholder="Enter bet title"
								required
							/>
						</div>

						<div>
							<Label htmlFor="description">
								Description
							</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) =>
									setDescription(e.target.value)
								}
								placeholder="Describe the bet"
								rows={3}
							/>
						</div>

						<div>
							<Label htmlFor="amount">
								Bet Amount (Credits)
							</Label>
							<Input
								id="amount"
								type="number"
								value={amount}
								onChange={(e) =>
									setAmount(e.target.value)
								}
								placeholder="Enter bet amount"
								min="1"
								required
							/>
						</div>

						<div>
							<Label>Betting Options (2-5 options)</Label>
							<div className="space-y-3 mt-2">
								{options.map((option, index) => (
									<div
										key={index}
										className="flex gap-2"
									>
										<Input
											value={option}
											onChange={(e) => {
												const newOptions = [
													...options,
												];
												newOptions[index] =
													e.target.value;
												setOptions(
													newOptions
												);
											}}
											placeholder={`Option ${
												index + 1
											}`}
											required
										/>
										{options.length > 2 && (
											<Button
												type="button"
												variant="destructive"
												size="icon"
												onClick={() => {
													const newOptions =
														[
															...options,
														];
													newOptions.splice(
														index,
														1
													);
													setOptions(
														newOptions
													);
												}}
											>
												<X className="w-4 h-4" />
											</Button>
										)}
									</div>
								))}

								{options.length < 5 && (
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setOptions([
												...options,
												"",
											]);
										}}
										className="w-full"
									>
										<PlusCircle className="w-4 h-4 mr-2" />
										Add Option
									</Button>
								)}
							</div>
						</div>

						<div>
							<Label htmlFor="deadline">Deadline</Label>
							<Input
								id="deadline"
								type="datetime-local"
								value={deadline}
								onChange={(e) =>
									setDeadline(e.target.value)
								}
								required
							/>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end space-x-4">
					<Button
						type="button"
						variant="outline"
						onClick={handleGoBack}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={loading}>
						{loading ? "Creating..." : "Create Bet"}
					</Button>
				</div>
			</form>
		</div>
	);
}
