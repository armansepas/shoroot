import React, { useState, useEffect } from "react";
import { TelegramConfig } from "@/entities/TelegramConfig";
import { Bet } from "@/entities/Bet";
import { BetParticipation } from "@/entities/BetParticipation";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Send, Terminal, Save, Info } from "lucide-react";
import { format } from "date-fns";

export default function TelegramDashboard() {
	const [config, setConfig] = useState(null);
	const [botToken, setBotToken] = useState("");
	const [chatId, setChatId] = useState("");
	const [isEnabled, setIsEnabled] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			const configs = await TelegramConfig.list();
			if (configs.length > 0) {
				const currentConfig = configs[0];
				setConfig(currentConfig);
				setBotToken(currentConfig.bot_token || "");
				setChatId(currentConfig.chat_id || "");
				setIsEnabled(currentConfig.is_enabled || false);
			}

			// Fetch recent events for display
			const [bets, participations] = await Promise.all([
				Bet.list("-created_date", 10),
				BetParticipation.filter(
					{ status: { $ne: "invited" } },
					"-updated_date",
					10
				),
			]);

			const betEvents = bets.map((b) => ({
				type: "Bet Created",
				date: b.created_date,
				details: `${b.title} for ${b.amount} Toman`,
			}));

			const participationEvents = participations.map((p) => ({
				type: `Bet ${p.status}`,
				date: p.updated_date,
				details: `${p.user_email} chose an option`,
			}));

			const allEvents = [...betEvents, ...participationEvents].sort(
				(a, b) => new Date(b.date) - new Date(a.date)
			);
			setEvents(allEvents.slice(0, 10));
		} catch (error) {
			console.error("Failed to load data:", error);
		}
		setLoading(false);
	};

	const handleSave = async () => {
		setSaving(true);
		const data = {
			bot_token: botToken,
			chat_id: chatId,
			is_enabled: isEnabled,
		};
		try {
			if (config) {
				await TelegramConfig.update(config.id, data);
			} else {
				await TelegramConfig.create(data);
			}
			alert("Settings saved successfully!");
			loadData();
		} catch (error) {
			console.error("Failed to save settings:", error);
			alert("An error occurred while saving settings.");
		}
		setSaving(false);
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white">
					Telegram Bot Reports
				</h1>
				<p className="text-gray-400">
					Configure a Telegram bot to receive real-time event
					notifications.
				</p>
			</div>

			<Alert className="mb-8 bg-blue-900/50 border-blue-500/30 text-blue-300">
				<Info className="h-4 w-4 !text-blue-300" />
				<AlertTitle>Backend Integration Required</AlertTitle>
				<AlertDescription>
					This dashboard configures your bot settings. To make the
					bot send messages, you must enable Backend Functions in
					your project settings and write the logic to listen for
					database events and call the Telegram API.
				</AlertDescription>
			</Alert>

			<div className="grid md:grid-cols-2 gap-6">
				<Card className="bg-gray-800/50 border-gray-700">
					<CardHeader>
						<CardTitle className="text-white flex items-center gap-3">
							<Send className="w-6 h-6 text-yellow-400" />
							Bot Configuration
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label
								htmlFor="botToken"
								className="text-gray-300"
							>
								Bot Token
							</Label>
							<Input
								id="botToken"
								type="password"
								value={botToken}
								onChange={(e) =>
									setBotToken(e.target.value)
								}
								placeholder="Your Telegram bot token"
								className="bg-gray-700 border-gray-600 text-white"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="chatId"
								className="text-gray-300"
							>
								Channel/Chat ID
							</Label>
							<Input
								id="chatId"
								value={chatId}
								onChange={(e) =>
									setChatId(e.target.value)
								}
								placeholder="@your_channel_name or chat_id"
								className="bg-gray-700 border-gray-600 text-white"
							/>
						</div>
						<div className="flex items-center justify-between pt-2">
							<Label
								htmlFor="isEnabled"
								className="text-gray-300"
							>
								Enable Notifications
							</Label>
							<Switch
								id="isEnabled"
								checked={isEnabled}
								onCheckedChange={setIsEnabled}
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							onClick={handleSave}
							disabled={saving}
							className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
						>
							<Save className="w-4 h-4 mr-2" />
							{saving ? "Saving..." : "Save Configuration"}
						</Button>
					</CardFooter>
				</Card>

				<Card className="bg-gray-800/50 border-gray-700">
					<CardHeader>
						<CardTitle className="text-white flex items-center gap-3">
							<Terminal className="w-6 h-6 text-yellow-400" />
							Recent Events Log
						</CardTitle>
						<CardDescription>
							A preview of events that would be reported.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 max-h-80 overflow-y-auto">
							{loading ? (
								<p className="text-gray-400">
									Loading events...
								</p>
							) : (
								events.map((event, index) => (
									<div
										key={index}
										className="flex items-start gap-3"
									>
										<div className="text-gray-500 text-xs w-20 shrink-0">
											{format(
												new Date(event.date),
												"HH:mm:ss"
											)}
										</div>
										<div>
											<p className="font-medium text-white text-sm">
												{event.type}
											</p>
											<p className="text-gray-400 text-xs">
												{event.details}
											</p>
										</div>
									</div>
								))
							)}
							{events.length === 0 && !loading && (
								<p className="text-gray-500 text-center py-4">
									No recent events.
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
