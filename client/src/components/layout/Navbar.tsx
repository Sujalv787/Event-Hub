import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../common/Button";
import { Sparkles, Calendar, PlusCircle, User, LogOut, Menu, X, Compass, Ticket, LayoutDashboard } from "lucide-react";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg ${
    isActive
      ? "text-blue-600 bg-blue-50/80"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
  }`;

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  }

  const dashboardPath = user?.role === "ORGANIZER" ? "/organizer/dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-30 glass-nav">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            Event<span className="text-gradient">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            <Compass className="h-4 w-4" />
            Home
          </NavLink>
          <NavLink to="/events" className={navLinkClass}>
            <Calendar className="h-4 w-4" />
            Explore Events
          </NavLink>
          {user && (
            <NavLink to={dashboardPath} className={navLinkClass}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
          )}
          {user?.role === "USER" && (
            <NavLink to="/my-bookings" className={navLinkClass}>
              <Ticket className="h-4 w-4" />
              My Bookings
            </NavLink>
          )}
        </nav>

        {/* Action Buttons & Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "ORGANIZER" && (
                <Link to="/organizer/dashboard">
                  <Button size="sm" className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20">
                    <PlusCircle className="h-4 w-4" />
                    Create Event
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-700">{user.name.split(" ")[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors px-3 py-2">
                Log In
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20">
                  Get Started Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden hover:bg-slate-100"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4 py-4 md:hidden animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={navLinkClass} end onClick={() => setIsMenuOpen(false)}>
              <Compass className="h-4 w-4" />
              Home
            </NavLink>
            <NavLink to="/events" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              <Calendar className="h-4 w-4" />
              Explore Events
            </NavLink>
            {user && (
              <NavLink to={dashboardPath} className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>
            )}
            {user?.role === "USER" && (
              <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                <Ticket className="h-4 w-4" />
                My Bookings
              </NavLink>
            )}

            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-800">{user.name} ({user.role})</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600">
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
