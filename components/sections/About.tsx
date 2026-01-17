"use client";

import Link from "next/link";

export default function About() {
	return (
		<section id="about" className="py-20">
			<div className="max-w-6xl mx-auto px-6">
				<div
					className="rounded-2xl p-10 md:p-16"
					style={{ backgroundColor: "var(--secondary)", color: "white" }}
				>
					<h2
						className="text-3xl md:text-4xl font-bold mb-4"
						style={{ color: "var(--primary)" }}
					>
						About MatchedIn
					</h2>

					<p className="mb-6 text-white/90 leading-relaxed">
						MatchedIn helps you discover meaningful connections and opportunities.
						We bring together students, professionals, and organizations through
						events, profiles, and smart recommendations — all designed to help
						you grow your network and advance your goals.
					</p>

					<div className="grid md:grid-cols-2 gap-6 mb-6">
						<div>
							<h3 className="font-semibold mb-2" style={{ color: "var(--accent)" }}>
								Our Mission
							</h3>
							<p className="text-white/80">
								Create a friendly platform that makes networking approachable,
								productive, and personalized for every stage of your journey.
							</p>
						</div>

						<div>
							<h3 className="font-semibold mb-2" style={{ color: "var(--accent)" }}>
								What We Offer
							</h3>
							<ul className="list-disc pl-5 text-white/80">
								<li>Curated networking events</li>
								<li>Personalized recommendations</li>
								<li>Tools to showcase your skills and projects</li>
							</ul>
						</div>
					</div>

					<div className="flex gap-4">
						<Link
							href="#connect"
							className="inline-block rounded-md px-6 py-3 font-medium"
							style={{ backgroundColor: "var(--primary)", color: "white" }}
						>
							Get Started
						</Link>

						<Link
							href="#"
							className="inline-block rounded-md px-6 py-3 font-medium border"
							style={{ borderColor: "rgba(255,255,255,0.12)", color: "white" }}
						>
							Learn More
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
