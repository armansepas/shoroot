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

export default function DashboardPage() {
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
		} finally {
			setLoading(false);
		}
	};

	const handleBetUpdate = () => {
		loadData(); // Reload data when a bet is updated
	};

	const filterBetsByTab = (tab) => {
		switch (tab) {
			case "open":
				return bets.filter((bet) => bet.status === "open");
			case "active":
				return bets.filter((bet) => bet.status === "active");
			case "in_progress":
				return bets.filter((bet) => bet.status === "in_progress");
			case "resolved":
				return bets.filter((bet) => bet.status === "resolved");
			case "my-bets":
				if (!user) return [];
				return bets.filter((bet) =>
					participations.some(
						(p) =>
							p.bet_id === bet.id &&
							p.user_email === user.email
					)
				);
			default:
				return bets;
		}
	};

	const filteredBets = filterBetsByTab(activeTab);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Betting Dashboard
					</h1>
					<p className="text-gray-600 mt-1">
						{user
							? `Welcome back, ${user.name}!`
							: "Welcome to the betting platform"}
					</p>
				</div>
				{user?.role === "admin" && (
					<Link to={createPageUrl("CreateBet")}>
						<Button className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							Create New Bet
						</Button>
					</Link>
				)}
			</div>

			{/* Stats Overview */}
			<StatsOverview
				bets={bets}
				participations={participations}
				user={user}
			/>

			{/* Bets Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Trophy className="h-5 w-5 text-yellow-500" />
						Available Bets
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
							<TabsTrigger value="all">
								All Bets
							</TabsTrigger>
							<TabsTrigger value="open">Open</TabsTrigger>
							<TabsTrigger value="active">
								Active
							</TabsTrigger>
							<TabsTrigger value="in_progress">
								In Progress
							</TabsTrigger>
							<TabsTrigger value="resolved">
								Resolved
							</TabsTrigger>
							{user && (
								<TabsTrigger value="my-bets">
									My Bets
								</TabsTrigger>
							)}
						</TabsList>

						<TabsContent value={activeTab} className="mt-6">
							{filteredBets.length === 0 ? (
								<div className="text-center py-12">
									<Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										No bets found
									</h3>
									<p className="text-gray-600">
										{activeTab === "all"
											? "No bets have been created yet."
											: `No ${activeTab.replace(
													"-",
													" "
											  )} bets available.`}
									</p>
									{user?.role === "admin" &&
										activeTab === "all" && (
											<Link
												to={createPageUrl(
													"CreateBet"
												)}
												className="mt-4 inline-block"
											>
												<Button>
													<Plus className="h-4 w-4 mr-2" />
													Create First Bet
												</Button>
											</Link>
										)}
								</div>
							) : (
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									{filteredBets.map((bet) => {
										const participation =
											participations.find(
												(p) =>
													p.bet_id ===
														bet.id &&
													p.user_email ===
														user?.email
											);
										return (
											<BetCard
												key={bet.id}
												bet={bet}
												user={user}
												participation={
													participation
												}
												onUpdate={
													handleBetUpdate
												}
											/>
										);
									})}
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
