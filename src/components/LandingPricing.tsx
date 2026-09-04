import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { CheckCircle2, Shield, CreditCard, Zap } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { APP_STRINGS } from '../constants/strings';
import { TOKENS } from '../constants/tokens';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

const PricingHeader = () => (
  <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-3">
      {APP_STRINGS.BILLING.SUBSCRIPTION_BADGE}
    </span>
    <h2 className="text-2xl sm:text-4xl font-extrabold text-text-main tracking-tight">
      {APP_STRINGS.BILLING.TITLE}
    </h2>
    <p className="mt-3 text-xs sm:text-sm text-text-muted leading-relaxed">
      {APP_STRINGS.BILLING.SUBTITLE}
    </p>
  </div>
);

const FreePricingCard = () => (
  <motion.div variants={cardVariants} whileHover={{ y: -4 }} className="flex flex-col bg-surface border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
    <div className="flex items-center gap-2 text-text-main font-bold text-base sm:text-lg mb-2">
      <Shield size={TOKENS.ICON_SIZES.LG} className="text-text-muted" />
      <span>{APP_STRINGS.BILLING.FREE_TIER}</span>
    </div>
    <div className="mt-2 mb-2"><span className="text-2xl sm:text-3xl font-black text-text-main">{APP_STRINGS.BILLING.PRICE_FREE}</span></div>
    <p className="text-xs text-text-muted mb-6">{APP_STRINGS.BILLING.FREE_DESC}</p>
    <ul className="space-y-2.5 flex-1 mb-8">
      {APP_STRINGS.BILLING.FREE_FEATURES.map((f, i) => (
        <li key={i} className="flex items-center gap-2.5 text-xs text-text-main">
          <CheckCircle2 size={TOKENS.ICON_SIZES.MD} className="text-success shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
    <Link to={ROUTES.LOGIN} className="w-full h-11 flex items-center justify-center bg-surface hover:bg-surface/80 border border-border text-text-main font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
      {APP_STRINGS.BILLING.START_FREE}
    </Link>
  </motion.div>
);

const ProPricingCard = () => (
  <motion.div variants={cardVariants} whileHover={{ y: -6 }} className="flex flex-col bg-background border-2 border-primary p-6 sm:p-8 rounded-3xl shadow-2xl relative scale-100 md:scale-105 z-10">
    <div className="absolute top-0 right-0 bg-primary text-text-inverse text-xs-tight font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-3xl uppercase tracking-widest">
      {APP_STRINGS.BILLING.RECOMMENDED}
    </div>
    <div className="flex items-center gap-2 text-text-main font-bold text-base sm:text-lg mb-2">
      <CreditCard size={TOKENS.ICON_SIZES.LG} className="text-primary" />
      <span>{APP_STRINGS.BILLING.PRO_TIER}</span>
    </div>
    <div className="mt-2 mb-2">
      <span className="text-2xl sm:text-3xl font-black text-primary">{APP_STRINGS.BILLING.PRICE_PRO}</span>
      <span className="text-xs font-bold text-text-muted">{APP_STRINGS.BILLING.PRICE_PRO_SUFFIX}</span>
    </div>
    <p className="text-xs text-text-muted mb-6">{APP_STRINGS.BILLING.PRO_DESC}</p>
    <ul className="space-y-2.5 flex-1 mb-8">
      {APP_STRINGS.BILLING.PRO_FEATURES.map((f, i) => (
        <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-text-main">
          <CheckCircle2 size={TOKENS.ICON_SIZES.MD} className="text-success shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
    <Link to={ROUTES.LOGIN} className="w-full h-11 flex items-center justify-center bg-primary hover:bg-primary-hover text-text-inverse font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary/20">
      {APP_STRINGS.BILLING.SELECT_PRO}
    </Link>
  </motion.div>
);

const EnterprisePricingCard = () => (
  <motion.div variants={cardVariants} whileHover={{ y: -4 }} className="flex flex-col bg-surface/50 border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
    <div className="flex items-center gap-2 text-text-main font-bold text-base sm:text-lg mb-2">
      <Zap size={TOKENS.ICON_SIZES.LG} className="text-text-main" />
      <span>{APP_STRINGS.BILLING.ENT_TIER}</span>
    </div>
    <div className="mt-2 mb-2"><span className="text-2xl sm:text-3xl font-black text-text-main">{APP_STRINGS.BILLING.PRICE_ENT}</span></div>
    <p className="text-xs text-text-muted mb-6">{APP_STRINGS.BILLING.ENT_DESC}</p>
    <ul className="space-y-2.5 flex-1 mb-8">
      {APP_STRINGS.BILLING.ENT_FEATURES.map((f, i) => (
        <li key={i} className="flex items-center gap-2.5 text-xs text-text-main">
          <CheckCircle2 size={TOKENS.ICON_SIZES.MD} className="text-success shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
    <Link to={ROUTES.DOCS} className="w-full h-11 flex items-center justify-center bg-surface border border-border text-text-muted font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:text-text-main">
      {APP_STRINGS.BILLING.LEARN_ENT}
    </Link>
  </motion.div>
);

export function LandingPricing() {
  return (
    <section id="pricing" className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <PricingHeader />
      <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        <FreePricingCard />
        <ProPricingCard />
        <EnterprisePricingCard />
      </motion.div>
    </section>
  );
}
