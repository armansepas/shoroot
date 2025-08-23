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
				return (
					<Badge variant="outline" className="border-gray-500">
						{status}
					</Badge>
				);
		}
	};

	const getParticipationBadge = (participation) => {
		if (!participation) return null;

		switch (participation.status) {
			case "won":
				return (
					<Badge className="bg-green-500 text-white">
						<Trophy className="h-3 w-3 mr-1" />
						Won
					</Badge>
				);
			case "lost":
				return (
					<Badge variant="destructive">
						<XCircle className="h-3 w-3 mr-1" />
						Lost
					</Badge>
				);
			case "pending":
				return (
					<Badge
						variant="outline"
						className="border-blue-500 text-blue-400"
					>
						<Timer className="h-3 w-3 mr-1" />
						Pending
					</Badge>
				);
			default:
				return (
					<Badge variant="outline">
						<CheckCircle2 className="h-3 w-3 mr-1" />
						Placed
					</Badge>
				);
		}
	};

	const handlePlaceBet = async (choice) => {
		if (!user) {
			alert("Please login to place a bet");
			return;
		}

		setLoading(true);
		try {
			await BetParticipation.create({
				bet_id: bet.id,
				choice,
				amount: bet.amount,
			});
			onUpdate(); // Refresh the data
		} catch (error) {
			console.error("Error placing bet:", error);
			alert(
				error.response?.data?.error ||
					"Failed to place bet. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleResolveBet = async (winning_option) => {
		setLoading(true);
		try {
			await Bet.resolve(bet.id, winning_option);
			onUpdate(); // Refresh the data
		} catch (error) {
			console.error("Error resolving bet:", error);
			alert("Failed to resolve bet. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const isDeadlinePassed = new Date(bet.deadline) < new Date();
	const canPlaceBet =
		user &&
		!participation &&
		bet.status === "open" &&
		!isDeadlinePassed &&
		user.role !== "admin";
	const canResolveBet = user?.role === "admin" && bet.status === "open";

	return (
		<Card className="w-full hover:shadow-lg transition-shadow">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-lg font-semibold mb-2">
							{bet.title}
						</CardTitle>
						<div className="flex items-center gap-2 mb-2">
							{getStatusBadge(bet.status)}
							{participation &&
								getParticipationBadge(participation)}
						</div>
					</div>
					<div className="text-right">
						<div className="text-2xl font-bold text-yellow-600">
							{bet.amount}
						</div>
						<div className="text-xs text-gray-500">
							Credits
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{bet.description && (
					<p className="text-sm text-gray-600">
						{bet.description}
					</p>
				)}

				<div className="space-y-2">
					<div className="text-sm font-medium">
						Betting Options:
					</div>
					<div className="grid grid-cols-1 gap-2">
						<div
							className={`p-3 rounded-lg border ${
								participation?.choice === bet.option_a
									? "border-blue-500 bg-blue-50"
									: "border-gray-200"
							} ${
								bet.winning_option === bet.option_a
									? "border-green-500 bg-green-50"
									: ""
							}`}
						>
							<div className="flex items-center justify-between">
								<span className="font-medium">
									A: {bet.option_a}
								</span>
								{canPlaceBet && (
									<Button
										size="sm"
										onClick={() =>
											handlePlaceBet(
												bet.option_a
											)
										}
										disabled={loading}
									>
										Bet A
									</Button>
								)}
								{canResolveBet && (
									<Button
										size="sm"
										variant="outline"
										onClick={() =>
											handleResolveBet(
												bet.option_a
											)
										}
										disabled={loading}
									>
										<Crown className="h-3 w-3 mr-1" />
										Win A
									</Button>
								)}
							</div>
						</div>

						<div
							className={`p-3 rounded-lg border ${
								participation?.choice === bet.option_b
									? "border-blue-500 bg-blue-50"
									: "border-gray-200"
							} ${
								bet.winning_option === bet.option_b
									? "border-green-500 bg-green-50"
									: ""
							}`}
						>
							<div className="flex items-center justify-between">
								<span className="font-medium">
									B: {bet.option_b}
								</span>
								{canPlaceBet && (
									<Button
										size="sm"
										onClick={() =>
											handlePlaceBet(
												bet.option_b
											)
										}
										disabled={loading}
									>
										Bet B
									</Button>
								)}
								{canResolveBet && (
									<Button
										size="sm"
										variant="outline"
										onClick={() =>
											handleResolveBet(
												bet.option_b
											)
										}
										disabled={loading}
									>
										<Crown className="h-3 w-3 mr-1" />
										Win B
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between text-xs text-gray-500">
					<div className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						{format(
							new Date(bet.deadline),
							"MMM dd, yyyy HH:mm"
						)}
					</div>
					<div className="flex items-center gap-1">
						<Users className="h-3 w-3" />
						Created by {bet.created_by}
					</div>
				</div>

				{isDeadlinePassed && bet.status === "open" && (
					<div className="text-xs text-red-500 text-center">
						Deadline has passed
					</div>
				)}

				{participation && (
					<div className="text-xs text-center p-2 bg-gray-50 rounded">
						You bet {participation.amount} credits on{" "}
						{participation.choice}
					</div>
				)}

				{bet.status === "resolved" && (
					<div className="text-center p-2 bg-green-50 rounded">
						<div className="text-sm font-medium text-green-800">
							Winner: {bet.winning_option}
						</div>
						{bet.resolved_date && (
							<div className="text-xs text-green-600">
								Resolved on{" "}
								{format(
									new Date(bet.resolved_date),
									"MMM dd, yyyy"
								)}
							</div>
						)}
					</div>
				)}

				<div className="pt-2">
					<Link to={createPageUrl(`BetDetails?id=${bet.id}`)}>
						<Button
							variant="outline"
							size="sm"
							className="w-full bg-blue-900/30 border-blue-600 text-blue-300 hover:bg-blue-800/40 hover:text-blue-200"
						>
							<Eye className="h-3 w-3 mr-1" />
							View Details
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
