import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { HeroDashboard } from "./HeroDashboard.jsx";
import { APP_ROUTES } from "@constants/routes.js";
import { useAuth } from "@providers/useAuth.js";

/* ─── Framer Motion presets ─────────────────────────────────────── */
const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

/* ─── Sub-components (all memoised) ────────────────────────────── */

const HeroHeading = memo(function HeroHeading() {
  return (
    <motion.div variants={FADE_UP}>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
        AI CAREER COACHING
      </p>
      <h1
        className="text-[38px] font-black leading-[0.98] tracking-[-0.06em] text-[var(--color-text)] sm:text-[48px] lg:text-[58px]"
      >
        Your AI Career Coach,
        <br />
        <span style={{ color: "var(--color-primary)" }}>always ready.</span>
      </h1>
    </motion.div>
  );
});

const HeroSubtitle = memo(function HeroSubtitle() {
  return (
    <motion.p
      variants={FADE_UP}
      className="max-w-[480px] text-[15px] leading-6 text-[var(--color-muted)] sm:text-base"
    >
      Build an ATS-ready resume, close skill gaps, and get a personalised career
      roadmap — in minutes, not months.
    </motion.p>
  );
});

const HeroCTAs = memo(function HeroCTAs() {
  const { isAuthenticated } = useAuth();
  const targetRoute = isAuthenticated ? APP_ROUTES.DASHBOARD : APP_ROUTES.REGISTER;

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      variants={FADE_UP}
      className="flex flex-wrap items-center gap-3"
    >
      {/* Primary CTA — text ALWAYS "Get Started" */}
      <Link to={targetRoute}>
        <button
          type="button"
          className="btn-ripple magnetic-btn group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(37,99,235,0.28)] dark:shadow-[0_10px_25px_rgba(37,99,235,0.2)] transition hover:-translate-y-0.5 cursor-pointer"
          aria-label="Get Started"
        >
          Get Started
          <ArrowRight
            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </Link>

      {/* Secondary CTA */}
      <button
        type="button"
        onClick={scrollToFeatures}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition hover:border-blue-200 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer"
      >
        See how it works
      </button>
    </motion.div>
  );
});

const TrustRow = memo(function TrustRow() {
  return (
    <motion.div variants={FADE_UP} className="flex items-center gap-2.5">
      {/* Star rating */}
      <div
        className="flex items-center gap-0.5"
        aria-label="Rated 5 out of 5 stars"
        role="img"
      >
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* User count */}
      <p className="text-xs text-[var(--color-muted)]">
        <span className="font-semibold text-[var(--color-text)]">10,000+</span>{" "}
        students
      </p>
    </motion.div>
  );
});

/* ─── HeroSection ───────────────────────────────────────────────── */

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-88px)] items-center overflow-hidden"
      aria-label="Hero — AI Career Accelerator"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[56%_44%] lg:gap-8 xl:gap-12">
          {/* ── Left: hero copy ─────────────────────────────── */}
          <motion.div
            variants={STAGGER}
            initial="hidden"
            animate="visible"
            className="space-y-7"
          >
            <HeroHeading />
            <HeroSubtitle />
            <HeroCTAs />
            <TrustRow />
          </motion.div>

          {/* ── Right: product dashboard ─────────────────────── */}
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}
