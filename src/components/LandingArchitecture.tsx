import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Camera, Database, CloudUpload, BellRing, ArrowRight, Check } from 'lucide-react';
import { LANDING_STRINGS } from '../constants/landingStrings';
import { TOKENS } from '../constants/tokens';

const STEP_ICONS = [Camera, Database, CloudUpload, BellRing];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export function LandingArchitecture() {
  const strings = LANDING_STRINGS.ARCHITECTURE;
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="architecture" className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        {strings.STEPS.map((step, idx) => {
          const Icon = STEP_ICONS[idx] || Camera;
          const isActive = activeStep === idx;

          return (
            <motion.div
              key={step.step}
              variants={itemVariants}
              onClick={() => setActiveStep(idx)}
              whileHover={{ y: -3 }}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative ${
                isActive
                  ? 'bg-surface border-primary shadow-xl shadow-primary/10 ring-2 ring-primary/20'
                  : 'bg-surface/50 border-border hover:border-border/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-black tracking-wider ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                    STEP {step.step}
                  </span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-primary text-text-inverse' : 'bg-surface border border-border text-text-muted'}`}>
                    <Icon size={TOKENS.ICON_SIZES.MD} />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-text-main mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-2xs font-bold uppercase tracking-wider">
                <span className={isActive ? 'text-primary' : 'text-text-muted'}>
                  {isActive ? 'Aktif Terpilih' : 'Klik Detail'}
                </span>
                {isActive ? (
                  <Check size={TOKENS.ICON_SIZES.SM} className="text-primary" />
                ) : (
                  <ArrowRight size={TOKENS.ICON_SIZES.SM} className="text-border" />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
