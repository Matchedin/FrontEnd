"use client";

import Link from "next/link";

export default function About() {
	return (
		<section id="about" className="py-24 md:py-32 relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 z-0">
				<div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
			</div>

			<div className="relative z-10 max-w-6xl mx-auto px-6">
				<div className="relative overflow-hidden rounded-3xl p-10 md:p-16 bg-gradient-to-br from-[#140840] via-[#1a0d4d] to-[#0f0630] border border-indigo-500/20">
					{/* Decorative elements */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
					<div className="absolute top-1/2 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl translate-x-1/2" />

					<div className="relative z-10">
						{/* Header */}
						<div className="mb-10">
							<span className="inline-block text-sm font-semibold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full mb-4 border border-indigo-500/30">
								Who We Are
							</span>
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
								About{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
									MatchedIn
								</span>
							</h2>
							<p className="text-lg text-white/70 leading-relaxed max-w-3xl">
							MatchedIn uses AI to analyze your resume and find the perfect LinkedIn 
							connections for your career goals. We identify professionals who align 
							with your experience and aspirations, then help you craft personalized 
							outreach messages that get responses.
							</p>
						</div>

						{/* Features Grid */}
						<div className="grid md:grid-cols-2 gap-6 mb-10">
							<div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:bg-white/10">
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
										</svg>
									</div>
									<h3 className="font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
										Our Mission
									</h3>
								</div>
								<p className="text-white/60 leading-relaxed">
									Eliminate the guesswork from networking. We leverage AI to match 
									you with the right people and give you the tools to make meaningful 
									connections that accelerate your career.
								</p>
							</div>

							<div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:bg-white/10">
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
										</svg>
									</div>
									<h3 className="font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
										What We Offer
									</h3>
								</div>
								<ul className="text-white/60 space-y-2">
									<li className="flex items-center gap-2">
										<svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span>Resume-based LinkedIn connection matching</span>
									</li>
									<li className="flex items-center gap-2">
										<svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span>Curated list of professionals to connect with</span>
									</li>
									<li className="flex items-center gap-2">
										<svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span>AI-generated introductory emails &amp; DM templates</span>
									</li>
								</ul>
							</div>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<a
								href="#connect"
								className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
							>
								<span>Get Started</span>
								<svg 
									className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
