import { calculateDaysLeft } from '../utils/date';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, CheckCircle2, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_STRINGS } from '../constants/strings';
import { ROUTES } from '../constants/routes';
import { TOKENS } from '../constants/tokens';
import { useBillingCheckout } from '../hooks/useBillingCheckout';
import { useDocumentTitle } from '../hooks/useDocumentTitle';


import { useAuthStore } from '../store/authStore';

const FeatureList = ({ features }: { features: readonly string[] }) => (
  <ul className="space-y-3 text-left mt-6 mb-8 flex-1">
    {features.map((f, i) => (
      <li key={i} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-text-main">
        <CheckCircle2 size={TOKENS.ICON_SIZES.MD} className="text-success shrink-0" /> {f}
      </li>
    ))}
  </ul>
);

export function Billing() {
  useDocumentTitle(APP_STRINGS.TITLES.SUBSCRIPTION);
  const checkoutMutation = useBillingCheckout();
  const user = useAuthStore(state => state.user);
  const isPro = user?.subscription_tier === 'PRO';
  
  const daysLeftText = isPro ? calculateDaysLeft(user?.subscription_updated_at) : '';
  
  const strings = APP_STRINGS.BILLING;

  return (
    <div className="min-h-dvh flex flex-col items-center py-6 sm:py-12 px-3 sm:px-6 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-[32rem] sm:h-[32rem] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-[32rem] sm:h-[32rem] bg-info/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-6xl z-10">
        <Link to={ROUTES.DASHBOARD} className="inline-flex items-center gap-1.5 sm:gap-2 text-text-muted hover:text-primary transition-colors font-semibold text-xs sm:text-sm mb-6 sm:mb-10 bg-surface/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl backdrop-blur-md border border-border">
          <ArrowLeft size={TOKENS.ICON_SIZES.SM} className="sm:hidden" />
          <ArrowLeft size={TOKENS.ICON_SIZES.MD} className="hidden sm:inline" />
          <span>{APP_STRINGS.UI.BACK_TO_DASHBOARD}</span>
        </Link>
        
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-text-main mb-2 sm:mb-4">{strings.TITLE}</h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-2xl mx-auto">{strings.SUBTITLE}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 items-stretch">
          
          {/* FREE TIER */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col bg-surface border border-border p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm relative">
            {!isPro && (
               <div className="absolute top-0 right-0 bg-surface border-b border-l border-border text-text-muted text-xs-tight font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-bl-xl rounded-tr-2xl sm:rounded-tr-3xl uppercase tracking-widest flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 bg-success rounded-full"></span> {strings.CURRENT_PLAN_BADGE}
               </div>
            )}
            <h2 className="text-lg sm:text-xl font-bold text-text-main flex items-center gap-2"><Shield size={TOKENS.ICON_SIZES.LG} className="text-text-muted"/> {strings.FREE_TIER}</h2>
            <div className="mt-3 sm:mt-4 mb-2"><p className="text-2xl sm:text-3xl font-black text-text-main">{strings.PRICE_FREE}</p></div>
            <p className="text-2xs sm:text-xs text-text-muted">{strings.FREE_DESC}</p>
            <FeatureList features={strings.FREE_FEATURES} />
            <button disabled className="w-full h-11 sm:h-12 bg-surface border border-border text-text-muted font-bold rounded-xl cursor-not-allowed uppercase tracking-widest text-2xs sm:text-xs">{isPro ? strings.BASE_PLAN_BADGE : strings.CURRENT_PLAN_BADGE}</button>
          </motion.div>

          {/* PRO TIER (RECOMMENDED) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`flex flex-col bg-background border-2 ${isPro ? 'border-primary shadow-primary/10' : 'border-primary'} p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl relative scale-100 md:scale-105 z-10`}>
            {isPro ? (
               <div className="absolute top-0 right-0 bg-primary text-text-inverse text-xs-tight font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-bl-xl rounded-tr-2xl sm:rounded-tr-3xl uppercase tracking-widest flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 bg-text-inverse rounded-full animate-pulse"></span> {daysLeftText || strings.ACTIVE_BADGE}
               </div>
            ) : (
               <div className="absolute top-0 right-0 bg-primary text-text-inverse text-xs-tight font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-bl-xl rounded-tr-2xl sm:rounded-tr-3xl uppercase tracking-widest">{strings.RECOMMENDED}</div>
            )}
            <h2 className="text-lg sm:text-xl font-bold text-text-main flex items-center gap-2">
              <CreditCard size={TOKENS.ICON_SIZES.LG} className="text-primary"/> 
              {strings.PRO_TIER}
            </h2>
            <div className="mt-3 sm:mt-4 mb-2">
              <p className="text-2xl sm:text-3xl font-black text-primary">{strings.PRICE_PRO}<span className="text-xs sm:text-sm font-medium text-text-muted">{strings.PRICE_PRO_SUFFIX}</span></p>
            </div>
            <p className="text-2xs sm:text-xs font-medium text-text-muted">{strings.PRO_DESC}</p>
            <FeatureList features={strings.PRO_FEATURES} />
            <button 
              onClick={() => !isPro && checkoutMutation.mutate()} 
              disabled={checkoutMutation.isPending || isPro}
              className={`w-full h-11 sm:h-12 font-bold uppercase tracking-widest rounded-xl transition-all text-2xs sm:text-xs ${isPro ? 'bg-primary/10 text-primary cursor-default' : 'bg-primary hover:bg-primary-hover text-text-inverse shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-70 disabled:cursor-wait'}`}
            >
              {isPro ? strings.CURRENT_PLAN_BADGE : (checkoutMutation.isPending ? strings.PROCESSING : strings.UPGRADE_BTN)}
            </button>
          </motion.div>

          {/* ENTERPRISE TIER */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col bg-surface/50 border border-border p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm relative opacity-60 pointer-events-none grayscale">
            <div className="absolute top-0 right-0 bg-background text-text-muted border border-border text-xs-tight font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-bl-xl rounded-tr-2xl sm:rounded-tr-3xl uppercase tracking-widest">{strings.ENT_BADGE}</div>
            <h2 className="text-lg sm:text-xl font-bold text-text-main flex items-center gap-2"><Zap size={TOKENS.ICON_SIZES.LG} className="text-text-main"/> {strings.ENT_TIER}</h2>
            <div className="mt-3 sm:mt-4 mb-2"><p className="text-2xl sm:text-3xl font-black text-text-main">{strings.PRICE_ENT}</p></div>
            <p className="text-2xs sm:text-xs text-text-muted">{strings.ENT_DESC}</p>
            <FeatureList features={strings.ENT_FEATURES} />
            <button disabled className="w-full h-11 sm:h-12 bg-surface border border-border text-text-muted font-bold rounded-xl cursor-not-allowed uppercase tracking-widest text-2xs sm:text-xs">{strings.ENT_BTN}</button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
