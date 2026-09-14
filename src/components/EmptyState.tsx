import { TOKENS } from "../constants/tokens";
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface border border-border rounded-xl">
      <motion.div 
        animate={{ y: [0, -8, 0] }} 
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} 
        className="p-3 bg-background/50 rounded-full mb-4"
      >
        <Icon size={TOKENS.ICON_SIZES.XXL} className="text-text-muted" />
      </motion.div>
      <h3 className="text-lg font-bold text-text-main mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-xs mx-auto mb-4">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
