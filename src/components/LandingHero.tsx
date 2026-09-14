import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Zap, BookOpen, WifiOff, CheckCircle2, MapPin } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { LANDING_STRINGS } from '../constants/landingStrings';
import { TOKENS } from '../constants/tokens';
import { useAuthStore } from '../store/authStore';
import { USER_ROLE } from '../constants/enums';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export function LandingHero() {
  const strings = LANDING_STRINGS.HERO;
  const navStrings = LANDING_STRINGS.NAV;
  const metrics = LANDING_STRINGS.METRICS;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const targetRoute = !isAuthenticated
    ? ROUTES.LOGIN
    : user?.role === USER_ROLE.Supervisor
      ? ROUTES.DASHBOARD
      : user?.role === USER_ROLE.Worker
        ? ROUTES.WORKER
        : ROUTES.ONBOARDING;

  const ctaLabel = !isAuthenticated
    ? strings.CTA_PRIMARY
    : user?.role === USER_ROLE.Supervisor
      ? navStrings.OPEN_DASHBOARD
      : navStrings.OPEN_WORKSPACE;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative pt-10 pb-12 sm:pt-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center"
    >
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
      >
        <Zap size={TOKENS.ICON_SIZES.SM} className="text-primary animate-pulse" />
        <span>{strings.BADGE}</span>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-main tracking-tight max-w-4xl leading-[1.15]"
      >
        <span>{strings.TITLE_LINE1}</span>{' '}
        <span className="text-primary">{strings.TITLE_LINE2}</span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mt-5 text-sm sm:text-base lg:text-lg text-text-muted max-w-2xl font-normal leading-relaxed"
      >
        {strings.SUBTITLE}
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
      >
        <Link
          to={targetRoute}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary hover:bg-primary-hover text-text-inverse rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-primary/25 hover:shadow-primary/35 active:scale-95"
        >
          <span>{ctaLabel}</span>
          <ArrowRight size={TOKENS.ICON_SIZES.MD} />
        </Link>
        <Link
          to={ROUTES.DOCS}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface hover:bg-surface/80 text-text-main border border-border rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm active:scale-95"
        >
          <BookOpen size={TOKENS.ICON_SIZES.MD} />
          <span>{strings.CTA_DOCS}</span>
        </Link>
      </motion.div>

      {/* Live Pipeline Preview Banner */}
      <motion.div
        variants={itemVariants}
        className="mt-10 sm:mt-12 w-full max-w-2xl p-3 sm:p-4 rounded-2xl bg-surface/80 border border-border/80 backdrop-blur-xl shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2 text-text-muted">
          <WifiOff size={TOKENS.ICON_SIZES.SM} className="text-warning" />
          <span className="font-semibold text-text-main">{strings.SIM_OFFLINE}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-2xs sm:text-xs">
          <MapPin size={TOKENS.ICON_SIZES.SM} className="text-primary" />
          <span>{strings.SIM_GPS}</span>
        </div>
        <div className="flex items-center gap-1.5 text-success font-bold text-2xs sm:text-xs">
          <CheckCircle2 size={TOKENS.ICON_SIZES.SM} />
          <span>{strings.SIM_SYNCED}</span>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-10 sm:mt-14 w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
      >
        {metrics.map((item, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-surface/60 border border-border backdrop-blur-md flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/30 transition-colors"
          >
            <span className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
              {item.value}
            </span>
            <span className="mt-1 text-xs font-bold text-text-main">
              {item.label}
            </span>
            <span className="mt-0.5 text-2xs text-text-muted">
              {item.desc}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}
