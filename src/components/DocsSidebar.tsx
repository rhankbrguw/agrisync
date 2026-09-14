import { Book, Shield, Zap, Sparkles } from 'lucide-react';
import { DOCS_CATEGORIES, type DocItem } from '../constants/docsData';
import { TOKENS } from '../constants/tokens';

const CATEGORY_ICONS = {
  'getting-started': Sparkles,
  architecture: Book,
  security: Shield,
  integrations: Zap,
} as const;

interface DocsSidebarProps {
  items: DocItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function DocsSidebar({ items, activeId, onSelect }: DocsSidebarProps) {
  return (
    <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-6 bg-surface/30">
      <div className="space-y-6">
        {DOCS_CATEGORIES.map((cat) => {
          const catItems = items.filter((item) => item.category === cat.id);
          if (catItems.length === 0) return null;

          const IconComponent = CATEGORY_ICONS[cat.id as keyof typeof CATEGORY_ICONS] || Book;

          return (
            <div key={cat.id} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-text-muted px-2.5">
                <IconComponent size={TOKENS.ICON_SIZES.SM} className="text-primary" />
                <span>{cat.label}</span>
              </div>
              <div className="space-y-1">
                {catItems.map((item) => {
                  const isSelected = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-primary text-text-inverse shadow-sm'
                          : 'text-text-main hover:bg-surface hover:text-primary'
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span
                          className={`text-2xs px-1.5 py-0.5 rounded-md font-bold ${
                            isSelected
                              ? 'bg-text-inverse/20 text-text-inverse'
                              : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
