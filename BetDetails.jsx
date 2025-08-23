import React, { useState, useEffect } from "react";
import { Bet } from "@/entities/Bet";
import { BetParticipation } from "@/entities/BetParticipation";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
	ArrowLeft,
	Trophy,
	Users,
	CheckCircle2,
	Crown,
	Edit,
	Save,
	XCircle, // Re-added this missing icon
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BetDetails() {
	const navigate = useNavigate();
	const [bet, setBet] = useState(null);
	const [participations, setParticipations] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [resolving, setResolving] = useState(false);
	const [resolutionNotes, setResolutionNotes] = useState("");
	const [selectedResult, setSelectedResult] = useState("");

	const [isEditing, setIsEditing] = useState(false);
	const [editableBet, setEditableBet] = useState(null);
	const [allUsers, setAllUsers] = useState([]);

	useEffect(() => {
		loadBetDetails();
	}, []);

	useEffect(() => {
		if (bet) {
			setEditableBet({
				...bet,
				assigned_users: bet.assigned_users || [],
			});
		}
	}, [bet]);

	const loadBetDetails = async () => {
		setLoading(true);
		const urlParams = new URLSearchParams(window.location.search);
		const betId = urlParams.get("id");

		if (!betId) {
			navigate(createPageUrl("Dashboard"));
			return;
		}

		try {
			let userData = null;
			try {
				userData = await User.me();
			} catch (e) {
				/* not logged in */
			}

			const [betData, participationsData, usersData] =
				await Promise.all([
					Bet.list().then((bets) =>
						bets.find((b) => b.id === betId)
					),
					BetParticipation.filter({ bet_id: betId }),
					User.list(),
				]);

			setUser(userData);
			setBet(betData);
			setParticipations(participationsData);
			setAllUsers(usersData.filter((u) => u.role === "user"));
		} catch (error) {
			console.error("Error loading bet details:", error);
			navigate(createPageUrl("Dashboard"));
		}
		setLoading(false);
	};

	const handleInputChange = (field, value) => {
		setEditableBet((prev) => ({ ...prev, [field]: value }));
	};

	const handleUserToggle = (email) => {
		setEditableBet((prev) => {
			const assigned = prev.assigned_users || [];
			const newAssigned = assigned.includes(email)
				? assigned.filter((u) => u !== email)
				: [...assigned, email];
			return { ...prev, assigned_users: newAssigned };
		});
	};

	const handleSaveChanges = async () => {
		setLoading(true);
		try {
			const { id, ...updateData } = editableBet;
			await Bet.update(id, updateData);
			setIsEditing(false);
			await loadBetDetails();
		} catch (error) {
			console.error("Failed to save changes:", error);
		}
		setLoading(false);
	};

	const handleResolveBet = async () => {
		if (!selectedResult || !bet) return;

		setResolving(true);
		try {
			// Update bet status and result
			await Bet.update(bet.id, {
				status: "resolved",
				result: selectedResult,
				resolution_notes: resolutionNotes,
			});

			// Update participant statuses and credits
			const updates = [];
			for (const participation of participations) {
				if (participation.status === "accepted") {
					const isWinner =
						participation.chosen_option === selectedResult;
					const winnings = isWinner ? bet.amount : -bet.amount;

					updates.push(
						BetParticipation.update(participation.id, {
							status: isWinner ? "won" : "lost",
							winnings: winnings,
						})
					);

					// Update user credits
					const participantUser = await User.filter({
						email: participation.user_email,
					});
					if (participantUser.length > 0) {
						const currentCredit =
							participantUser[0].credit || 0;
						updates.push(
							User.update(participantUser[0].id, {
								credit: currentCredit + winnings,
								...(isWinner
									? {
											total_wins:
												(participantUser[0]
													.total_wins ||
													0) + 1,
											total_winnings:
												(participantUser[0]
													.total_winnings ||
													0) + bet.amount,
									  }
									: {
											total_losses:
												(participantUser[0]
													.total_losses ||
													0) + 1,
											total_losses_amount:
												(participantUser[0]
													.total_losses_amount ||
													0) + bet.amount,
									  }),
							})
						);
					}
				}
			}

			await Promise.all(updates);
			await loadBetDetails();
		} catch (error) {
			console.error("Error resolving bet:", error);
		}
		setResolving(false);
	};

	const isAdminCreator =
		user && user.role === "admin" && user.email === bet?.created_by;

	if (loading || !editableBet) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
					<p className="text-gray-400">Loading bet details...</p>
				</div>
			</div>
		);
	}

	if (!bet) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-white mb-2">
						Bet not found
					</h2>
					<Button
						onClick={() =>
							navigate(createPageUrl("Dashboard"))
						}
					>
						Return to Dashboard
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-5xl mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between gap-4 mb-8">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						size="icon"
						onClick={() =>
							navigate(createPageUrl("Dashboard"))
						}
						className="border-gray-600 text-gray-300 hover:text-white"
					>
						<ArrowLeft className="w-4 h-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold text-white">
							{bet.title}
						</h1>
						<p className="text-gray-400">
							Detailed view and management
						</p>
					</div>
				</div>
				{isAdminCreator && bet.status !== "resolved" && (
					<Button
						onClick={() => setIsEditing(!isEditing)}
						variant="outline"
						className="text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-300"
					>
						<Edit className="w-4 h-4 mr-2" />
						{isEditing ? "Cancel Edit" : "Edit Bet"}
					</Button>
				)}
			</div>

			<div className="grid lg:grid-cols-3 gap-6">
				{isEditing ? (
					// EDITING VIEW
					<div className="lg:col-span-2 space-y-6">
						<Card className="bg-gray-800/50 border-gray-700">
							<CardHeader>
								<CardTitle className="text-white">
									Edit Bet Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label className="text-gray-300">
										Title
									</Label>
									<Input
										value={editableBet.title}
										onChange={(e) =>
											handleInputChange(
												"title",
												e.target.value
											)
										}
										className="bg-gray-700 border-gray-600 text-white"
									/>
								</div>
								<div>
									<Label className="text-gray-300">
										Description
									</Label>
									<Textarea
										value={editableBet.description}
										onChange={(e) =>
											handleInputChange(
												"description",
												e.target.value
											)
										}
										className="bg-gray-700 border-gray-600 text-white"
									/>
								</div>
								<div>
									<Label className="text-gray-300">
										Amount (Toman)
									</Label>
									<Input
										type="number"
										value={editableBet.amount}
										onChange={(e) =>
											handleInputChange(
												"amount",
												parseFloat(
													e.target.value
												)
											)
										}
										className="bg-gray-700 border-gray-600 text-white"
									/>
								</div>
								<div>
									<Label className="text-gray-300">
										Option A
									</Label>
									<Input
										value={editableBet.option_a}
										onChange={(e) =>
											handleInputChange(
												"option_a",
												e.target.value
											)
										}
										className="bg-gray-700 border-gray-600 text-white"
									/>
								</div>
								<div>
									<Label className="text-gray-300">
										Option B
									</Label>
									<Input
										value={editableBet.option_b}
										onChange={(e) =>
											handleInputChange(
												"option_b",
												e.target.value
											)
										}
										className="bg-gray-700 border-gray-600 text-white"
									/>
								</div>

								<div>
									<Label className="text-gray-300">
										Assigned Users
									</Label>
									<div className="space-y-2 mt-2 max-h-48 overflow-auto">
										{allUsers.map((u) => (
											<div
												key={u.id}
												className="flex items-center space-x-2"
											>
												<Checkbox
													id={`edit-user-${u.id}`}
													checked={(
														editableBet.assigned_users ||
														[]
													).includes(
														u.email
													)}
													onCheckedChange={() =>
														handleUserToggle(
															u.email
														)
													}
												/>
												<Label
													htmlFor={`edit-user-${u.id}`}
													className="text-white"
												>
													{u.full_name}
												</Label>
											</div>
										))}
									</div>
								</div>
								<Button
									onClick={handleSaveChanges}
									disabled={loading}
									className="w-full bg-green-600 hover:bg-green-700"
								>
									<Save className="w-4 h-4 mr-2" />{" "}
									Save Changes
								</Button>
							</CardContent>
						</Card>
					</div>
				) : (
					// REGULAR VIEW
					<div className="lg:col-span-2 space-y-6">
						<Card className="bg-gray-800/50 border-gray-700">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-3">
									<Trophy className="w-6 h-6 text-yellow-400" />
									Bet Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label className="text-gray-300">
										Description
									</Label>
									<p className="text-white mt-1">
										{bet.description}
									</p>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<Label className="text-gray-300">
											Amount
										</Label>
										<p className="text-yellow-400 font-bold text-xl">
											{bet.amount?.toLocaleString()}{" "}
											Toman
										</p>
									</div>
									<div>
										<Label className="text-gray-300">
											Status
										</Label>
										<div className="mt-1">
											<Badge
												variant="outline"
												className={
													bet.status ===
													"open"
														? "border-yellow-500 text-yellow-400"
														: bet.status ===
														  "active"
														? "border-blue-500 text-blue-400"
														: "border-green-500 text-green-400"
												}
											>
												{bet.status
													.charAt(0)
													.toUpperCase() +
													bet.status.slice(
														1
													)}
											</Badge>
										</div>
									</div>
								</div>

								{bet.deadline && (
									<div>
										<Label className="text-gray-300">
											Deadline
										</Label>
										<p className="text-white mt-1">
											{format(
												new Date(
													bet.deadline
												),
												"EEEE, MMMM d, yyyy 'at' HH:mm"
											)}
										</p>
									</div>
								)}

								<div>
									<Label className="text-gray-300">
										Created
									</Label>
									<p className="text-gray-400 text-sm mt-1">
										{format(
											new Date(
												bet.created_date
											),
											"MMM d, yyyy 'at' HH:mm"
										)}{" "}
										by {bet.created_by}
									</p>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gray-800/50 border-gray-700">
							<CardHeader>
								<CardTitle className="text-white">
									Betting Options
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid md:grid-cols-2 gap-4">
									<div
										className={`p-4 rounded-xl border-2 ${
											bet.result === "option_a"
												? "border-green-500 bg-green-500/10"
												: "border-gray-600 bg-gray-700/30"
										}`}
									>
										<h4 className="font-semibold text-white mb-1">
											Option A
										</h4>
										<p className="text-gray-300">
											{bet.option_a}
										</p>
										{bet.result === "option_a" && (
											<div className="mt-2 flex items-center gap-1 text-green-400">
												<CheckCircle2 className="w-4 h-4" />
												<span className="text-sm font-semibold">
													Winner
												</span>
											</div>
										)}
									</div>

									<div
										className={`p-4 rounded-xl border-2 ${
											bet.result === "option_b"
												? "border-green-500 bg-green-500/10"
												: "border-gray-600 bg-gray-700/30"
										}`}
									>
										<h4 className="font-semibold text-white mb-1">
											Option B
										</h4>
										<p className="text-gray-300">
											{bet.option_b}
										</p>
										{bet.result === "option_b" && (
											<div className="mt-2 flex items-center gap-1 text-green-400">
												<CheckCircle2 className="w-4 h-4" />
												<span className="text-sm font-semibold">
													Winner
												</span>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{bet.status === "resolved" &&
							bet.resolution_notes && (
								<Card className="bg-gray-800/50 border-gray-700">
									<CardHeader>
										<CardTitle className="text-white">
											Resolution Notes
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-gray-300">
											{bet.resolution_notes}
										</p>
									</CardContent>
								</Card>
							)}
					</div>
				)}

				<div className="space-y-6">
					<Card className="bg-gray-800/50 border-gray-700">
						<CardHeader>
							<CardTitle className="text-white flex items-center gap-2">
								<Users className="w-5 h-5" />
								Participants ({participations.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{participations.map((participation) => (
									<div
										key={participation.id}
										className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30"
									>
										<div>
											<p className="text-white text-sm font-medium">
												{
													participation.user_email.split(
														"@"
													)[0]
												}
											</p>
											<p className="text-gray-400 text-xs">
												{participation.chosen_option ===
												"option_a"
													? bet.option_a
													: bet.option_b}
											</p>
										</div>
										<Badge
											variant="outline"
											className={
												participation.status ===
												"invited"
													? "border-gray-500 text-gray-400"
													: participation.status ===
													  "accepted"
													? "border-blue-500 text-blue-400"
													: participation.status ===
													  "won"
													? "border-green-500 text-green-400"
													: "border-red-500 text-red-400"
											}
										>
											{participation.status}
										</Badge>
									</div>
								))}
								{participations.length === 0 && (
									<p className="text-gray-500 text-sm text-center py-4">
										No participants yet
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{user?.role === "admin" && bet.status === "active" && (
						<Card className="bg-gray-800/50 border-gray-700">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<Crown className="w-5 h-5 text-yellow-400" />
									Resolve Bet
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label
										htmlFor="result"
										className="text-gray-300"
									>
										Select Winner
									</Label>
									<Select
										value={selectedResult}
										onValueChange={
											setSelectedResult
										}
									>
										<SelectTrigger className="bg-gray-700 border-gray-600 text-white">
											<SelectValue placeholder="Choose winning option" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="option_a">
												{bet.option_a}
											</SelectItem>
											<SelectItem value="option_b">
												{bet.option_b}
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label
										htmlFor="notes"
										className="text-gray-300"
									>
										Resolution Notes
									</Label>
									<Textarea
										id="notes"
										placeholder="Add notes about the resolution..."
										value={resolutionNotes}
										onChange={(e) =>
											setResolutionNotes(
												e.target.value
											)
										}
										className="bg-gray-700 border-gray-600 text-white"
									/>
								</div>

								<Button
									onClick={handleResolveBet}
									disabled={
										!selectedResult || resolving
									}
									className="w-full bg-green-600 hover:bg-green-700"
								>
									{resolving
										? "Resolving..."
										: "Resolve Bet"}
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
