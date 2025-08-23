import React, { useState, useEffect } from "react";
import { Bet } from "@/entities/Bet";
import { BetParticipation } from "@/entities/BetParticipation";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Trophy,
	Clock,
	CheckCircle2,
	Users,
	TrendingUp,
	Plus,
	Eye,
	Timer,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import BetCard from "../components/betting/BetCard";
import StatsOverview from "../components/betting/StatsOverview";

export default function Dashboard() {
	const [bets, setBets] = useState([]);
	const [participations, setParticipations] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all");

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			// Try to get user data, but don't fail if not authenticated
			let userData = null;
			try {
				userData = await User.me();
			} catch (error) {
				console.log("User not authenticated, showing public view");
			}
			setUser(userData);

			const [betsData, participationsData] = await Promise.all([
				Bet.list("-created_date"),
				BetParticipation.list("-created_date"),
			]);

			setBets(betsData);
			setParticipations(participationsData);
		} catch (error) {
			console.error("Error loading data:", error);
		}
		setLoading(false);
	};

	const getFilteredBets = () => {
		switch (activeTab) {
			case "my-bets":
				if (!user) return [];
				if (user.role === "admin") {
					return bets.filter(
						(bet) => bet.created_by === user.email
					);
				}
				return bets.filter(
					(bet) =>
						bet.assigned_users?.includes(user.email) ||
						participations.some(
							(p) =>
								p.bet_id === bet.id &&
								p.user_email === user.email
						)
				);
			case "active":
				return bets.filter((bet) => bet.status === "active");
			case "resolved":
				return bets.filter((bet) => bet.status === "resolved");
			default:
				return bets;
		}
	};

	const getUserParticipation = (betId) => {
		if (!user) return null;
		return participations.find(
			(p) => p.bet_id === betId && p.user_email === user?.email
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
					<p className="text-gray-400">Loading bets...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
				<div>
					<h1 className="text-4xl font-bold text-white mb-2">
						{user
							? `Welcome back${
									user?.full_name
										? `, ${
												user.full_name.split(
													" "
												)[0]
										  }`
										: ""
							  }`
							: "Welcome to BetMaster"}
					</h1>
					<p className="text-gray-400">
						{!user
							? "View all available bets"
							: user?.role === "admin"
							? "Manage your betting platform"
							: user?.role === "user"
							? "Check your active bets and balance"
							: "View all available bets"}
					</p>
				</div>

				{user?.role === "admin" && (
					<Link to={createPageUrl("CreateBet")}>
						<Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
							<Plus className="w-5 h-5 mr-2" />
							Create New Bet
						</Button>
					</Link>
				)}
			</div>

			{/* Stats Overview - only show if user is logged in */}
			{user && (
				<StatsOverview
					bets={bets}
					participations={participations}
					user={user}
				/>
			)}

			{/* Bets Section */}
			<Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-3">
						<Trophy className="w-6 h-6 text-yellow-400" />
						{user ? "Betting Dashboard" : "All Available Bets"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full"
					>
						<TabsList className="grid w-full grid-cols-4 bg-gray-700/50 mb-6">
							<TabsTrigger
								value="all"
								className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900"
							>
								All Bets
							</TabsTrigger>
							{user && (
								<TabsTrigger
									value="my-bets"
									className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900"
								>
									{user?.role === "admin"
										? "My Created"
										: "My Bets"}
								</TabsTrigger>
							)}
							<TabsTrigger
								value="active"
								className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900"
							>
								Active
							</TabsTrigger>
							<TabsTrigger
								value="resolved"
								className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900"
							>
								Resolved
							</TabsTrigger>
						</TabsList>

						<TabsContent value={activeTab} className="mt-6">
							{getFilteredBets().length === 0 ? (
								<div className="text-center py-12">
									<Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
									<h3 className="text-xl font-semibold text-gray-300 mb-2">
										No bets found
									</h3>
									<p className="text-gray-500">
										{activeTab === "all"
											? "No bets have been created yet."
											: activeTab === "my-bets"
											? "You don't have any bets in this category."
											: activeTab === "active"
											? "No active bets at the moment."
											: "No resolved bets to display."}
									</p>
								</div>
							) : (
								<div className="grid gap-6">
									{getFilteredBets().map((bet) => (
										<BetCard
											key={bet.id}
											bet={bet}
											user={user}
											participation={getUserParticipation(
												bet.id
											)}
											onUpdate={loadData}
										/>
									))}
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
