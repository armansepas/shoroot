import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Bet } from "@/entities/Bet";
import { BetParticipation } from "@/entities/BetParticipation";
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
import {
	CreditCard,
	ArrowUpCircle,
	ArrowDownCircle,
	Users,
	RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
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

export default function CreditsPage() {
	const [currentUser, setCurrentUser] = useState(null);
	const [users, setUsers] = useState([]);
	const [bets, setBets] = useState([]);
	const [participations, setParticipations] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			const [me, allUsers, allBets, allParticipations] =
				await Promise.all([
					User.me(),
					User.list(),
					Bet.list(),
					BetParticipation.filter({ status: ["won", "lost"] }),
				]);
			setCurrentUser(me);
			setUsers(allUsers);
			setBets(allBets);
			setParticipations(allParticipations);
		} catch (error) {
			console.error("Failed to load credits data:", error);
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

	const getBetTitle = (betId) => {
		const bet = bets.find((b) => b.id === betId);
		return bet ? bet.title : "Unknown Bet";
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
			</div>
		);
	}

	const AdminView = () => (
		<Card className="bg-gray-800/50 border-gray-700">
			<CardHeader>
				<CardTitle className="text-white flex items-center gap-3">
					<Users className="w-6 h-6 text-yellow-400" />
					Player Credit Overview
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className="border-gray-700 hover:bg-transparent">
							<TableHead className="text-white">
								Player
							</TableHead>
							<TableHead className="text-white text-right">
								Credit Balance (Toman)
							</TableHead>
							<TableHead className="text-white text-right">
								Action
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users
							.filter((u) => u.role === "user")
							.map((user) => (
								<TableRow
									key={user.id}
									className="border-gray-700"
								>
									<TableCell>
										<p className="font-medium text-white">
											{user.full_name}
										</p>
										<p className="text-sm text-gray-400">
											{user.email}
										</p>
									</TableCell>
									<TableCell className="text-right">
										<span
											className={`text-lg font-bold ${
												user.credit >= 0
													? "text-green-400"
													: "text-red-400"
											}`}
										>
											{user.credit?.toLocaleString() ||
												0}
										</span>
									</TableCell>
									<TableCell className="text-right">
										<AlertDialog>
											<AlertDialogTrigger
												asChild
											>
												<Button
													variant="ghost"
													size="sm"
													className="text-gray-400 hover:text-white"
												>
													<RefreshCw className="w-4 h-4 mr-2" />{" "}
													Settle
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Settle
														balance for{" "}
														{
															user.full_name
														}
														?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This will
														reset the
														user's
														credit to
														0. Use this
														action
														after
														payments
														have been
														manually
														settled.
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
														Settlement
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);

	const UserView = () => {
		const userParticipations = participations.filter(
			(p) => p.user_email === currentUser.email
		);
		return (
			<div className="space-y-8">
				<Card className="bg-gray-800/50 border-gray-700 text-center p-8">
					<CardTitle className="text-gray-400 font-medium">
						Your Current Balance
					</CardTitle>
					<p
						className={`text-5xl font-bold mt-2 ${
							currentUser.credit >= 0
								? "text-green-400"
								: "text-red-400"
						}`}
					>
						{currentUser.credit?.toLocaleString() || 0}
						<span className="text-3xl font-medium text-gray-400 ml-2">
							Toman
						</span>
					</p>
				</Card>
				<Card className="bg-gray-800/50 border-gray-700">
					<CardHeader>
						<CardTitle className="text-white">
							Transaction History
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow className="border-gray-700 hover:bg-transparent">
									<TableHead className="text-white">
										Bet
									</TableHead>
									<TableHead className="text-white">
										Outcome
									</TableHead>
									<TableHead className="text-white text-right">
										Amount (Toman)
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{userParticipations.length > 0 ? (
									userParticipations.map((p) => (
										<TableRow
											key={p.id}
											className="border-gray-700"
										>
											<TableCell>
												<p className="font-medium text-white">
													{getBetTitle(
														p.bet_id
													)}
												</p>
												<p className="text-sm text-gray-400">
													{format(
														new Date(
															p.updated_date
														),
														"MMM d, yyyy"
													)}
												</p>
											</TableCell>
											<TableCell>
												{p.status ===
												"won" ? (
													<span className="flex items-center gap-2 text-green-400">
														<ArrowUpCircle className="w-5 h-5" />{" "}
														Won
													</span>
												) : (
													<span className="flex items-center gap-2 text-red-400">
														<ArrowDownCircle className="w-5 h-5" />{" "}
														Lost
													</span>
												)}
											</TableCell>
											<TableCell className="text-right">
												<span
													className={`font-semibold ${
														p.winnings >
														0
															? "text-green-400"
															: "text-red-400"
													}`}
												>
													{p.winnings > 0
														? "+"
														: ""}
													{p.winnings?.toLocaleString()}
												</span>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-center text-gray-500 py-8"
										>
											You have no resolved bets
											yet.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		);
	};

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white">
					Credits & Payments
				</h1>
				<p className="text-gray-400">
					{currentUser?.role === "admin"
						? "Oversee player credits and settle balances."
						: "Track your winnings, losses, and current balance."}
				</p>
			</div>
			{currentUser?.role === "admin" ? <AdminView /> : <UserView />}
		</div>
	);
}
