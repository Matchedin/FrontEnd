"use client";

export default function Connect() {
	return (
		<section id="connect" className="pb-32">
			<div className="max-w-4xl mx-auto px-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
				<div
					className="rounded-2xl p-10 md:p-16"
					style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>
						Start optimizing your LinkedIn connections today
					</h2>
				
					<div 
					className="flex flex-row items-center gap-6 md:gap-10"
					>
						<p className="text-lg text-[rgba(0,0,0,0.7)]">
							Upload your resume and let MatchedIn analyze it to find the best connections for your career growth.
						</p>

						<a href="/connect"
							className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
						>
							<i className="fa-solid fa-arrow-right"></i>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
