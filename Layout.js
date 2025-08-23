import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import {
	Trophy,
	Users,
	CreditCard,
	TrendingUp,
	Menu,
	Crown,
	Eye,
	UserCircle,
	Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children, currentPageName }) {
	const location = useLocation();
	const [user, setUser] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		loadUser();
	}, [location]);

	const loadUser = async () => {
		try {
			const userData = await User.me();
			setUser(userData);
		} catch (error) {
			setUser(null);
		}
	};

	const navigationItems = [
		{
			title: "Bets Dashboard",
			url: createPageUrl("Dashboard"),
			icon: Trophy,
			roles: ["admin", "user", "viewer", null],
		},
		{
			title: "Create Bet",
			url: createPageUrl("CreateBet"),
			icon: TrendingUp,
			roles: ["admin"],
		},
		{
			title: "Manage Users",
			url: createPageUrl("ManageUsers"),
			icon: Users,
			roles: ["admin"],
		},
		{
			title: "Credits & Payments",
			url: createPageUrl("Credits"),
			icon: CreditCard,
			roles: ["admin", "user"],
		},
		{
			title: "Telegram Reports",
			url: createPageUrl("TelegramDashboard"),
			icon: Send,
			roles: ["admin"],
		},
		{
			title: "My Profile",
			url: createPageUrl("Profile"),
			icon: UserCircle,
			roles: ["admin", "user"],
		},
	];

	const getRoleIcon = (role) => {
		switch (role) {
			case "admin":
				return <Crown className="w-4 h-4 text-yellow-400" />;
			case "user":
				return <Trophy className="w-4 h-4 text-blue-400" />;
			default:
				return <Eye className="w-4 h-4 text-gray-400" />;
		}
	};

	const getRoleName = (role) => {
		switch (role) {
			case "admin":
				return "Administrator";
			case "user":
				return "Player";
			default:
				return "Viewer";
		}
	};

	const filteredNav = navigationItems.filter((item) =>
		!user ? item.roles.includes(null) : item.roles.includes(user.role)
	);

	const SidebarContent = () => (
		<>
			<div className="p-6 border-b border-gray-800">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
						<Trophy className="w-6 h-6 text-gray-900" />
					</div>
					<div>
						<h2 className="font-bold text-xl text-white">
							shoroot
						</h2>
						<p className="text-xs text-gray-400">
							Premium Betting Platform
						</p>
					</div>
				</div>
			</div>

			<nav className="flex-1 p-4">
				<div className="space-y-2">
					{filteredNav.map((item) => (
						<Link
							key={item.title}
							to={item.url}
							className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
								location.pathname === item.url
									? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
									: "text-gray-300 hover:text-white hover:bg-gray-800/50"
							}`}
							onClick={() => setIsOpen(false)}
						>
							<item.icon className="w-5 h-5" />
							<span className="font-medium">
								{item.title}
							</span>
						</Link>
					))}
				</div>
			</nav>

			{user ? (
				<div className="p-6 border-t border-gray-800">
					<div className="bg-gray-800/50 rounded-xl p-4">
						<div className="flex items-center gap-3 mb-3">
							{getRoleIcon(user.role)}
							<div className="flex-1 min-w-0">
								<p className="font-medium text-white text-sm truncate">
									{user.full_name}
								</p>
								<p className="text-xs text-gray-400">
									{getRoleName(user.role)}
								</p>
							</div>
						</div>

						{(user.role === "admin" ||
							user.role === "user") && (
							<div className="pt-3 border-t border-gray-700">
								<div className="flex justify-between items-center">
									<span className="text-xs text-gray-400">
										Balance
									</span>
									<span
										className={`font-bold text-sm ${
											user.credit >= 0
												? "text-green-400"
												: "text-red-400"
										}`}
									>
										{user.credit?.toLocaleString() ||
											0}{" "}
										T
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="p-6 border-t border-gray-800">
					<Button
						className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
						onClick={() => User.login()}
					>
						Login / Sign Up
					</Button>
				</div>
			)}
		</>
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			<style>
				{`
          :root {
            --background: 220 23% 9%;
            --foreground: 220 14% 93%;
            --primary: 48 96% 53%;
            --primary-foreground: 48 96% 9%;
          }
        `}
			</style>

			{/* Desktop Sidebar */}
			<aside className="fixed inset-y-0 left-0 z-50 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 hidden lg:block">
				<SidebarContent />
			</aside>

			{/* Mobile Sidebar */}
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent
					side="left"
					className="p-0 bg-gray-900 border-gray-800 w-72"
				>
					<SidebarContent />
				</SheetContent>
			</Sheet>

			{/* Main Content */}
			<div className="lg:pl-72">
				{/* Mobile Header */}
				<header className="lg:hidden bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
					<div className="flex items-center justify-between">
						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-white"
								>
									<Menu className="w-6 h-6" />
								</Button>
							</SheetTrigger>
						</Sheet>

						<div className="flex items-center gap-2">
							<Trophy className="w-6 h-6 text-yellow-400" />
							<h1 className="text-xl font-bold text-white">
								shoroot
							</h1>
						</div>

						{user &&
						(user.role === "admin" || user.role === "user") ? (
							<div className="text-right">
								<p
									className={`text-sm font-bold ${
										user.credit >= 0
											? "text-green-400"
											: "text-red-400"
									}`}
								>
									{user.credit?.toLocaleString() || 0}{" "}
									T
								</p>
							</div>
						) : (
							<div className="w-12"></div>
						)}
					</div>
				</header>

				{/* Page Content */}
				<main className="min-h-screen">{children}</main>
			</div>
		</div>
	);
}
