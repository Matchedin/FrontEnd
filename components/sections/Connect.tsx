"use client";

export default function Connect() {
	return (
		<section id="connect" className="py-24 md:py-32">
			<div className="max-w-5xl mx-auto px-6">
				<div
					className="relative overflow-hidden rounded-3xl p-10 md:p-16 border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
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
