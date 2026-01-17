'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-transparent border-t border-white/20 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About</h3>
            <p className="text-white/70 text-sm">
              MatchedIn connects you with opportunities and people who share your passions.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Network
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@matchedin.com" className="text-white/70 hover:text-white transition-colors text-sm">
                  info@matchedin.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="text-white/70 hover:text-white transition-colors text-sm">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-6 flex justify-between items-center">
          <p className="text-white/50 text-sm">
            © 2026 MatchedIn. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-white/50 hover:text-white/70 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/50 hover:text-white/70 transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
