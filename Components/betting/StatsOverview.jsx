import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, TrendingDown, Users, Timer } from "lucide-react";

export default function StatsOverview({ bets, participations, user }) {
	const getStats = () => {
		if (!user) return {};

		if (user.role === "admin") {
			return {
				totalBets: bets.length,
				activeBets: bets.filter((b) => b.status === "active").length,
				resolvedBets: bets.filter((b) => b.status === "resolved")
					.length,
				totalParticipants: new Set(
					participations.map((p) => p.user_email)
				).size,
			};
		}

		const userParticipations = participations.filter(
			(p) => p.user_email === user.email
		);
		return {
			myBets: userParticipations.length,
			wins: userParticipations.filter((p) => p.status === "won").length,
			losses: userParticipations.filter((p) => p.status === "lost")
				.length,
			pending: userParticipations.filter((p) => p.status === "accepted")
				.length,
		};
	};

	const stats = getStats();

	const adminStats = [
		{
			title: "Total Bets",
			value: stats.totalBets || 0,
			icon: Trophy,
			color: "text-yellow-400",
		},
		{
			title: "Active Bets",
			value: stats.activeBets || 0,
			icon: Timer,
			color: "text-blue-400",
		},
		{
			title: "Resolved Bets",
			value: stats.resolvedBets || 0,
			icon: TrendingUp,
			color: "text-green-400",
		},
		{
			title: "Participants",
			value: stats.totalParticipants || 0,
			icon: Users,
			color: "text-purple-400",
		},
	];

	const userStats = [
		{
			title: "My Bets",
			value: stats.myBets || 0,
			icon: Trophy,
			color: "text-yellow-400",
		},
		{
			title: "Wins",
			value: stats.wins || 0,
			icon: TrendingUp,
			color: "text-green-400",
		},
		{
			title: "Losses",
			value: stats.losses || 0,
			icon: TrendingDown,
			color: "text-red-400",
		},
		{
			title: "Pending",
			value: stats.pending || 0,
			icon: Timer,
			color: "text-blue-400",
		},
	];

	const displayStats = user?.role === "admin" ? adminStats : userStats;

	if (user?.role === "viewer") return null;

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			{displayStats.map((stat) => (
				<Card
					key={stat.title}
					className="bg-gray-800/50 border-gray-700 backdrop-blur-sm"
				>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-400 mb-1">
									{stat.title}
								</p>
								<p className="text-3xl font-bold text-white">
									{stat.value}
								</p>
							</div>
							<div
								className={`p-3 rounded-xl bg-gray-700/50 ${stat.color}`}
							>
								<stat.icon className="w-6 h-6" />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
