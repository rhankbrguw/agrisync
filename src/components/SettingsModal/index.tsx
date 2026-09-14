import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_STRINGS } from '../../constants/strings';
import { AvatarUploader, SettingsFormFields } from './components';
import { useSettingsForm } from '../../hooks/useSettingsForm';
import { TOKENS } from '../../constants/tokens';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { form, fileInputRef, previewUrl, onFileChange, onSubmit, isPending, isCompressing } = useSettingsForm(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            role="presentation" 
            onKeyDown={(e) => e.key === 'Escape' && onClose()} 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-surface/80 backdrop-blur-3xl rounded-2xl sm:rounded-[2rem] border border-border shadow-2xl overflow-hidden flex flex-col"
          >
            <header className="px-4 py-3 sm:px-6 sm:py-4 border-b border-border flex items-center justify-between bg-surface/50">
              <h2 className="text-xs sm:text-base font-bold uppercase tracking-widest text-text-main">{APP_STRINGS.SETTINGS.TITLE}</h2>
              <button onClick={onClose} className="p-1.5 sm:p-2 bg-background/50 text-text-muted sm:hover:text-text-main rounded-xl transition-colors border border-border">
                <X size={TOKENS.ICON_SIZES.MD} className="sm:hidden" />
                <X size={TOKENS.ICON_SIZES.LG} className="hidden sm:block" />
              </button>
            </header>

            <main className="p-4 sm:p-6 overflow-y-auto custom-scrollbar max-h-[75vh]">
              <form onSubmit={onSubmit} className="space-y-3.5 sm:space-y-5">
                <AvatarUploader fileInputRef={fileInputRef} previewUrl={previewUrl} onFileChange={onFileChange} />
                <SettingsFormFields form={form} isPending={isPending || isCompressing} />
              </form>
            </main>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
