import { Link } from "react-router-dom";
import { Sparkles, Heart, ShieldCheck, Ticket } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Event<span className="text-blue-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The ultimate platform for discovering college workshops, tech hackathons, cultural fests, and campus seminars.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Verified Host
              </span>
              <span className="flex items-center gap-1">
                <Ticket className="h-4 w-4 text-blue-400" /> Instant QR Passes
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/events" className="hover:text-blue-400 transition-colors">All Events</Link></li>
              <li><Link to="/events?category=Hackathon" className="hover:text-blue-400 transition-colors">Hackathons</Link></li>
              <li><Link to="/events?category=Workshop" className="hover:text-blue-400 transition-colors">Workshops</Link></li>
              <li><Link to="/events?category=Seminar" className="hover:text-blue-400 transition-colors">Seminars</Link></li>
            </ul>
          </div>

          {/* Organizers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Organizers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Host an Event</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Organizer Portal</Link></li>
              <li><Link to="/events" className="hover:text-blue-400 transition-colors">Ticketing Rules</Link></li>
            </ul>
          </div>

          {/* Platform Stats */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Community</h4>
            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Events Hosted</span>
                <span className="font-bold text-white">500+</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Bookings</span>
                <span className="font-bold text-blue-400">12.5k+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EventHub Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for campus innovators
          </p>
        </div>
      </div>
    </footer>
  );
}
