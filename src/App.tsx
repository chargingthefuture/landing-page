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
  ListChecks, Award, Target, ShieldCheck, UsersRound, AlertTriangle,
  Download, MessageSquare, Send, RotateCcw, Sparkles,
} from "lucide-react";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();
const BASE = import.meta.env.BASE_URL;
const APP_URL = "https://app.chargingthefuture.com";
const ANDROID_URL = "https://github.com/chargingthefuture/chargingthefuture/releases";
const HERO_IMG = `${BASE}hero-image.png`;

// Plugin accent (color) and background (bg) values match the canonical
// App | Accent | Background table in the design repo's DESIGN_GUIDE.md
// (artifacts/mockup-sandbox/DESIGN_GUIDE.md), not the mockup Desktop.tsx
// MINI_APPS values (which are deprecated where they differ). The bg is the
// accent RGB channel × 0.11 per that table. Hub uses #7C3AED (resolved from a
// prior #38BDF8 collision with TrustTransport). Plugins not featured here
// (Unlock, SkillsTaxonomy, Account & Data) live only in the design table.
//
// SOURCE OF TRUTH NOTE (read before editing this array):
//   • Demo links (youtubeId / protonLink) and plugin descriptions (desc) live HERE,
//     in this file — NOT in the design repo (github.com/chargingthefuture/design).
//   • The design mocks are intentionally out of date on demo links (they change
//     frequently) and on copy. Do NOT sync demo links or descriptions from design.
//   • Plugin descriptions are owned by the maintainer and edited directly in code.
//     Do NOT modify any existing `desc` without explicit approval.
const FEATURES: {
  id: string; name: string; emoji: string; icon: React.ElementType;
  color: string; bg: string; desc: string;
  youtubeId?: string; protonLink?: string;
}[] = [
  { id: "hub",           name: "Hub",             emoji: "🏠", icon: Users,      color: "#7C3AED", bg: "#0E061A", desc: "Ask a question and get AI-powered answers from our community. Your base camp.", youtubeId: "Z9Gw3Jz0ids" },
  { id: "chyme",         name: "Chyme",            emoji: "🎙️", icon: Radio,      color: "#22C55E", bg: "#04160A", desc: "Live social audio rooms. Broadcast, listen, and connect in real time.", youtubeId: "oVESU60zbPg" },
  { id: "lighthouse",    name: "LightHouse",       emoji: "🏠", icon: HomeIcon,   color: "#60A5FA", bg: "#0B121C", desc: "Verified survivor housing listings.", youtubeId: "KfyZsemVU8A" },
  { id: "trusttransport",name: "TrustTransport",   emoji: "📦", icon: Navigation, color: "#38BDF8", bg: "#06151B", desc: "Vetted transportation for safe travel. Drivers screened by the community, for the community.", youtubeId: "myHI3xB-fMQ" },
  { id: "directory",     name: "Directory",        emoji: "📇", icon: BookOpen,   color: "#93C5FD", bg: "#10161C", desc: "Browse skills across the survivor community.", youtubeId: "W1cZm9F0D78" },
  { id: "foundation",    name: "Foundation",       emoji: "🪛", icon: Hammer,     color: "#F59E0B", bg: "#1B1101", desc: "Find talent, tools, repairs, and infrastructure support in real time.", youtubeId: "n4Tkw01PmX8" },
  { id: "peerprog",      name: "PeerProgramming",  emoji: "🏘️", icon: Code,       color: "#6EE7B7", bg: "#0C1914", desc: "Weekly global mastermind sessions.", youtubeId: "ReJ-HjM4dvo" },
  { id: "gdp",           name: "GDP",              emoji: "🗺️", icon: Globe,      color: "#06B6D4", bg: "#011417", desc: "Real time $300B global survivor economic tracker. Your contributions counted, recorded, visible.", youtubeId: "cBdspGWldE4" },
  { id: "credits",       name: "ServiceCredits",   emoji: "⚙️", icon: Coins,      color: "#A855F7", bg: "#12091B", desc: "Alternative economy and credits exchange. Trade value inside the network — no outside systems needed.", youtubeId: "KytNHghNtQ8" },
  { id: "workforce",     name: "Workforce",        emoji: "💼", icon: Briefcase,  color: "#F97316", bg: "#1B0D02", desc: "Real-time work and skills distribution amongst 5 million survivors globally.", protonLink: "https://drive.proton.me/urls/2C3V6KQZDC#IPmuHxdRmzOh" },
  { id: "gentlepulse",   name: "GentlePulse",      emoji: "💚", icon: Heart,      color: "#34D399", bg: "#061711", desc: "Meditations: gentle, consistent, non-intrusive.", youtubeId: "1BIa3uxIYgU" },
  { id: "mood",          name: "Mood",             emoji: "😁", icon: Smile,      color: "#4ADE80", bg: "#08180E", desc: "Anonymous mood tracking and pattern awareness. Know yourself. See patterns. Take back control.", youtubeId: "BtUp06iEXTc" },
  { id: "socketrelay",   name: "SocketRelay",      emoji: "🔂", icon: Share2,     color: "#FB923C", bg: "#1C1007", desc: "Real-time resource sharing across the network.", youtubeId: "WTXpioRV2Bw" },
  { id: "whatworks",     name: "WhatWorks",        emoji: "✅", icon: ListChecks, color: "#84CC16", bg: "#0F1602", desc: "One shared, survivor-verified list of tools — organized by the exact problems survivors face. No ads, no affiliates." },
  { id: "skillshunt",    name: "SkillsHunt",       emoji: "🎓", icon: Award,      color: "#FBBF24", bg: "#1C1504", desc: "Discover skills across the network.", youtubeId: "OfojmleoDEc" },
  { id: "levelup",       name: "LevelUp",          emoji: "🎯", icon: Target,     color: "#10B981", bg: "#02140E", desc: "Goal tracking and progress milestones. Your journey, documented and celebrated.", youtubeId: "sZZMyDVdEvA" },
  { id: "trust",         name: "Trust",            emoji: "🛡️", icon: ShieldCheck,color: "#0EA5E9", bg: "#02121A", desc: "Community reputation and verification. Trust signals built through real participation — your credibility, visible and portable.", youtubeId: "OuPnVsQ4PnE" },
  { id: "clicklog",      name: "ClickLog",         emoji: "🚨", icon: AlertTriangle, color: "#EC4899", bg: "#1A0811", desc: "Safety check-in and incident logging — location optional. Log what happened, check in when you're safe." },
];

const LOOK_MA_ITEMS: { q: string; solutions: string[] }[] = [
  { q: "Do idiots constantly try to get close to you physically, while aiming their cell phones at you and/or staring at their cell phones while invading your personal space?", solutions: ["Hub", "Chyme", "PeerProgramming", "GentlePulse", "Mood"] },
  { q: "Do your co-workers that you have always been friendly with, suddenly start acting strange towards you and distancing themselves from you? Or they begin to lie about your work performance, try to get you to quit or begin bumping shoulders with you?", solutions: ["Directory", "PeerProgramming", "Workforce", "GentlePulse", "Mood", "LevelUp"] },
  { q: "Do idiots sit parked in their cars outside your home all the time?", solutions: ["Hub", "Chyme", "LightHouse", "PeerProgramming"] },
  { q: "Do morons constantly get in your way and block you from where you are going out in public? / cut you in line? / hold up the line?", solutions: ["ServiceCredits", "GentlePulse", "Mood", "SocketRelay"] },
  { q: "Did all your neighbors suddenly move, have their houses quickly sold and construction work done on them, then quickly have 'new neighbors' (who don't seem to live there) move in?", solutions: ["LightHouse", "GentlePulse", "Mood"] },
  { q: "Have any new street lamps/antennas been installed around your home/work recently?", solutions: ["LightHouse", "GentlePulse", "Mood"] },
  { q: "Do drones hover around you/your home/work all the time?", solutions: ["LightHouse", "GentlePulse", "Mood"] },
  { q: "Do you experience tinnitus/ringing in ears?", solutions: ["Directory", "Foundation", "PeerProgramming", "GentlePulse", "Mood"] },
  { q: "Do police officers follow/harass you for no good reason?", solutions: ["Hub", "Chyme", "LightHouse", "GentlePulse", "Mood"] },
  { q: "Do your neighbors always seem to come outside when you are there, then go inside when you do?", solutions: ["LightHouse", "GentlePulse"] },
  { q: "Do different people seem to be coming and going from neighbors houses around you all the time?", solutions: ["Hub", "Chyme", "LightHouse", "Directory", "Foundation", "PeerProgramming", "GentlePulse", "Mood", "SocketRelay"] },
  { q: "Do several of your neighbors have strange colored lights coming out their windows at night?", solutions: ["LightHouse", "Foundation", "PeerProgramming"] },
  { q: "Do people you don't know stare at you strangely/treat you bad for no reason?", solutions: ["Hub", "Chyme", "Directory", "Foundation", "PeerProgramming", "GentlePulse", "Mood", "Trust"] },
  { q: "Are new people pushing hard for you to be their new friend/roommate/romantic partner?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do people seem to know things about you that you have never told them before?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do people you don't know constantly try to talk to you/befriend you while you are out in public?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do strange things happen around you a lot? People fighting/arguing in the streets/causing scenes that are scripted/staged? With occasional onlookers smirking or re-enacting the scripted scenes?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do you get denied jobs/housing for no good reason?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do you live close to a freemason lodge? Or know someone who is a freemason?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Does trying to do simple things like fill out an online job application become an ordeal due to endless clicking that brings you nowhere? Or website conveniently won't load when you try to submit applications or important documents?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do doctors deny you proper care? / ghost you? / tell you you are fine when you know something is wrong? / not get back to you with test results, then claim to have never received them, or have 'no record' of them?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do you hear strange humming/buzzing noises/sound of a machine running around you a lot, but can't pinpoint exactly where it's coming from?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Does your mail get lost/tampered with a lot?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do you get tired more than you should?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do people try to bait you into doing drugs? Buying a gun? Buying self-defense gear? Drinking? Committing illegal acts?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "If you are a woman, do perverted guys you don't know or just met straight up ask you for sex?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "If you are sitting in your car minding your own business do idiots come and park right by/next to you and sit there too? Usually buried in their phone? Even if you are parked in an isolated area?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do idiots constantly shine their bright headlights/flashlights/DEWs on you?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do you often pull up to an empty store, and then it suddenly becomes busy after you go in? Even at non busy business hours?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do weirdos try to get you to say bad things about other people? Or force a conversation about sex, politics or celebrities as if they are recording you?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Have you been falsely accused of shoplifting, then still treated like a criminal after you have proven you did not steal anything?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do you notice strange flashes of light wherever you go? Or at home/work?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Does everyone around you seem to be keeping some sort of a secret?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do weirdos offer you rides/solicit you for prostitution when you are just trying to walk down the street? Even during the day?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do you get strange phone calls/texts from numbers you don't know a lot?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do your pets seem to sense that something is off/someone you don't know is near?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },
  
  { q: "Do people seem like they are only pretending to be your friend/partner?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do store/hotel clerks suddenly act strangely when you give your name/id?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "If you go to Walmart/Target do the theft detectors beep once quickly when you walk in?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do people like to waste your time, sending you on wild goose chases to accomplish simple tasks/appointments?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Anytime you have to call a customer service you are put on hold forever only to be hung up on and start the cycle again and again?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do you have an unusually large amount of car problems?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do items disappear, then reappear weeks/months later?", solutions: ["Hub", "Chyme", "LightHouse", "TrustTransport", "Directory", "Foundation", "PeerProgramming", "GDP", "ServiceCredits", "Workforce", "GentlePulse", "Mood", "SocketRelay", "WhatWorks", "SkillsHunt", "LevelUp", "Trust"] },

  { q: "Do people you've never introduced yourself to somehow already know your name?", solutions: ["Chyme", "Directory", "GentlePulse", "Mood", "Trust"] },
  { q: "Do you experience unexplained bruising/cuts/pain/injuries?", solutions: ["Hub", "Directory", "Foundation", "PeerProgramming", "GentlePulse", "Mood", "SocketRelay"] },
  { q: "Do you notice Jehovah Witnesses following you and/or lurking in your neighborhood that were not there previously?", solutions: ["LightHouse"] },
  { q: "Do motorcycles, fire trucks and police cars with sirens circle around you?", solutions: ["LightHouse", "TrustTransport"] },
  { q: "Do idiots mirror your behavior and how you dress and follow you around in public?", solutions: ["Hub", "Chyme", "TrustTransport", "Directory", "GentlePulse", "Mood", "Trust"] },
  { q: "Do idiot acquaintances/family you have not seen in decades, or family members you never met, try to force their way into your life?", solutions: ["Hub", "Chyme", "Directory","PeerProgramming", "GentlePulse", "Mood", "Trust"] },
  { q: "Do weirdos issue attack or guard commands to have dogs bark or whimper at your presence?", solutions: ["Hub", "Chyme", "LightHouse", "GentlePulse", "Mood"] },
  { q: "Do your banking (i.e. checking accounts) and finanical accounts (i.e. Cashapp) stop working, transactions cancelled or declined when you have funds or are closed with false reports of fraud?", solutions: ["ServiceCredits", "SocketRelay"] },
];

// Map feature names to their colors for the solution badges
const FEATURE_COLOR_MAP: Record<string, string> = {
  "Hub":            "#7C3AED",
  "Chyme":          "#22C55E",
  "LightHouse":     "#60A5FA",
  "Lighthouse":     "#60A5FA",
  "TrustTransport": "#38BDF8",
  "Directory":      "#93C5FD",
  "Foundation":     "#F59E0B",
  "PeerProgramming": "#6EE7B7",
  "GDP":            "#06B6D4",
  "ServiceCredits": "#A855F7",
  "Workforce":      "#F97316",
  "GentlePulse":    "#34D399",
  "Mood":           "#4ADE80",
  "SocketRelay":    "#FB923C",
  "WhatWorks":      "#84CC16",
  "SkillsHunt":     "#FBBF24",
  "LevelUp":        "#10B981",
  "Trust":          "#0EA5E9",
  "ClickLog":       "#EC4899",
};

// Lookup feature metadata by id (color, icon, name) for the chat variant.
const FEATURE_BY_ID: Record<string, (typeof FEATURES)[number]> = Object.fromEntries(
  FEATURES.map((f) => [f.id, f]),
);

// Chat variant data. ONE app (the Hub chat) that quietly does the work of the
// other 17 features. Each entry is a "random" question a survivor might type on
// mobile, paired with an actionable answer that demonstrates one feature WITHOUT
// naming or pitching it. Order mirrors FEATURES (excluding Hub). The `id` links
// each answer to its feature for color + an optional "open it" handoff.
const HUB_QA: { id: string; q: string; a: string }[] = [
  { id: "chyme",         q: "I feel really isolated tonight and just want to hear another human voice.", a: "There's a live audio room going right now — 14 people listening, no pressure to talk. You can just listen, or take the mic whenever you're ready. Want me to drop you in?" },
  { id: "lighthouse",    q: "I need to leave my place fast. Where's somewhere safe I can actually stay?", a: "Found 3 safe listings within 20 miles, each one vouched for by people who've stayed there. The closest has a private entrance and is open this week. Want me to flag your interest?" },
  { id: "trusttransport",q: "I have a court date Thursday, my car's dead, and I don't trust rideshare apps.", a: "Two community-screened drivers are free Thursday morning near you — both vetted by people in the network. I can hold the 8:15 pickup. Book it?" },
  { id: "directory",     q: "My laptop keeps overheating and I can't afford a repair shop.", a: "Three people near you list hardware repair — one is 6 miles out and handles overheating specifically. Here's their availability this week." },
  { id: "foundation",    q: "I need a drill and someone who can mount a security camera by tomorrow.", a: "There's a loanable drill 2 blocks away and a member who's done 40+ camera installs. They're open tomorrow afternoon. Want the intro?" },
  { id: "peerprog",      q: "I keep starting things and never finishing them. I do better around other people.", a: "There's a weekly small-group session — same time, every week, global. Next one is Sunday. I can save you a seat." },
  { id: "gdp",           q: "Does any of the work we all do here actually add up to anything?", a: "It does. The network has tracked $300B in survivor economic activity. Your part this month: 12 hours, logged and counted. Here's the live tracker." },
  { id: "credits",       q: "I'm broke but I can fix bikes. Any way to get groceries without cash?", a: "Yes — log your repairs and you earn credits you can spend inside the network. A member nearby will do a grocery run for 40 credits. Two repairs covers it." },
  { id: "workforce",     q: "I lost my job last week. I need paid work I can start right away.", a: "Six paid tasks matched to your skills are open right now. Two can start today. Want me to put you forward for the closest one?" },
  { id: "gentlepulse",   q: "My chest is tight and I can't slow my breathing down.", a: "Let's do 90 seconds together — nothing to download, no streak to keep. Breathe in for 4... I'll guide the rest. Starting now." },
  { id: "mood",          q: "I've felt off for weeks. I can't tell if it's getting worse or I'm imagining it.", a: "You're not imagining it. Your last 30 private check-ins show a clear dip every Sunday night. Here's the pattern — naming it is how you start to take control." },
  { id: "socketrelay",   q: "Someone gave me 200 masks. I don't need them all and don't want them wasted.", a: "Three members within 5 miles need exactly these right now. I can relay it — pickup or drop-off. Post it to the live share board?" },
  { id: "whatworks",     q: "What actually works for blocking unknown numbers that keep harassing me?", a: "Verified by people who faced the same thing — no ads, no affiliates. 4 tools, ranked. The top one is free and works on your phone. Here's the short list." },
  { id: "skillshunt",    q: "I want to learn something new but I don't even know what's out there.", a: "Members teach everything from welding to grant-writing. Based on what you've asked before, here are 5 skills you could start this week — free, peer-taught." },
  { id: "levelup",       q: "I want to save $1,000 in 90 days but I always lose track.", a: "Done — $1,000 over 90 days, broken into weekly milestones. I'll check in and keep score. Day 1 of 90 starts now." },
  { id: "trust",         q: "Someone offered to help me move but I just met them. How do I know they're real?", a: "They check out — 23 vouches, 0 flags, active 2 years. Their trust score is visible and portable. Here's the profile." },
  { id: "clicklog",      q: "Something happened on my walk home. I want a record, but I don't want to call police.", a: "Logged — time-stamped, location optional, private to you. Want a safety check-in for when you get home? No one's alerted unless you miss it." },
];

function NavBar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/hub", label: "The Hub", icon: MessageSquare },
    { href: "/look-ma", label: "Look Ma, I Fixed It", icon: FixIt },
    { href: "/demos", label: "18 Demos", icon: Tv },
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

const DEFAULT_STATS = ["5M Survivors", "$300B Economy", "127 Countries", "18 Apps, One Account", "Free to join", "Invite Only"];

function StatMarquee({ stats = DEFAULT_STATS }: { stats?: string[] } = {}) {
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

function ServiceCreditsBounty() {
  return (
    <a
      href={APP_URL}
      className="flex items-stretch border-4 border-foreground overflow-hidden group transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
      style={{ boxShadow: "4px 4px 0px 0px #F59E0B", textDecoration: "none" }}
      aria-label="Sign up and receive 100 ServiceCredits"
    >
      {/* Token stamp — left */}
      <div
        className="flex flex-col items-center justify-center px-5 py-4 border-r-4 border-foreground flex-shrink-0 group-hover:brightness-110 transition-all"
        style={{ background: "#F59E0B", minWidth: 80 }}
      >
        <span className="font-display text-5xl leading-none text-black select-none">100</span>
        <div className="flex items-center gap-1 mt-1">
          <Coins size={13} strokeWidth={2.5} className="text-black/60" />
          <span className="font-black text-xs uppercase tracking-widest text-black/60">SC</span>
        </div>
      </div>

      {/* Copy — right */}
      <div className="flex-1 px-5 py-4" style={{ background: "#1c1200" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-black text-xs uppercase tracking-widest" style={{ color: "#F59E0B" }}>
            Sign-Up Reward
          </span>
          <span
            className="font-bold text-[10px] px-1.5 py-0.5 uppercase tracking-wider border"
            style={{ color: "#F59E0B", borderColor: "rgba(245,158,11,0.35)" }}
          >
            Free
          </span>
        </div>
        <p className="font-display text-base uppercase text-foreground leading-tight mb-1.5 tracking-widest">
          100 ServiceCredits — Yours On Day One
        </p>
        <p className="text-sm leading-snug" style={{ color: "rgba(245,158,11,0.6)" }}>
          The psyop-free utility token. Spend on housing, rides, repairs, or skills inside the network. No bank. No exchange.
        </p>
      </div>
    </a>
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
          <Link href="/demos" className="hover:text-foreground transition-colors">18 Demos</Link>
          <Link href="/look-ma" className="hover:text-foreground transition-colors">Look Ma, I Fixed It</Link>
          <a href="https://github.com/chargingthefuture/chargingthefuture" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub ↗</a>
          <a href="https://chargingthefuture.github.io/chargingthefuture/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Blog ↗</a>
          <a href={ANDROID_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Download size={13} /> Android APK</a>
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
              Not a charity. Not a support group. An invite-only circular economy that turns survivors into active participants in a $300B opportunity — built from the ground up with 18 features.
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
                See All 18 Apps
              </Link>
            </div>
            <div className="mb-6">
              <ServiceCreditsBounty />
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

      {/* 18 Apps teaser */}
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
              18 Apps.<br /><span className="text-secondary">One</span> Account.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We don't need another forum. We need infrastructure. Every feature is a shield against isolation, financial drain, and exploitation. We built all 18. Watch them in action.
            </p>
          </div>
          <Link
            href="/demos"
            className="w-full lg:w-auto flex-shrink-0 brutal-border brutal-shadow-secondary brutal-shadow-hover bg-secondary text-white font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
          >
            Watch All 18 Demos <ArrowRight strokeWidth={3} size={20} />
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
            + 10 more apps — see all 18 demos <ArrowRight size={14} />
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
              50+ real problems survivors experience — strange cars, workplace sabotage, new antennas on your block, dogs being commanded to bark at you. You've noticed. We've built the answer for every single one.
            </p>
            <p className="text-lg font-bold text-foreground/80">
              Click each problem. See exactly which feature of the app solves it.
            </p>
          </div>
          <Link
            href="/look-ma"
            className="w-full lg:w-auto flex-shrink-0 brutal-border brutal-shadow-accent brutal-shadow-hover bg-accent text-black font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
          >
            See All 50+ Fixes <ArrowRight strokeWidth={3} size={20} />
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
          <div className="mt-6">
            <a
              href={ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-black/40 text-black/70 font-bold py-2 px-5 text-sm uppercase tracking-widest hover:border-black hover:text-black transition-colors"
            >
              <Download size={15} strokeWidth={2.5} /> Download for Android (APK)
            </a>
          </div>
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
            The Arsenal — All 18
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display uppercase mb-6 leading-[0.9]">
            18 Apps.<br /><span className="text-secondary">One</span> Account.<br />All Demos.
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
                    App {String(i + 1).padStart(2, "0")} of 18
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
              50+ problems. 50+ answers. Everything you've experienced — the stalking, the workplace sabotage, the neighbors, the lights, the vehicles — we built a feature in Survivor Hub for every single one. Click any problem to see the fix.
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
              Want to see<br /><span className="text-primary">all 18 apps</span> in action?
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
              Watch All 18 Demos <ArrowRight strokeWidth={3} />
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

type ChatMessage = { role: "user" | "bot"; text: string; id?: string };

const HUB_INTRO: ChatMessage = {
  role: "bot",
  text: "Hey. I'm the Hub. Don't worry about learning the app — just tell me what's going on. Housing, a ride, paid work, or someone to talk to at 2am. Tap a question below to see how this works.",
};

function HubChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([HUB_INTRO]);
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [thinking, setThinking] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [draft, setDraft] = useState("");

  const askedRef = React.useRef<Set<string>>(new Set());
  const thinkingRef = React.useRef(false);
  const autoRef = React.useRef(false);
  const threadRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const askedCount = asked.size;
  const suggestions = HUB_QA.filter((qa) => !asked.has(qa.id)).slice(0, 3);

  const ask = (id: string) =>
    new Promise<void>((resolve) => {
      const qa = HUB_QA.find((x) => x.id === id);
      if (!qa || thinkingRef.current || askedRef.current.has(id)) {
        resolve();
        return;
      }
      askedRef.current.add(id);
      setAsked(new Set(askedRef.current));
      setMessages((prev) => [...prev, { role: "user", text: qa.q, id }]);
      thinkingRef.current = true;
      setThinking(true);
      window.setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text: qa.a, id }]);
        thinkingRef.current = false;
        setThinking(false);
        resolve();
      }, 850);
    });

  const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

  const autoPlay = async () => {
    if (autoRef.current) return;
    autoRef.current = true;
    setAutoPlaying(true);
    for (const qa of HUB_QA) {
      if (!autoRef.current) break;
      if (askedRef.current.has(qa.id)) continue;
      await ask(qa.id);
      await sleep(650);
    }
    autoRef.current = false;
    setAutoPlaying(false);
  };

  const reset = () => {
    autoRef.current = false;
    thinkingRef.current = false;
    askedRef.current = new Set();
    setAutoPlaying(false);
    setThinking(false);
    setAsked(new Set());
    setMessages([HUB_INTRO]);
    setDraft("");
  };

  const sendDraft = () => {
    if (thinkingRef.current) return;
    const next = HUB_QA.find((qa) => !askedRef.current.has(qa.id));
    if (next) ask(next.id);
    setDraft("");
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="border-4 border-foreground bg-background overflow-hidden" style={{ boxShadow: "8px 8px 0px 0px #7C3AED" }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0E061A] border-b-4 border-foreground text-[10px] font-bold uppercase tracking-widest text-white/50">
          <span>9:41</span>
          <span className="text-primary">●●●●● Survivor Hub</span>
          <span>100%</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0E061A] border-b-4 border-foreground">
          <div className="w-9 h-9 border-2 border-foreground flex items-center justify-center flex-shrink-0" style={{ background: "#7C3AED25" }}>
            <Users size={18} style={{ color: "#7C3AED" }} />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg uppercase tracking-wide text-white">Hub</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online · always
            </div>
          </div>
        </div>

        {/* Thread */}
        <div ref={threadRef} className="h-[360px] overflow-y-auto px-3 py-4 flex flex-col gap-3 bg-background scroll-smooth">
          {messages.map((m, i) => {
            if (m.role === "user") {
              return (
                <div key={i} className="self-end max-w-[80%]">
                  <div className="border-2 border-foreground bg-primary text-black px-3 py-2 text-sm leading-snug" style={{ boxShadow: "3px 3px 0px 0px #000" }}>
                    {m.text}
                  </div>
                </div>
              );
            }
            const feat = m.id ? FEATURE_BY_ID[m.id] : undefined;
            const accent = feat?.color ?? "#7C3AED";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="self-start max-w-[85%]"
              >
                <div className="border-2 border-foreground bg-card text-foreground px-3 py-2 text-sm leading-snug" style={{ boxShadow: `3px 3px 0px 0px ${accent}` }}>
                  {m.text}
                  {feat && (
                    <Link
                      href={`/demos#${feat.id}`}
                      className="mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest hover:underline"
                      style={{ color: accent }}
                    >
                      <feat.icon size={12} /> Open it directly ↗
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
          {thinking && (
            <div className="self-start">
              <div className="border-2 border-foreground bg-card px-3 py-2.5 flex items-center gap-1" style={{ boxShadow: "3px 3px 0px 0px #7C3AED" }}>
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="border-t-4 border-foreground bg-[#0E061A] px-3 py-3">
          {suggestions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {suggestions.map((qa) => (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => ask(qa.id)}
                  disabled={thinking || autoPlaying}
                  className="text-left border-2 border-foreground bg-background px-3 py-2 text-xs leading-snug text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-40"
                >
                  {qa.q}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs font-bold uppercase tracking-widest text-primary py-2">
              That was 17 different tools — one chat ✓
            </div>
          )}

          {/* Input row (visual) */}
          <div className="flex items-center gap-2 mt-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendDraft(); }}
              placeholder="Ask the Hub anything…"
              disabled={thinking || autoPlaying}
              className="flex-1 border-2 border-foreground bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary disabled:opacity-40"
            />
            <button
              type="button"
              onClick={sendDraft}
              disabled={thinking || autoPlaying}
              aria-label="Send"
              className="w-9 h-9 flex-shrink-0 border-2 border-foreground bg-primary text-black flex items-center justify-center disabled:opacity-40"
            >
              <Send size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Demo controls + progress */}
      <div className="mt-5 flex flex-col items-center gap-3">
        <div className="w-full h-3 border-2 border-foreground bg-background overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${(askedCount / HUB_QA.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {askedCount} of {HUB_QA.length} tools reached — without ever leaving the chat
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={autoPlay}
            disabled={autoPlaying || askedCount === HUB_QA.length}
            className="brutal-border brutal-shadow-primary bg-primary text-black font-bold py-2.5 px-5 text-sm uppercase tracking-widest flex items-center gap-2 disabled:opacity-40"
          >
            <Play size={15} fill="black" /> {autoPlaying ? "Playing…" : "Watch full demo"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="brutal-border brutal-shadow bg-transparent text-foreground font-bold py-2.5 px-5 text-sm uppercase tracking-widest flex items-center gap-2"
          >
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      {/* HERO */}
      <section className="pt-28 md:pt-32 pb-12 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-block border-4 border-primary bg-primary/10 text-primary font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
              New · Chat-First Experience
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display uppercase leading-[0.9] mb-6">
              Don't learn<br />18 apps.<br /><span className="text-primary">Just ask.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              18 features is a lot to face when you're already overwhelmed. So we put one chat in front of all of them. Tell the Hub what's wrong — a ride, a safe place, paid work, a panic at 2am — and it quietly pulls the right tool. No menus. No choosing. And anytime you want, you can skip the chat and open a feature directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={APP_URL}
                className="brutal-border brutal-shadow-primary brutal-shadow-hover bg-primary text-black font-bold py-4 px-8 text-lg uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                Open The Hub <ArrowRight strokeWidth={3} size={20} />
              </a>
              <Link
                href="/demos"
                className="brutal-border brutal-shadow brutal-shadow-hover bg-transparent text-foreground font-bold py-4 px-8 text-lg uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                Prefer the full menu?
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <HubChatDemo />
          </motion.div>
        </div>
      </section>

      <StatMarquee />

      {/* The reveal */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 border-4 border-secondary bg-secondary/10 text-secondary font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
            <Sparkles size={15} /> The trick
          </div>
          <h2 className="text-4xl md:text-6xl font-display uppercase leading-[0.9] mb-6">
            One chat.<br /><span className="text-primary">Seventeen</span> tools doing the work.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Every "random" question in the demo above quietly reached a different part of the platform — housing, transport, paid work, repairs, breathing, mood patterns, safety logging — without ever asking you to learn its name. The Hub does the navigating. You just talk.
          </p>
        </motion.div>
      </section>

      {/* What's behind the chat */}
      <section className="pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {HUB_QA.map((qa, i) => {
            const feat = FEATURE_BY_ID[qa.id];
            if (!feat) return null;
            return (
              <motion.div
                key={qa.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.05 }}
              >
                <Link
                  href={`/demos#${feat.id}`}
                  className="flex items-center gap-3 border-4 border-foreground p-3 group hover:-translate-y-1 transition-transform duration-200 h-full"
                  style={{ background: feat.bg, boxShadow: `4px 4px 0px 0px ${feat.color}` }}
                >
                  <div className="w-9 h-9 border-2 border-foreground flex items-center justify-center flex-shrink-0" style={{ background: `${feat.color}25` }}>
                    <feat.icon size={18} style={{ color: feat.color }} />
                  </div>
                  <span className="font-display text-sm uppercase leading-tight">{feat.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
          17 features, reachable through one conversation — or opened directly, your call.
        </p>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6 md:px-12 bg-primary border-t-4 border-foreground text-black text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display uppercase mb-6 leading-[0.9]">
            Less to learn.<br />More that helps.
          </h2>
          <p className="text-lg md:text-2xl font-bold mb-10 max-w-2xl mx-auto">
            Start with a single question. The Hub handles the rest.
          </p>
          <a
            href={APP_URL}
            className="inline-flex items-center gap-3 border-4 border-black bg-white text-black font-bold py-4 px-8 md:py-6 md:px-12 text-lg md:text-2xl uppercase tracking-widest hover:bg-black hover:text-white transition-colors brutal-shadow"
          >
            Ask The Hub <ArrowRight strokeWidth={3} size={22} />
          </a>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "30px 30px" }} />
      </section>

      <Footer />
    </div>
  );
}

// Variant 3 chat demo. Same conversation engine as HubChatDemo, but the chat
// IS the app (the place you land on sign-up) — so: no "Hub" name label on the
// thread, no per-answer "open the feature" handoffs, and no counts or
// references to the underlying services. The focal point is purely the chat.
const ASK_INTRO: ChatMessage = {
  role: "bot",
  text: "Hey. Whatever's going on, just say it the way you'd say it out loud. I'll find you something you can actually use right now. Tap one below to see how it works.",
};

function AskHubDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([ASK_INTRO]);
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [thinking, setThinking] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [draft, setDraft] = useState("");

  const askedRef = React.useRef<Set<string>>(new Set());
  const thinkingRef = React.useRef(false);
  const autoRef = React.useRef(false);
  const threadRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const askedCount = asked.size;
  const suggestions = HUB_QA.filter((qa) => !asked.has(qa.id)).slice(0, 3);

  // Auto-play pacing: a longer "thinking" beat, then a long pause so each
  // answer is readable before the next question scrolls in.
  const THINK_MS = 1300;
  const PAUSE_MS = 3600;

  const ask = (id: string) =>
    new Promise<void>((resolve) => {
      const qa = HUB_QA.find((x) => x.id === id);
      if (!qa || thinkingRef.current || askedRef.current.has(id)) {
        resolve();
        return;
      }
      askedRef.current.add(id);
      setAsked(new Set(askedRef.current));
      setMessages((prev) => [...prev, { role: "user", text: qa.q, id }]);
      thinkingRef.current = true;
      setThinking(true);
      window.setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text: qa.a, id }]);
        thinkingRef.current = false;
        setThinking(false);
        resolve();
      }, THINK_MS);
    });

  const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

  const autoPlay = async () => {
    if (autoRef.current) return;
    autoRef.current = true;
    setAutoPlaying(true);
    for (const qa of HUB_QA) {
      if (!autoRef.current) break;
      if (askedRef.current.has(qa.id)) continue;
      await ask(qa.id);
      await sleep(PAUSE_MS);
    }
    autoRef.current = false;
    setAutoPlaying(false);
  };

  const reset = () => {
    autoRef.current = false;
    thinkingRef.current = false;
    askedRef.current = new Set();
    setAutoPlaying(false);
    setThinking(false);
    setAsked(new Set());
    setMessages([ASK_INTRO]);
    setDraft("");
  };

  const sendDraft = () => {
    if (thinkingRef.current) return;
    const next = HUB_QA.find((qa) => !askedRef.current.has(qa.id));
    if (next) ask(next.id);
    setDraft("");
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="border-4 border-foreground bg-background overflow-hidden" style={{ boxShadow: "8px 8px 0px 0px #7C3AED" }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0E061A] border-b-4 border-foreground text-[10px] font-bold uppercase tracking-widest text-white/50">
          <span>9:41</span>
          <span className="text-primary">●●●●● Survivor Hub</span>
          <span>100%</span>
        </div>

        {/* Header — no app name; the chat is simply where you land */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0E061A] border-b-4 border-foreground">
          <div className="w-9 h-9 border-2 border-foreground flex items-center justify-center flex-shrink-0" style={{ background: "#7C3AED25" }}>
            <Sparkles size={18} style={{ color: "#7C3AED" }} />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online · always here
            </div>
            <div className="text-xs text-muted-foreground">Ask anything. Get something you can use.</div>
          </div>
        </div>

        {/* Thread */}
        <div ref={threadRef} className="h-[360px] overflow-y-auto px-3 py-4 flex flex-col gap-3 bg-background scroll-smooth">
          {messages.map((m, i) => {
            if (m.role === "user") {
              return (
                <div key={i} className="self-end max-w-[80%]">
                  <div className="border-2 border-foreground bg-primary text-black px-3 py-2 text-sm leading-snug" style={{ boxShadow: "3px 3px 0px 0px #000" }}>
                    {m.text}
                  </div>
                </div>
              );
            }
            const accent = m.id ? FEATURE_BY_ID[m.id]?.color ?? "#7C3AED" : "#7C3AED";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="self-start max-w-[85%]"
              >
                <div className="border-2 border-foreground bg-card text-foreground px-3 py-2 text-sm leading-snug" style={{ boxShadow: `3px 3px 0px 0px ${accent}` }}>
                  {m.text}
                </div>
              </motion.div>
            );
          })}
          {thinking && (
            <div className="self-start">
              <div className="border-2 border-foreground bg-card px-3 py-2.5 flex items-center gap-1" style={{ boxShadow: "3px 3px 0px 0px #7C3AED" }}>
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="border-t-4 border-foreground bg-[#0E061A] px-3 py-3">
          {suggestions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {suggestions.map((qa) => (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => ask(qa.id)}
                  disabled={thinking || autoPlaying}
                  className="text-left border-2 border-foreground bg-background px-3 py-2 text-xs leading-snug text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-40"
                >
                  {qa.q}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs font-bold uppercase tracking-widest text-primary py-2">
              Ask it anything — it's all one conversation ✓
            </div>
          )}

          {/* Input row */}
          <div className="flex items-center gap-2 mt-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendDraft(); }}
              placeholder="Say what's going on…"
              disabled={thinking || autoPlaying}
              className="flex-1 border-2 border-foreground bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary disabled:opacity-40"
            />
            <button
              type="button"
              onClick={sendDraft}
              disabled={thinking || autoPlaying}
              aria-label="Send"
              className="w-9 h-9 flex-shrink-0 border-2 border-foreground bg-primary text-black flex items-center justify-center disabled:opacity-40"
            >
              <Send size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Demo controls */}
      <div className="mt-5 flex flex-col items-center gap-3">
        <div className="w-full h-3 border-2 border-foreground bg-background overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${(askedCount / HUB_QA.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={autoPlay}
            disabled={autoPlaying || askedCount === HUB_QA.length}
            className="brutal-border brutal-shadow-primary bg-primary text-black font-bold py-2.5 px-5 text-sm uppercase tracking-widest flex items-center gap-2 disabled:opacity-40"
          >
            <Play size={15} fill="black" /> {autoPlaying ? "Playing…" : "Watch it work"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="brutal-border brutal-shadow bg-transparent text-foreground font-bold py-2.5 px-5 text-sm uppercase tracking-widest flex items-center gap-2"
          >
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function HubLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      {/* HERO — split screen (same comic-book header as variant 1) */}
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
              Not a charity. Not a support group. An invite-only circular economy that turns survivors into active participants in a $300B opportunity — built from the ground up with 18 features.
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
                See All 18 Apps
              </Link>
            </div>
            <div className="mb-6">
              <ServiceCreditsBounty />
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> Invite Only</span>
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> WCAG AAA</span>
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> 5M Survivors</span>
            </div>
          </motion.div>
        </div>
      </section>

      <StatMarquee stats={["5M Survivors", "$300B Economy", "127 Countries", "Free to join", "Invite Only"]} />

      {/* The Arsenal — replaced with the hub chat as the single focal point */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <div className="inline-block border-4 border-primary bg-primary/10 text-primary font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
            The Arsenal
          </div>
          <h2 className="text-5xl md:text-6xl font-display uppercase mb-6 leading-[0.9]">
            Just<br /><span className="text-secondary">Ask.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            However you'd say it out loud — type it. Whatever you're facing, you get something you can act on, right now. No menus to learn. No choosing where to start. You just talk.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <AskHubDemo />
        </motion.div>
      </section>

      {/* Look Ma teaser — kept from variant 1 (plain-language inspiration for what to ask) */}
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
              50+ real problems survivors experience — strange cars, workplace sabotage, new antennas on your block, dogs being commanded to bark at you. You've noticed. We've built the answer for every single one.
            </p>
            <p className="text-lg font-bold text-foreground/80">
              Click each problem. See exactly which feature of the app solves it.
            </p>
          </div>
          <Link
            href="/look-ma"
            className="w-full lg:w-auto flex-shrink-0 brutal-border brutal-shadow-accent brutal-shadow-hover bg-accent text-black font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
          >
            See All 50+ Fixes <ArrowRight strokeWidth={3} size={20} />
          </Link>
        </div>
      </section>

      {/* Final CTA — kept from variant 1 */}
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
          <div className="mt-6">
            <a
              href={ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-black/40 text-black/70 font-bold py-2 px-5 text-sm uppercase tracking-widest hover:border-black hover:text-black transition-colors"
            >
              <Download size={15} strokeWidth={2.5} /> Download for Android (APK)
            </a>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "30px 30px" }} />
      </section>

      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/hub" component={HubLandingPage} />
      <Route path="/chat" component={ChatLandingPage} />
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
