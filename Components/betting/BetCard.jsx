import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BetParticipation } from "@/entities/BetParticipation";
import { Bet } from "@/entities/Bet";
import {
	Clock,
	Users,
	CheckCircle2,
	XCircle,
	Trophy,
	Eye,
	Timer,
	Crown,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BetCard({ bet, user, participation, onUpdate }) {
	const [loading, setLoading] = useState(false);

	const getStatusBadge = (status) => {
		switch (status) {
			case "open":
				return (
					<Badge
						variant="outline"
						className="border-yellow-500 text-yellow-400"
					>
						Open
					</Badge>
				);
			case "active":
				return (
					<Badge
						variant="outline"
						className="border-blue-500 text-blue-400"
					>
						Active
					</Badge>
				);
			case "resolved":
				return (
					<Badge
						variant="outline"
						className="border-green-500 text-green-400"
					>
						Resolved
					</Badge>
				);
			default:
				return <Badge variant="outline">Unknown</Badge>;
		}
	};

	const getParticipationBadge = (participation) => {
		if (!participation) return null;

		switch (participation.status) {
			case "invited":
				return (
					<Badge
						variant="outline"
						className="border-gray-500 text-gray-400"
					>
						Invited
					</Badge>
				);
			case "accepted":
				return (
					<Badge
						variant="outline"
						className="border-blue-500 text-blue-400"
					>
						Accepted
					</Badge>
				);
			case "won":
				return (
					<Badge
						variant="outline"
						className="border-green-500 text-green-400"
					>
						Won
					</Badge>
				);
			case "lost":
				return (
					<Badge
						variant="outline"
						className="border-red-500 text-red-400"
					>
						Lost
					</Badge>
				);
			default:
				return null;
		}
	};

	const handleAcceptBet = async (option) => {
		if (!user) {
			alert("Please log in to participate in bets");
			return;
		}

		setLoading(true);
		try {
			if (participation) {
				await BetParticipation.update(participation.id, {
					chosen_option: option,
					status: "accepted",
				});
			} else {
				await BetParticipation.create({
					bet_id: bet.id,
					user_email: user.email,
					chosen_option: option,
					status: "accepted",
				});
			}

			// Update bet status to active if it's still open
			if (bet.status === "open") {
				await Bet.update(bet.id, { status: "active" });
			}

			onUpdate();
		} catch (error) {
			console.error("Error accepting bet:", error);
		}
		setLoading(false);
	};

	const canAcceptBet = () => {
		return (
			user?.role === "user" &&
			bet.status === "open" &&
			bet.assigned_users?.includes(user.email) &&
			(!participation || participation.status === "invited")
		);
	};

	const isAssignedToUser = () => {
		return user?.email && bet.assigned_users?.includes(user.email);
	};

	return (
		<Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300">
			<CardHeader>
				<div className="flex justify-between items-start gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<CardTitle className="text-white text-xl">
								{bet.title}
							</CardTitle>
							{getStatusBadge(bet.status)}
							{participation &&
								getParticipationBadge(participation)}
						</div>
						<p className="text-gray-400 text-sm mb-3">
							{bet.description}
						</p>

						<div className="flex flex-wrap items-center gap-4 text-sm">
							<div className="flex items-center gap-1 text-yellow-400">
								<Trophy className="w-4 h-4" />
								<span className="font-semibold">
									{bet.amount?.toLocaleString()} T
								</span>
							</div>

							{bet.deadline && (
								<div className="flex items-center gap-1 text-gray-400">
									<Timer className="w-4 h-4" />
									<span>
										{format(
											new Date(bet.deadline),
											"MMM d, yyyy HH:mm"
										)}
									</span>
								</div>
							)}

							{user?.role === "admin" && (
								<div className="flex items-center gap-1 text-purple-400">
									<Crown className="w-4 h-4" />
									<span>Created by you</span>
								</div>
							)}

							{isAssignedToUser() &&
								user?.role === "user" && (
									<div className="flex items-center gap-1 text-blue-400">
										<Users className="w-4 h-4" />
										<span>Assigned to you</span>
									</div>
								)}
						</div>
					</div>

					<Link
						to={createPageUrl(`BetDetails?id=${bet.id}`)}
						className="text-yellow-400 hover:text-yellow-300 transition-colors"
					>
						<Eye className="w-5 h-5" />
					</Link>
				</div>
			</CardHeader>

			<CardContent>
				<div className="space-y-4">
					{/* Betting Options */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div
							className={`p-4 rounded-xl border-2 transition-all ${
								participation?.chosen_option ===
								"option_a"
									? "border-yellow-500 bg-yellow-500/10"
									: "border-gray-600 bg-gray-700/30"
							}`}
						>
							<h4 className="font-semibold text-white mb-1">
								Option A
							</h4>
							<p className="text-gray-300 text-sm">
								{bet.option_a}
							</p>
							{participation?.chosen_option ===
								"option_a" && (
								<div className="mt-2 flex items-center gap-1 text-yellow-400">
									<CheckCircle2 className="w-4 h-4" />
									<span className="text-sm">
										Your choice
									</span>
								</div>
							)}
						</div>

						<div
							className={`p-4 rounded-xl border-2 transition-all ${
								participation?.chosen_option ===
								"option_b"
									? "border-yellow-500 bg-yellow-500/10"
									: "border-gray-600 bg-gray-700/30"
							}`}
						>
							<h4 className="font-semibold text-white mb-1">
								Option B
							</h4>
							<p className="text-gray-300 text-sm">
								{bet.option_b}
							</p>
							{participation?.chosen_option ===
								"option_b" && (
								<div className="mt-2 flex items-center gap-1 text-yellow-400">
									<CheckCircle2 className="w-4 h-4" />
									<span className="text-sm">
										Your choice
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Action Buttons */}
					{canAcceptBet() && (
						<div className="flex gap-3">
							<Button
								onClick={() =>
									handleAcceptBet("option_a")
								}
								disabled={loading}
								className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-semibold"
							>
								Choose A
							</Button>
							<Button
								onClick={() =>
									handleAcceptBet("option_b")
								}
								disabled={loading}
								className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-semibold"
							>
								Choose B
							</Button>
						</div>
					)}

					{/* Result Display */}
					{bet.status === "resolved" && (
						<div className="mt-4 p-4 rounded-xl bg-gray-700/50">
							<div className="flex items-center justify-between">
								<span className="text-gray-300">
									Result:
								</span>
								<span className="text-yellow-400 font-semibold">
									{bet.result === "option_a"
										? bet.option_a
										: bet.option_b}
								</span>
							</div>
							{participation && (
								<div className="flex items-center justify-between mt-2">
									<span className="text-gray-300">
										Your result:
									</span>
									<span
										className={`font-semibold ${
											participation.status ===
											"won"
												? "text-green-400"
												: "text-red-400"
										}`}
									>
										{participation.status === "won"
											? "Won"
											: "Lost"}
									</span>
								</div>
							)}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
