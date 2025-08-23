import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
	LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
	const location = useLocation();
	const navigate = useNavigate();
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

	const handleLogout = () => {
		User.logout();
		navigate("/login");
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
			title: "Credits",
			url: createPageUrl("Credits"),
			icon: CreditCard,
			roles: ["admin", "user"],
		},
		{
			title: "Profile",
			url: createPageUrl("Profile"),
			icon: UserCircle,
			roles: ["admin", "user"],
		},
	];

	const filteredNavigationItems = navigationItems.filter(
		(item) => item.roles.includes(user?.role) || item.roles.includes(null)
	);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<Link
								to={createPageUrl("Dashboard")}
								className="flex items-center space-x-2"
							>
								<Trophy className="h-8 w-8 text-yellow-500" />
								<span className="text-xl font-bold text-gray-900">
									ShorOOt
								</span>
							</Link>
						</div>

						<div className="hidden md:flex items-center space-x-8">
							{filteredNavigationItems.map((item) => {
								const Icon = item.icon;
								const isActive =
									location.pathname === item.url;
								return (
									<Link
										key={item.title}
										to={item.url}
										className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
											isActive
												? "bg-blue-100 text-blue-700"
												: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
										}`}
									>
										<Icon className="h-4 w-4" />
										<span>{item.title}</span>
									</Link>
								);
							})}
						</div>

						<div className="flex items-center space-x-4">
							{user ? (
								<div className="flex items-center space-x-3">
									<div className="hidden sm:block text-right">
										<div className="text-sm font-medium text-gray-900">
											{user.name}
										</div>
										<div className="text-xs text-gray-500">
											{user.role} •{" "}
											{user.credits} credits
										</div>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={handleLogout}
									>
										<LogOut className="h-4 w-4" />
									</Button>
								</div>
							) : (
								<div className="flex items-center space-x-2">
									<Link to="/login">
										<Button
											variant="outline"
											size="sm"
										>
											Login
										</Button>
									</Link>
									<Link to="/register">
										<Button size="sm">
											Sign Up
										</Button>
									</Link>
								</div>
							)}

							{/* Mobile menu button */}
							<Button
								variant="ghost"
								size="sm"
								className="md:hidden"
								onClick={() => setIsOpen(!isOpen)}
							>
								<Menu className="h-5 w-5" />
							</Button>
						</div>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
							{filteredNavigationItems.map((item) => {
								const Icon = item.icon;
								const isActive =
									location.pathname === item.url;
								return (
									<Link
										key={item.title}
										to={item.url}
										className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
											isActive
												? "bg-blue-100 text-blue-700"
												: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
										}`}
										onClick={() =>
											setIsOpen(false)
										}
									>
										<Icon className="h-5 w-5" />
										<span>{item.title}</span>
									</Link>
								);
							})}
						</div>
					</div>
				)}
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	);
}
