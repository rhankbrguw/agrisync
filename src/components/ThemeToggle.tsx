import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { APP_STRINGS } from '../constants/strings';
import { TOKENS } from '../constants/tokens';
import { THEME } from '../constants/enums';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button onClick={toggleTheme} title={APP_STRINGS.THEME.TOGGLE} className="p-2 sm:p-2.5 text-text-muted hover:text-primary sm:hover:bg-primary/10 rounded-xl transition-colors bg-background/50 border border-border">
      {theme === THEME.Dark ? <Moon size={TOKENS.ICON_SIZES.LG} /> : <Sun size={TOKENS.ICON_SIZES.LG} />}
    </button>
  );
}
