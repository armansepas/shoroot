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
			title: "Total Players",
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
			color: "text-blue-400",
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
			title: "Credits",
			value: user?.credits || 0,
			icon: Users,
			color: "text-yellow-400",
		},
	];

	const statsToShow = user?.role === "admin" ? adminStats : userStats;

	if (!user) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Public Stats</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="text-2xl font-bold text-yellow-400">
								{bets.length}
							</div>
							<div className="text-sm text-gray-600">
								Total Bets
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-400">
								{
									bets.filter(
										(b) => b.status === "open"
									).length
								}
							</div>
							<div className="text-sm text-gray-600">
								Open Bets
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-400">
								{
									bets.filter(
										(b) => b.status === "resolved"
									).length
								}
							</div>
							<div className="text-sm text-gray-600">
								Resolved Bets
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{statsToShow.map((stat, index) => {
				const Icon = stat.icon;
				return (
					<Card key={index}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										{stat.title}
									</p>
									<p className="text-2xl font-bold">
										{stat.value}
									</p>
								</div>
								<Icon
									className={`h-8 w-8 ${stat.color}`}
								/>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
