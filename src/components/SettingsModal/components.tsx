import { Upload, Save, RefreshCw } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import { APP_CONFIG } from '../../constants/config';

export const AvatarUploader = ({
  fileInputRef,
  previewUrl,
  onFileChange
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col items-center">
    <button type="button" className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
      <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-background/80 border-2 border-dashed border-border flex items-center justify-center overflow-hidden shadow-inner">
        {previewUrl ? <img src={previewUrl} alt={APP_STRINGS.UI.AVATAR_ALT} className="w-full h-full object-cover" /> : <Upload className="text-text-muted" size={TOKENS.ICON_SIZES.LG} />}
      </div>
      <div className="absolute inset-0 bg-background/60 rounded-full flex items-center justify-center opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Upload className="text-text-main" size={TOKENS.ICON_SIZES.LG} />
      </div>
    </button>
    <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
    <p className="text-xs-tight uppercase tracking-widest font-bold text-text-muted mt-2 sm:mt-3">{APP_STRINGS.SETTINGS.AVATAR_TITLE}</p>
  </div>
);

export const SettingsFormFields = ({ form, isPending }: { form: UseFormReturn<{ phone?: string; bio?: string | null }>, isPending: boolean }) => (
  <>
    <div className="space-y-1">
      <label htmlFor="settingsPhone" className="text-xs-loose font-bold text-text-muted uppercase tracking-widest ml-1">{APP_STRINGS.SETTINGS.PHONE_TITLE}</label>
      <input id="settingsPhone" type="tel" {...form.register('phone', { onChange: (e) => e.target.value = e.target.value.replace(/[^0-9+]/g, '') })} placeholder={APP_STRINGS.PLACEHOLDERS.PHONE} className="w-full h-10 sm:h-12 bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm outline-none transition-all" />
      {form.formState.errors.phone && <p className="text-xs-tight text-danger ml-1">{form.formState.errors.phone.message?.toString()}</p>}
    </div>

    <div className="space-y-1">
      <label htmlFor="settingsBio" className="text-xs-loose font-bold text-text-muted uppercase tracking-widest ml-1">{APP_STRINGS.SETTINGS.BIO_TITLE}</label>
      <textarea id="settingsBio" {...form.register('bio')} maxLength={APP_CONFIG.LIMITS.MAX_BIO_LENGTH || 100} rows={2} placeholder={APP_STRINGS.PLACEHOLDERS.BIO} className="w-full bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 sm:p-4 text-xs sm:text-sm outline-none transition-all resize-none" />
      {form.formState.errors.bio && <p className="text-xs-tight text-danger ml-1">{form.formState.errors.bio.message?.toString()}</p>}
    </div>

    <button type="submit" disabled={isPending} className="w-full h-10 sm:h-12 mt-1 sm:mt-2 bg-primary sm:hover:bg-primary-hover active:scale-[0.98] sm:hover:scale-[1.02] disabled:sm:hover:scale-100 disabled:active:scale-100 disabled:bg-surface disabled:text-text-muted disabled:border disabled:border-border text-text-inverse text-2xs sm:text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
      {isPending ? <RefreshCw className="animate-spin" size={TOKENS.ICON_SIZES.SM} /> : <Save size={TOKENS.ICON_SIZES.SM} />} {APP_STRINGS.SETTINGS.SAVE_BUTTON}
    </button>
  </>
);
