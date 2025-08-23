import React from "react";
import { motion } from "framer-motion";
import { Zap, Users, BarChart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon, title, description, delay }) => (
	<motion.div
		initial={{ opacity: 0, y: 50 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, delay }}
		className="bg-card p-6 rounded-lg shadow-lg text-center"
	>
		<div className="flex justify-center mb-4">{icon}</div>
		<h3 className="text-xl font-bold mb-2">{title}</h3>
		<p className="text-muted-foreground">{description}</p>
	</motion.div>
);

export default function HeroPage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<main className="container mx-auto px-4 py-16">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-16"
				>
					<h1 className="text-5xl md:text-7xl font-extrabold mb-4">
						Welcome to Shoroot
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
						The ultimate platform for friendly wagers and
						competitive betting. Create bets, challenge your
						friends, and see who comes out on top.
					</p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="mt-8"
					>
						<Link to="/dashboard">
							<Button
								size="lg"
								className="text-lg px-8 py-6"
							>
								Get Started
							</Button>
						</Link>
					</motion.div>
				</motion.div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					<FeatureCard
						icon={
							<Zap className="w-12 h-12 text-primary animate-pulse" />
						}
						title="Instant Bets"
						description="Create a bet on any topic in seconds. Up to 5 options available for maximum flexibility."
						delay={0.2}
					/>
					<FeatureCard
						icon={
							<Users className="w-12 h-12 text-primary animate-bounce" />
						}
						title="Community Driven"
						description="The more people that play, the bigger the pot. Payouts are calculated based on participation."
						delay={0.4}
					/>
					<FeatureCard
						icon={
							<BarChart className="w-12 h-12 text-primary animate-pulse" />
						}
						title="Dynamic Payouts"
						description="Your potential winnings are calculated in real-time based on the odds and number of participants."
						delay={0.6}
					/>
					<FeatureCard
						icon={
							<ShieldCheck className="w-12 h-12 text-primary animate-bounce" />
						}
						title="Fair & Transparent"
						description="Admins resolve bets and distribute winnings. Credits are reset after each payout cycle."
						delay={0.8}
					/>
				</div>
			</main>
		</div>
	);
}
