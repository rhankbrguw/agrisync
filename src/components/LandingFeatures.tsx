import { motion, type Variants } from 'framer-motion';
import { WifiOff, MapPin, ShieldCheck, Bell, Users, CreditCard } from 'lucide-react';
import { LANDING_STRINGS } from '../constants/landingStrings';
import { TOKENS } from '../constants/tokens';

const FEATURE_ICONS = {
  'offline-first': WifiOff,
  'gps-mapping': MapPin,
  'multi-tenancy': ShieldCheck,
  'automated-pipeline': Bell,
  'rbac-system': Users,
  'billing-ready': CreditCard,
} as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

export function LandingFeatures() {
  const strings = LANDING_STRINGS.FEATURES;

  return (
    <section id="features" className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-3">
          {strings.SECTION_BADGE}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-text-main tracking-tight">
          {strings.TITLE}
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-text-muted leading-relaxed">
          {strings.SUBTITLE}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
      >
        {strings.ITEMS.map((item) => {
          const IconComponent = FEATURE_ICONS[item.id as keyof typeof FEATURE_ICONS] || ShieldCheck;

          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 sm:p-7 rounded-3xl bg-surface/70 border border-border hover:border-primary/40 backdrop-blur-md flex flex-col justify-between transition-colors duration-300 hover:shadow-xl hover:shadow-primary/5 group"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-text-inverse transition-all duration-300">
                  <IconComponent size={TOKENS.ICON_SIZES.LG} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-border/40 flex items-center">
                <span className="text-2xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
                  {item.tag}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
