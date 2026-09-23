import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Event, EVENT_CATEGORIES } from "../types";
import { getEvents } from "../services/event.service";
import { EventCard } from "../components/events/EventCard";
import { Button } from "../components/common/Button";
import { Spinner } from "../components/common/Spinner";
import {
  Search,
  Sparkles,
  Flame,
  Calendar,
  Ticket,
  ShieldCheck,
  Zap,
  Award,
  ChevronRight,
  ArrowRight,
  Code,
  Laptop,
  Music,
  Presentation,
  BookOpen,
  Trophy,
  CheckCircle2
} from "lucide-react";

// Helper map for Category Icons & Gradient Theme
const categoryMeta: Record<string, { icon: any; gradient: string; text: string; bg: string }> = {
  Hackathon: { icon: Code, gradient: "from-amber-500 to-red-500", text: "text-amber-600", bg: "bg-amber-50" },
  Workshop: { icon: Laptop, gradient: "from-blue-500 to-indigo-500", text: "text-blue-600", bg: "bg-blue-50" },
  Seminar: { icon: Presentation, gradient: "from-emerald-500 to-teal-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  Tech: { icon: Zap, gradient: "from-purple-500 to-indigo-600", text: "text-purple-600", bg: "bg-purple-50" },
  Cultural: { icon: Music, gradient: "from-pink-500 to-rose-500", text: "text-pink-600", bg: "bg-pink-50" },
  Competition: { icon: Trophy, gradient: "from-orange-500 to-amber-600", text: "text-orange-600", bg: "bg-orange-50" },
  Academic: { icon: BookOpen, gradient: "from-cyan-500 to-blue-600", text: "text-cyan-600", bg: "bg-cyan-50" },
};

export function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(data))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter events by selected tab
  const filteredEvents = events.filter((e) => {
    if (selectedCategory === "All") return true;
    return e.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const featuredList = filteredEvents.slice(0, 6);

  function handleHeroSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/events");
    }
  }

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 pt-12 pb-24 text-white">
        {/* Glowing Background Orbs & Ambient Mesh */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-600/30 to-purple-600/20 blur-[120px] animate-pulse-slow" />
        <div className="pointer-events-none absolute -bottom-10 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />
        
        <div className="container-page relative z-10 flex flex-col items-center text-center">
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md shadow-lg shadow-blue-500/10 animate-float mb-6">
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span>#1 Campus Event & Hackathon Hub</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Main Title */}
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[1.15]">
            Discover, Connect & <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Experience Great Events
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
            From high-stakes hackathons to interactive tech workshops and expert seminars — book your spot in seconds with instant digital passes.
          </p>

          {/* Hero Interactive Live Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-xl shadow-2xl sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 px-3 py-1">
              <Search className="h-5 w-5 text-blue-400 shrink-0" />
              <input
                type="text"
                placeholder="Search hackathons, workshops, coding events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/30"
            >
              <span>Explore Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span>Popular:</span>
            {["Hackathon", "AI & ML", "Web Dev", "Seminars"].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/events?search=${tag}`)}
                className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-slate-300 hover:border-blue-500/50 hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats Metrics Counter Row */}
          <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-4 border-t border-slate-800/80 pt-10 sm:grid-cols-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-white">500+</span>
              <span className="mt-1 text-xs text-slate-400 font-medium">Events Published</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-blue-400">15K+</span>
              <span className="mt-1 text-xs text-slate-400 font-medium">Seats Booked</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-indigo-400">50+</span>
              <span className="mt-1 text-xs text-slate-400 font-medium">Verified Colleges</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-purple-400">99.8%</span>
              <span className="mt-1 text-xs text-slate-400 font-medium">User Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section className="container-page py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">Featured Events</h2>
          </div>

          {/* Category Tab Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {["All", "Hackathon", "Workshop", "Seminar", "Tech"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid or Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-slate-500">Fetching live events...</p>
          </div>
        ) : featuredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Calendar className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No events found in this category</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              Check back soon or explore all active listings across all campus categories.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setSelectedCategory("All")}
            >
              Reset Category
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredList.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/events">
            <Button size="lg" className="gap-2 bg-slate-900 hover:bg-slate-800 shadow-lg px-8">
              <span>View All Available Events</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="border-y border-slate-200/80 bg-white py-16">
        <div className="container-page">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Explore By Category
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Find exactly what aligns with your learning goals, career aspirations, or creative passions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {EVENT_CATEGORIES.map((category) => {
              const meta = categoryMeta[category] || {
                icon: Zap,
                gradient: "from-blue-500 to-indigo-600",
                text: "text-blue-600",
                bg: "bg-blue-50",
              };
              const CategoryIcon = meta.icon;

              return (
                <Link
                  key={category}
                  to={`/events?category=${category}`}
                  className="group relative flex flex-col items-start rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.bg} ${meta.text} mb-4 transition-transform group-hover:scale-110`}
                  >
                    <CategoryIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {category}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 font-medium">Explore events</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Browse</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY EVENTHUB / FEATURES GRID */}
      <section className="container-page py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Built For Campus Excellence</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            Why Students & Organizers Love EventHub
          </h2>
          <p className="mt-2 text-slate-500 text-sm">
            Everything you need for seamless registration, real-time ticket management, and unforgettable event experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-5">
              <Ticket className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant Pass Booking</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Book tickets in one click and access your digital QR pass anytime under your dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-5">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Top Campus Hackathons</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Participate in flagship university hackathons, showcase your projects, and win certificates.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Verified Hosts Only</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              All listed events are verified for genuine venues, valid schedules, and official university credentials.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-5">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Live Seat Tracking</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Real-time seat counters ensure fair booking and instant updates for limited-capacity workshops.
            </p>
          </div>
        </div>
      </section>

      {/* DUAL CTA BANNER */}
      <section className="container-page py-10 mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md mb-4">
                <Award className="h-3.5 w-3.5 text-amber-400" />
                For Organizers & Campus Leads
              </span>
              <h2 className="text-3xl font-black sm:text-4xl tracking-tight leading-tight">
                Planning to Host a Workshop or Hackathon?
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Create an organizer account, publish your event in minutes, and manage student registrations with live analytics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-xl shadow-blue-500/25">
                  Become an Organizer
                </Button>
              </Link>
              <Link to="/events" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full text-white border-white/30 hover:bg-white/10">
                  Explore All Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="border-t border-slate-200/80 bg-white py-16">
        <div className="container-page text-center max-w-xl mx-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mx-auto mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Never Miss Great Events</h2>
          <p className="mt-2 text-xs text-slate-500">
            Get weekly alerts about upcoming hackathons, flagship workshops, and early-bird ticket releases.
          </p>

          <form onSubmit={handleNewsletter} className="mt-6 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>

          {isSubscribed && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Awesome! You are now subscribed to EventHub alerts.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
