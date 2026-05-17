import React, { useState } from "react";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Play, Menu, X, Home, Tv, Wrench as FixIt,
  Users, Radio, HomeIcon, Navigation, BookOpen, Hammer,
  Code, Globe, Coins, Briefcase, Heart, Smile, Share2,
  Activity, Award, Target, ShieldCheck, UsersRound,
} from "lucide-react";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();
const BASE = import.meta.env.BASE_URL;
const APP_URL = "https://app.chargingthefuture.com";
const HERO_IMG = `${BASE}hero-walking-dead.png`;

// Exact colors from the app (Desktop.tsx MINI_APPS)
const FEATURES: {
  id: string; name: string; emoji: string; icon: React.ElementType;
  color: string; bg: string; desc: string;
  youtubeId?: string; protonLink?: string;
}[] = [
  { id: "hub",           name: "Hub",             emoji: "🏠", icon: Users,      color: "#38BDF8", bg: "#011c26", desc: "The main community: AI-powered chat, safe channels, 5M members. Your base camp.", youtubeId: "Z9Gw3Jz0ids" },
  { id: "chyme",         name: "Chyme",            emoji: "🎙️", icon: Radio,      color: "#22C55E", bg: "#052e16", desc: "Live social audio rooms. Record, broadcast, listen, and connect in real time.", youtubeId: "oVESU60zbPg" },
  { id: "lighthouse",    name: "LightHouse",       emoji: "🏠", icon: HomeIcon,   color: "#EAB308", bg: "#1c1407", desc: "Safe and verified housing listings. Community trust scores so you know your neighbors.", youtubeId: "KfyZsemVU8A" },
  { id: "trusttransport",name: "TrustTransport",   emoji: "📦", icon: Navigation, color: "#F97316", bg: "#1c0a03", desc: "Vetted transportation for safe travel. Drivers screened by the community, for the community.", youtubeId: "myHI3xB-fMQ" },
  { id: "directory",     name: "Directory",        emoji: "📇", icon: BookOpen,   color: "#3B82F6", bg: "#0c1a3d", desc: "Skills directory and professional listings. Find a survivor-run service for almost anything.", youtubeId: "W1cZm9F0D78" },
  { id: "foundation",    name: "Foundation",       emoji: "🪛", icon: Hammer,     color: "#EF4444", bg: "#1c0505", desc: "Tools, repairs, and infrastructure support. Logs changes in your area so nothing happens in the dark.", youtubeId: "n4Tkw01PmX8" },
  { id: "peerprog",      name: "Peer Programming", emoji: "🏘️", icon: Code,       color: "#8B5CF6", bg: "#150d2e", desc: "Tech mentorship and coding support. Weekly global masterminds — survivors teaching survivors.", youtubeId: "ReJ-HjM4dvo" },
  { id: "gdp",           name: "GDP",              emoji: "🗺️", icon: Globe,      color: "#06B6D4", bg: "#011c26", desc: "Real-time $300B global survivor economic tracker. Your contributions counted, recorded, visible." },
  { id: "credits",       name: "Service Credits",  emoji: "⚙️", icon: Coins,      color: "#F59E0B", bg: "#1c1200", desc: "Alternative economy and credits exchange. Trade value inside the network — no outside systems needed." },
  { id: "workforce",     name: "Workforce",        emoji: "💼", icon: Briefcase,  color: "#6366F1", bg: "#0e0f30", desc: "Trafficking-informed job matching. Employers vetted for survivor-safe workplaces.", protonLink: "https://drive.proton.me/urls/2C3V6KQZDC#IPmuHxdRmzOh" },
  { id: "gentlepulse",   name: "GentlePulse",      emoji: "💚", icon: Heart,      color: "#14B8A6", bg: "#011c1a", desc: "Wellness check-ins and emotional support. Gentle, consistent, non-intrusive." },
  { id: "mood",          name: "Mood",             emoji: "😁", icon: Smile,      color: "#EC4899", bg: "#1c0416", desc: "Anonymous mood tracking and pattern awareness. Know yourself. See patterns. Take back control." },
  { id: "socketrelay",   name: "SocketRelay",      emoji: "🔂", icon: Share2,     color: "#F43F5E", bg: "#1c0409", desc: "Mutual aid network for urgent needs. Real-time resource sharing when it matters most.", youtubeId: "WTXpioRV2Bw" },
  { id: "feed",          name: "Feed",             emoji: "📣", icon: Activity,   color: "#8B5CF6", bg: "#150d2e", desc: "Community announcements and opportunities. Signal only — no noise, no algorithm games.", youtubeId: "l4tE1eLco6k" },
  { id: "skillshunt",    name: "Skills Hunt",      emoji: "🎓", icon: Award,      color: "#A855F7", bg: "#1a0d2e", desc: "Skill discovery, credentialing, and education. Learn, prove it, get paid for it.", youtubeId: "OfojmleoDEc" },
  { id: "levelup",       name: "LevelUp",          emoji: "🎯", icon: Target,     color: "#22C55E", bg: "#052e16", desc: "Goal tracking and progress milestones. Your journey, documented and celebrated." },
  { id: "trust",         name: "Trust",            emoji: "🛡️", icon: ShieldCheck,color: "#0EA5E9", bg: "#011826", desc: "Community reputation and verification. Trust signals built through real participation — your credibility, visible and portable." },
];

// All 50 problems from the original repo (chargingthefuture/landing-page)
const LOOK_MA_ITEMS: { q: string; solutions: string[] }[] = [
  { q: "Do idiots constantly try to get close to you physically, while aiming their cell phones at you and/or staring at their cell phones while invading your personal space?", solutions: ["GentlePulse", "Chyme"] },
  { q: "Do your co-workers that you have always been friendly with, suddenly start acting strange towards you and distancing themselves from you? Or they begin to lie about your work performance, try to get you to quit or begin bumping shoulders with you?", solutions: ["Workforce", "Directory"] },
  { q: "Do idiots sit parked in their cars outside your home all the time?", solutions: ["LightHouse"] },
  { q: "Do morons constantly get in your way and block you from where you are going out in public? / cut you in line? / hold up the line?", solutions: ["SocketRelay", "Directory", "Workforce"] },
  { q: "Did all your neighbors suddenly move, have their houses quickly sold and construction work done on them, then quickly have 'new neighbors' (who don't seem to live there) move in?", solutions: ["LightHouse"] },
  { q: "Have any new street lamps/antennas been installed around your home/work recently?", solutions: ["LightHouse"] },
  { q: "Do drones hover around you/your home/work all the time?", solutions: ["LightHouse"] },
  { q: "Do you experience tinnitus/ringing in ears?", solutions: ["GentlePulse", "Directory"] },
  { q: "Do police officers follow/harass you for no good reason?", solutions: ["GentlePulse", "Directory", "Chyme"] },
  { q: "Do your neighbors always seem to come outside when you are there, then go inside when you do?", solutions: ["LightHouse"] },
  { q: "Do different people seem to be coming and going from neighbors houses around you all the time?", solutions: ["LightHouse"] },
  { q: "Do several of your neighbors have strange colored lights coming out their windows at night?", solutions: ["LightHouse"] },
  { q: "Do people you don't know stare at you strangely/treat you bad for no reason?", solutions: ["SupportMatch", "GentlePulse"] },
  { q: "Are new people pushing hard for you to be their new friend/roommate/romantic partner?", solutions: ["SupportMatch", "GentlePulse", "Chyme"] },
  { q: "Do people seem to know things about you that you have never told them before?", solutions: ["SupportMatch", "GentlePulse", "Chyme"] },
  { q: "Do people you don't know constantly try to talk to you/befriend you while you are out in public?", solutions: ["SupportMatch", "GentlePulse", "Chyme"] },
  { q: "Do strange things happen around you a lot? People fighting/arguing in the streets/causing scenes that are scripted/staged? With occasional onlookers smirking or re-enacting the scripted scenes?", solutions: ["LightHouse"] },
  { q: "Do you get denied jobs/housing for no good reason?", solutions: ["Workforce", "Directory", "LightHouse"] },
  { q: "Do you live close to a freemason lodge? Or know someone who is a freemason?", solutions: ["LightHouse"] },
  { q: "Does trying to do simple things like fill out an online job application become an ordeal due to endless clicking that brings you nowhere? Or website conveniently won't load when you try to submit applications or important documents?", solutions: ["Workforce", "Directory"] },
  { q: "Do doctors deny you proper care? / ghost you? / tell you you are fine when you know something is wrong? / not get back to you with test results, then claim to have never received them, or have 'no record' of them?", solutions: ["Workforce", "Directory"] },
  { q: "Do you hear strange humming/buzzing noises/sound of a machine running around you a lot, but can't pinpoint exactly where it's coming from?", solutions: ["GentlePulse"] },
  { q: "Does your mail get lost/tampered with a lot?", solutions: ["Workforce", "Directory"] },
  { q: "Do you get tired more than you should?", solutions: ["GentlePulse", "LightHouse"] },
  { q: "Do people try to bait you into doing drugs? Buying a gun? Buying self-defense gear? Drinking? Committing illegal acts?", solutions: ["SupportMatch", "GentlePulse", "Chyme"] },
  { q: "If you are a woman, do perverted guys you don't know or just met straight up ask you for sex?", solutions: ["SupportMatch", "GentlePulse", "Chyme"] },
  { q: "If you are sitting in your car minding your own business do idiots come and park right by/next to you and sit there too? Usually buried in their phone? Even if you are parked in an isolated area?", solutions: ["SupportMatch", "GentlePulse", "Chyme"] },
  { q: "Do idiots constantly shine their bright headlights/flashlights/DEWs on you?", solutions: ["TrustTransport"] },
  { q: "Do you often pull up to an empty store, and then it suddenly becomes busy after you go in? Even at non busy business hours?", solutions: ["SocketRelay", "Workforce", "Directory"] },
  { q: "Do weirdos try to get you to say bad things about other people? Or force a conversation about sex, politics or celebrities as if they are recording you?", solutions: ["SupportMatch", "Chyme"] },
  { q: "Have you been falsely accused of shoplifting, then still treated like a criminal after you have proven you did not steal anything?", solutions: ["SupportMatch", "Chyme"] },
  { q: "Do you notice strange flashes of light wherever you go? Or at home/work?", solutions: ["SupportMatch", "Chyme", "LightHouse"] },
  { q: "Does everyone around you seem to be keeping some sort of a secret?", solutions: ["SupportMatch", "Directory", "Chyme"] },
  { q: "Do weirdos offer you rides/solicit you for prostitution when you are just trying to walk down the street? Even during the day?", solutions: ["TrustTransport", "SupportMatch", "Chyme"] },
  { q: "Do you get strange phone calls/texts from numbers you don't know a lot?", solutions: ["SupportMatch", "Chyme"] },
  { q: "Do your pets seem to sense that something is off/someone you don't know is near?", solutions: ["SupportMatch", "LightHouse", "Chyme"] },
  { q: "Do people seem like they are only pretending to be your friend/partner?", solutions: ["SupportMatch", "Directory"] },
  { q: "Do store/hotel clerks suddenly act strangely when you give your name/id?", solutions: ["SupportMatch"] },
  { q: "If you go to Walmart/Target do the theft detectors beep once quickly when you walk in?", solutions: ["SupportMatch", "SocketRelay"] },
  { q: "Do people like to waste your time, sending you on wild goose chases to accomplish simple tasks/appointments?", solutions: ["Workforce", "SocketRelay", "Directory"] },
  { q: "Anytime you have to call a customer service you are put on hold forever only to be hung up on and start the cycle again and again?", solutions: ["Workforce", "Directory"] },
  { q: "Do you have an unusually large amount of car problems?", solutions: ["Directory"] },
  { q: "Do items disappear, then reappear weeks/months later?", solutions: ["SocketRelay", "LightHouse"] },
  { q: "Do people you've never introduced yourself to somehow already know your name?", solutions: ["SupportMatch", "Chyme"] },
  { q: "Do you experience unexplained bruising/cuts/pain/injuries?", solutions: ["GentlePulse", "Directory"] },
  { q: "Do you notice Jehovah Witnesses following you and/or lurking in your neighborhood that were not there previously?", solutions: ["LightHouse"] },
  { q: "Do motorcycles, fire trucks and police cars with sirens circle around you?", solutions: ["LightHouse", "GentlePulse"] },
  { q: "Do idiots mirror your behavior and how you dress and follow you around in public?", solutions: ["LightHouse", "Directory", "Workforce"] },
  { q: "Do idiot acquaintances/family you have not seen in decades, or family members you never met, try to force their way into your life?", solutions: ["LightHouse", "Directory", "Workforce", "GentlePulse"] },
  { q: "Do weirdos issue attack or guard commands to have dogs bark or whimper at your presence?", solutions: ["LightHouse", "GentlePulse"] },
];

// Map feature names to their colors for the solution badges
const FEATURE_COLOR_MAP: Record<string, string> = {
  "Hub":            "#38BDF8",
  "Chyme":          "#22C55E",
  "LightHouse":     "#EAB308",
  "Lighthouse":     "#EAB308",
  "TrustTransport": "#F97316",
  "Directory":      "#3B82F6",
  "Foundation":     "#EF4444",
  "Peer Programming": "#8B5CF6",
  "GDP":            "#06B6D4",
  "Service Credits": "#F59E0B",
  "Workforce":      "#6366F1",
  "Workforce Recruiter": "#6366F1",
  "GentlePulse":    "#14B8A6",
  "GentlePusle":    "#14B8A6",
  "Mood":           "#EC4899",
  "SocketRelay":    "#F43F5E",
  "Feed":           "#8B5CF6",
  "Skills Hunt":    "#A855F7",
  "SkillsHunt":     "#A855F7",
  "LevelUp":        "#22C55E",
  "SupportMatch":   "#0EA5E9",
  "Trust":          "#0EA5E9",
  "LostMail":       "#9CA3AF",
};

function NavBar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/look-ma", label: "Look Ma, I Fixed It", icon: FixIt },
    { href: "/demos", label: "17 Demos", icon: Tv },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b-4 border-foreground">
      <div className="flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-2xl md:text-3xl font-display uppercase tracking-wider hover:opacity-80 transition-opacity">
          <span className="text-primary">Charging</span> The Future
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-bold uppercase tracking-widest text-sm px-4 py-2 border-2 transition-all ${
                location === href
                  ? "border-primary bg-primary text-black"
                  : "border-transparent hover:border-foreground text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href={APP_URL}
            className="ml-4 brutal-border brutal-shadow-primary brutal-shadow-hover bg-primary text-black font-bold py-2 px-5 uppercase tracking-widest text-sm flex items-center gap-2"
          >
            Open App <ArrowRight size={16} strokeWidth={3} />
          </a>
        </div>
        <button className="md:hidden p-2 brutal-border" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t-4 border-foreground bg-background overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`font-bold uppercase tracking-widest flex items-center gap-3 p-3 border-2 ${
                    location === href ? "border-primary bg-primary text-black" : "border-foreground text-foreground"
                  }`}
                >
                  <Icon size={18} /> {label}
                </Link>
              ))}
              <a
                href={APP_URL}
                className="brutal-border brutal-shadow-primary bg-primary text-black font-bold py-3 px-5 uppercase tracking-widest text-center flex items-center justify-center gap-2 mt-2"
              >
                Open App <ArrowRight size={16} strokeWidth={3} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function StatMarquee() {
  const stats = ["5M Survivors", "$300B Economy", "127 Countries", "17 Apps, One Account", "Free to join", "Invite Only"];
  const doubled = [...stats, ...stats];
  return (
    <div className="border-y-4 border-foreground bg-secondary py-5 overflow-hidden flex whitespace-nowrap">
      <motion.div
        className="flex gap-12 items-center text-secondary-foreground font-display text-3xl md:text-4xl uppercase tracking-wider"
        animate={{ x: [0, "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {doubled.map((s, i) => (
          <span key={i} className="flex-shrink-0">{s} <span className="text-background/50 mx-2">★</span></span>
        ))}
      </motion.div>
    </div>
  );
}

function YouTubeFacade({ youtubeId, name, color }: { youtubeId: string; name: string; color: string }) {
  const [active, setActive] = useState(false);
  const thumb = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  if (active) {
    return (
      <div className="relative w-full aspect-video border-4 border-foreground overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1`}
          title={`${name} Demo`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="relative w-full aspect-video border-4 border-foreground overflow-hidden cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
      onClick={() => setActive(true)}
      aria-label={`Play ${name} demo`}
    >
      <img
        src={thumb}
        alt={`${name} demo thumbnail`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div
          className="w-16 h-16 border-4 border-black flex items-center justify-center brutal-shadow transition-transform group-hover:scale-110 group-focus-visible:scale-110"
          style={{ background: color }}
        >
          <Play size={24} fill="black" className="text-black ml-1" />
        </div>
        <span className="font-bold text-xs uppercase tracking-widest text-white/80">{name} Demo</span>
      </div>
    </button>
  );
}

function VideoPlaceholder({ name, color }: { name: string; color: string }) {
  return (
    <div className="relative w-full aspect-video border-4 border-foreground bg-zinc-900 overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
        <div
          className="w-16 h-16 border-4 border-black flex items-center justify-center brutal-shadow transition-transform group-hover:scale-110"
          style={{ background: color }}
        >
          <Play size={24} fill="black" className="text-black ml-1" />
        </div>
        <span className="font-bold text-xs uppercase tracking-widest text-white/60">{name} Demo</span>
      </div>
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}18 0%, #000 100%)` }} />
      <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-bold uppercase text-white/25">
        <span>YouTube Demo</span>
        <span>Coming Soon</span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-background py-12 px-6 border-t-4 border-foreground">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-display text-3xl uppercase tracking-wider">
          <span className="text-primary">Charging</span> The Future
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/demos" className="hover:text-foreground transition-colors">17 Demos</Link>
          <Link href="/look-ma" className="hover:text-foreground transition-colors">Look Ma, I Fixed It</Link>
          <a href="https://github.com/chargingthefuture/chargingthefuture" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub ↗</a>
          <a href={APP_URL} className="hover:text-primary transition-colors text-primary">Open App →</a>
        </div>
        <p className="text-muted-foreground uppercase font-bold tracking-widest text-xs">
          Built by us. For us. © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      {/* HERO — split screen */}
      <section className="pt-20 min-h-screen flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen overflow-hidden">
          <img
            src={HERO_IMG}
            alt="Chapter One — Survivor community rising"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute top-6 left-6 bg-white text-black border-4 border-black p-3 max-w-[200px] brutal-shadow">
            <p className="font-bold text-xs uppercase leading-tight">CHAPTER ONE:</p>
            <p className="text-xs leading-tight mt-1">The people around us changed. But we survived.</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background hidden md:block" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 bg-background relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/15 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-secondary/15 blur-[80px]" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 max-w-2xl"
          >
            <div className="inline-block border-4 border-accent bg-accent/10 text-accent font-bold px-4 py-2 uppercase tracking-widest mb-8 brutal-shadow text-sm">
              World's First Psyop-Free TI Economy
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display leading-[0.88] uppercase text-white mb-6 md:mb-8">
              The Next<br />
              <span className="text-primary">Shield</span><br />
              In Your<br />
              Corner.
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mb-8 md:mb-10 leading-relaxed">
              Not a charity. Not a support group. An invite-only circular economy that turns survivors into active participants in a $300B opportunity — built from the ground up with 17 features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <a
                href={APP_URL}
                className="brutal-border brutal-shadow-primary brutal-shadow-hover bg-primary text-black font-bold py-4 px-8 text-lg uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                Claim Your Access <ArrowRight strokeWidth={3} size={20} />
              </a>
              <Link
                href="/demos"
                className="brutal-border brutal-shadow brutal-shadow-hover bg-transparent text-foreground font-bold py-4 px-8 text-lg uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                See All 17 Apps
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> Invite Only</span>
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> WCAG AAA</span>
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> 5M Survivors</span>
            </div>
          </motion.div>
        </div>
      </section>

      <StatMarquee />

      {/* 17 Apps teaser */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 mb-16"
        >
          <div className="max-w-2xl">
            <div className="inline-block border-4 border-primary bg-primary/10 text-primary font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
              The Arsenal
            </div>
            <h2 className="text-5xl md:text-6xl font-display uppercase mb-6 leading-[0.9]">
              17 Apps.<br /><span className="text-secondary">One</span> Account.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We don't need another forum. We need infrastructure. Every feature is a shield against isolation, financial drain, and surveillance. We built all 17. Watch them in action.
            </p>
          </div>
          <Link
            href="/demos"
            className="w-full lg:w-auto flex-shrink-0 brutal-border brutal-shadow-secondary brutal-shadow-hover bg-secondary text-white font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
          >
            Watch All 17 Demos <ArrowRight strokeWidth={3} size={20} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FEATURES.slice(0, 8).map((feat, i) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/demos#${feat.id}`}
                className="block border-4 border-foreground group hover:-translate-y-1 transition-transform duration-200"
                style={{ background: feat.bg, boxShadow: `4px 4px 0px 0px ${feat.color}` }}
              >
                {feat.youtubeId && (
                  <div className="relative w-full aspect-video overflow-hidden border-b-4 border-foreground">
                    <img
                      src={`https://img.youtube.com/vi/${feat.youtubeId}/mqdefault.jpg`}
                      alt={`${feat.name} demo`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div
                        className="w-10 h-10 border-2 border-white flex items-center justify-center"
                        style={{ background: feat.color }}
                      >
                        <Play size={16} fill="black" color="black" strokeWidth={0} />
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-3 flex items-center gap-3">
                  <div
                    className="w-8 h-8 border-2 border-foreground flex items-center justify-center flex-shrink-0"
                    style={{ background: `${feat.color}25` }}
                  >
                    <feat.icon size={16} style={{ color: feat.color }} />
                  </div>
                  <span className="font-display text-base uppercase leading-tight">{feat.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/demos" className="text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-sm underline decoration-2 underline-offset-4 inline-flex items-center gap-2">
            + 9 more apps — see all 17 demos <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Look Ma teaser */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-card/40 border-y-4 border-foreground">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-block border-4 border-accent bg-accent/10 text-accent font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
              You Know The Patterns
            </div>
            <h2 className="text-5xl md:text-6xl font-display uppercase mb-6 leading-[0.9]">
              <span className="text-accent">Look Ma,</span><br />I Fixed It!
            </h2>
            <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
              50 real problems survivors experience — strange cars, workplace sabotage, new antennas on your block, dogs being commanded to bark at you. You've noticed. We've built the answer for every single one.
            </p>
            <p className="text-lg font-bold text-foreground/80">
              Click each problem. See exactly which feature of the app solves it.
            </p>
          </div>
          <Link
            href="/look-ma"
            className="w-full lg:w-auto flex-shrink-0 brutal-border brutal-shadow-accent brutal-shadow-hover bg-accent text-black font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
          >
            See All 50 Fixes <ArrowRight strokeWidth={3} size={20} />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 md:px-12 bg-primary border-t-4 border-foreground text-black text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-display uppercase mb-6 md:mb-8 leading-[0.9]">
            Stop Surviving.<br />Start Thriving.
          </h2>
          <p className="text-lg md:text-2xl font-bold mb-8 md:mb-12 max-w-2xl mx-auto">
            The platform is live. The community is waiting. You've already fought the hard battles — now it's time to build.
          </p>
          <a
            href={APP_URL}
            className="inline-flex items-center gap-3 border-4 border-black bg-white text-black font-bold py-4 px-8 md:py-6 md:px-12 text-lg md:text-2xl uppercase tracking-widest hover:bg-black hover:text-white transition-colors brutal-shadow"
          >
            Enter The App <ArrowRight strokeWidth={3} size={22} />
          </a>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "30px 30px" }} />
      </section>

      <Footer />
    </div>
  );
}

function DemosPage() {
  const [location] = useLocation();

  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const attempt = (tries: number) => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries > 0) {
        requestAnimationFrame(() => attempt(tries - 1));
      }
    };
    requestAnimationFrame(() => attempt(10));
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      <div className="pt-32 pb-8 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-block border-4 border-secondary bg-secondary/10 text-secondary font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
            The Arsenal — All 17
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display uppercase mb-6 leading-[0.9]">
            17 Apps.<br /><span className="text-secondary">One</span> Account.<br />All Demos.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mb-4 leading-relaxed">
            Every feature of Survivor Hub has its own walkthrough demo. Watch how each tool works — built by survivors, for survivors.
          </p>
          <a href={APP_URL} className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm underline decoration-2 underline-offset-4 hover:text-white transition-colors">
            Ready? Open the App <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>

      <div className="px-6 md:px-12 lg:px-24 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.id}
              id={feat.id}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="border-4 border-foreground flex flex-col h-full hover:-translate-y-1 hover:-translate-x-[2px] transition-all duration-200"
              style={{ background: feat.bg, boxShadow: `6px 6px 0px 0px ${feat.color}` }}
            >
              <div className="p-6 flex items-center gap-4 border-b-4 border-foreground">
                <div
                  className="w-12 h-12 border-4 border-foreground flex items-center justify-center flex-shrink-0"
                  style={{ background: `${feat.color}25` }}
                >
                  <feat.icon size={24} style={{ color: feat.color }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    App {String(i + 1).padStart(2, "0")} of 17
                  </div>
                  <h3 className="text-2xl font-display uppercase leading-none" style={{ color: feat.color }}>
                    {feat.emoji} {feat.name}
                  </h3>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <p className="text-muted-foreground text-base leading-relaxed">{feat.desc}</p>
              </div>
              <div className="px-6 pb-6">
                {feat.youtubeId ? (
                  <YouTubeFacade youtubeId={feat.youtubeId} name={feat.name} color={feat.color} />
                ) : feat.protonLink ? (
                  <div className="relative w-full aspect-video border-4 border-foreground bg-zinc-900 overflow-hidden flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${feat.color}18 0%, #000 100%)` }}>
                    <a
                      href={feat.protonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 border-4 border-foreground font-bold uppercase tracking-widest px-6 py-4 text-base transition-all hover:-translate-y-1"
                      style={{ background: feat.color, color: "#000", boxShadow: `4px 4px 0px 0px #fff` }}
                    >
                      Watch Demo <ArrowRight size={18} strokeWidth={3} />
                    </a>
                  </div>
                ) : (
                  <VideoPlaceholder name={feat.name} color={feat.color} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <section className="py-20 px-6 md:px-12 bg-secondary border-t-4 border-foreground text-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display uppercase mb-6 leading-[0.9]">
            Seen enough?<br /><span className="text-primary">Join us.</span>
          </h2>
          <a
            href={APP_URL}
            className="inline-flex items-center gap-3 brutal-border bg-primary text-black font-bold py-4 px-8 md:py-5 md:px-10 text-lg md:text-xl uppercase tracking-widest brutal-shadow hover:-translate-y-1 transition-transform"
          >
            Claim Your Access <ArrowRight strokeWidth={3} size={22} />
          </a>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      </section>

      <Footer />
    </div>
  );
}

function LookMaPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      <section className="pt-32 pb-12 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-block border-4 border-accent bg-accent/10 text-accent font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
              You're Not Imagining It
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display uppercase mb-6 md:mb-8 leading-[0.88]">
              <span className="text-accent">Look Ma,</span><br />I Fixed It!
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              50 problems. 50 answers. Everything you've experienced — the stalking, the workplace sabotage, the neighbors, the lights, the vehicles — we built a feature in Survivor Hub for every single one. Click any problem to see the fix.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col gap-3">
          {LOOK_MA_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="border-4 border-foreground bg-card cursor-pointer transition-all duration-200"
              style={active === i ? { boxShadow: `6px 6px 0px 0px hsl(var(--accent))` } : { boxShadow: `4px 4px 0px 0px hsl(var(--foreground))` }}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="p-5 md:p-6 flex justify-between items-center gap-4">
                <div className="flex items-start gap-4">
                  <span className="font-display text-3xl text-accent flex-shrink-0 leading-none mt-1 min-w-[2rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-bold text-base md:text-lg leading-snug">
                    {item.q}
                  </h3>
                </div>
                <div
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center border-4 border-foreground text-xl font-bold transition-all duration-300"
                  style={active === i ? { background: "hsl(var(--accent))", color: "black", transform: "rotate(45deg)" } : {}}
                >
                  +
                </div>
              </div>

              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t-4 border-foreground bg-accent/10 p-5 md:p-6">
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Fixed by:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.solutions.map((sol) => {
                          const c = FEATURE_COLOR_MAP[sol] || "#9CA3AF";
                          return (
                            <span
                              key={sol}
                              className="font-bold px-3 py-1 text-sm uppercase tracking-widest border-2"
                              style={{ borderColor: c, color: c, background: `${c}18` }}
                            >
                              {sol}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 lg:px-24 border-t-4 border-foreground bg-card/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-display uppercase mb-4 leading-[0.9]">
              Want to see<br /><span className="text-primary">all 17 apps</span> in action?
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg">
              Every feature above has a full walkthrough demo. Watch how it works before you join.
            </p>
          </div>
          <div className="flex flex-col gap-4 flex-shrink-0">
            <Link
              href="/demos"
              className="brutal-border brutal-shadow-primary brutal-shadow-hover bg-primary text-black font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
            >
              Watch All 17 Demos <ArrowRight strokeWidth={3} />
            </Link>
            <a
              href={APP_URL}
              className="brutal-border brutal-shadow brutal-shadow-hover bg-transparent text-foreground font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
            >
              Join The App <ArrowRight strokeWidth={3} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/demos" component={DemosPage} />
      <Route path="/look-ma" component={LookMaPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
