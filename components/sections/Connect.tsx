"use client";

export default function Connect() {
	return (
		<section id="connect" className="py-24 md:py-32 relative overflow-hidden">
			{/* Animated wave background */}
			<div className="absolute inset-0 z-0 opacity-30">
				<svg
					className="absolute w-[200%] h-full animate-wave"
					viewBox="0 0 1440 320"
					preserveAspectRatio="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill="url(#waveGradient1)"
						d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
					/>
					<path
						fill="url(#waveGradient1)"
						d="M1440,160L1488,170.7C1536,181,1632,203,1728,197.3C1824,192,1920,160,2016,165.3C2112,171,2208,213,2304,218.7C2400,224,2496,192,2592,165.3C2688,139,2784,117,2832,106.7L2880,96L2880,320L2832,320C2784,320,2688,320,2592,320C2496,320,2400,320,2304,320C2208,320,2112,320,2016,320C1920,320,1824,320,1728,320C1632,320,1536,320,1488,320L1440,320Z"
					/>
					<defs>
						<linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#3b82f6" />
							<stop offset="50%" stopColor="#6366f1" />
							<stop offset="100%" stopColor="#3b82f6" />
						</linearGradient>
					</defs>
				</svg>
				<svg
					className="absolute w-[200%] h-full animate-wave-slow"
					viewBox="0 0 1440 320"
					preserveAspectRatio="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{ top: '10%' }}
				>
					<path
						fill="url(#waveGradient2)"
						d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
					/>
					<path
						fill="url(#waveGradient2)"
						d="M1440,64L1488,80C1536,96,1632,128,1728,128C1824,128,1920,96,2016,106.7C2112,117,2208,171,2304,181.3C2400,192,2496,160,2592,138.7C2688,117,2784,107,2832,101.3L2880,96L2880,320L2832,320C2784,320,2688,320,2592,320C2496,320,2400,320,2304,320C2208,320,2112,320,2016,320C1920,320,1824,320,1728,320C1632,320,1536,320,1488,320L1440,320Z"
					/>
					<defs>
						<linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#60a5fa" />
							<stop offset="50%" stopColor="#818cf8" />
							<stop offset="100%" stopColor="#60a5fa" />
						</linearGradient>
					</defs>
				</svg>
			</div>

			<style jsx>{`
				@keyframes wave {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}
				@keyframes wave-slow {
					0% {
						transform: translateX(-50%);
					}
					100% {
						transform: translateX(0);
					}
				}
				.animate-wave {
					animation: wave 15s linear infinite;
				}
				.animate-wave-slow {
					animation: wave-slow 20s linear infinite;
				}
			`}</style>

			<div className="relative z-10 max-w-5xl mx-auto px-6">
				<div
					className="relative overflow-hidden rounded-3xl p-10 md:p-16 border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 backdrop-blur-sm"
				>
					{/* Decorative elements */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
					
					<div className="relative z-10">
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
							<div className="flex-1 max-w-2xl">
								<span className="inline-block text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full mb-4">
									Get Started
								</span>
								<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
									Ready to build your{" "}
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
										ideal network?
									</span>
								</h2>
								<p className="text-lg text-gray-600 leading-relaxed">
									Upload your resume and let MatchedIn&apos;s AI analyze your experience, skills, and goals to identify the most valuable LinkedIn connections for your career trajectory.
								</p>
							</div>

							<div className="flex flex-col sm:flex-row lg:flex-col gap-4">
								<a
									href="/info"
									className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
								>
									<span>Start Connecting</span>
									<svg 
										className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</a>
								<p className="text-sm text-gray-500 text-center lg:text-left">
									Free to use • No credit card required
								</p>
							</div>
						</div>

						{/* Trust indicators */}
						<div className="mt-10 pt-8 border-t border-gray-200/60">
							<div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-10 text-sm text-gray-500">
								<div className="flex items-center gap-2">
									<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
									<span>AI-Powered Analysis</span>
								</div>
								<div className="flex items-center gap-2">
									<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
									<span>Smart Matching</span>
								</div>
								<div className="flex items-center gap-2">
									<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
									<span>Privacy Focused</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
