import { motion, useScroll, useTransform } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { LandingNav } from '../components/LandingNav';
import { LandingHero } from '../components/LandingHero';
import { LandingFeatures } from '../components/LandingFeatures';
import { LandingArchitecture } from '../components/LandingArchitecture';
import { LandingPricing } from '../components/LandingPricing';
import { LandingFooter } from '../components/LandingFooter';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';
import { USER_ROLE } from '../constants/enums';
import { APP_STRINGS } from '../constants/strings';

export function Landing() {
  useDocumentTitle(APP_STRINGS.TITLES.LANDING);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const { scrollY } = useScroll();
  const yOrb1 = useTransform(scrollY, [0, 1200], [0, -50]);
  const yOrb2 = useTransform(scrollY, [0, 1200], [0, 60]);
  const yOrb3 = useTransform(scrollY, [0, 1200], [0, -40]);

  if (isAuthenticated) {
    if (user?.role === USER_ROLE.New || user?.role === USER_ROLE.PendingAccess) {
      return <Navigate to={ROUTES.ONBOARDING} replace />;
    }
    return <Navigate to={user?.role === USER_ROLE.Supervisor ? ROUTES.DASHBOARD : ROUTES.WORKER} replace />;
  }

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          style={{ y: yOrb1 }}
          className="absolute -top-32 -right-32 w-80 h-80 sm:w-[36rem] sm:h-[36rem] bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: yOrb2 }}
          className="absolute top-1/3 -left-32 w-80 h-80 sm:w-[32rem] sm:h-[32rem] bg-info/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: yOrb3 }}
          className="absolute bottom-10 right-10 w-72 h-72 sm:w-[28rem] sm:h-[28rem] bg-success/5 rounded-full blur-3xl"
        />
      </div>

      <LandingNav />

      <main className="relative z-10 flex-1 flex flex-col">
        <LandingHero />
        <LandingFeatures />
        <LandingArchitecture />
        <LandingPricing />
      </main>

      <LandingFooter />
    </div>
  );
}
