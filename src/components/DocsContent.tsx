import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Check, Info, Code2 } from 'lucide-react';
import type { DocItem } from '../constants/docsData';
import { TOKENS } from '../constants/tokens';
import { APP_CONFIG } from '../constants/config';
import { APP_STRINGS } from '../constants/strings';

interface DocsContentProps {
  doc: DocItem;
}

export function DocsContent({ doc }: DocsContentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), APP_CONFIG.UI.COPY_FEEDBACK_MS);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.article
      key={doc.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={TOKENS.TRANSITION.NORMAL}
      className="flex-1 p-6 sm:p-10 max-w-4xl"
    >
      <div className="flex items-center gap-2 mb-3">
        {doc.badge && (
          <span className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-2xs font-bold uppercase tracking-wider">
            {doc.badge}
          </span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
        {doc.title}
      </h1>
      <p className="mt-2 text-sm text-text-muted leading-relaxed pb-6 border-b border-border">
        {doc.summary}
      </p>

      <section className="mt-8 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-main">
          Ringkasan & Konsep
        </h2>
        <p className="text-xs sm:text-sm text-text-main/90 leading-relaxed">
          {doc.content.overview}
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-main">
          Poin Kunci & Karakteristik
        </h2>
        <ul className="space-y-2.5">
          {doc.content.highlights.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-main">
              <CheckCircle2 size={TOKENS.ICON_SIZES.MD} className="text-success shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {doc.content.codeBlock && (
        <section className="mt-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
              <Code2 size={TOKENS.ICON_SIZES.SM} className="text-primary" />
              <span>{doc.content.codeBlock.title}</span>
            </div>
            <button
              onClick={() => handleCopyCode(doc.content.codeBlock!.code)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface border border-border text-2xs font-semibold text-text-muted hover:text-text-main transition-colors"
            >
              {copied ? (
                <>
                  <Check size={TOKENS.ICON_SIZES.SM} className="text-success" />
                  <span>{APP_STRINGS.UI.COPIED}</span>
                </>
              ) : (
                <>
                  <Copy size={TOKENS.ICON_SIZES.SM} />
                  <span>{APP_STRINGS.UI.COPY_CODE}</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-surface border border-border overflow-x-auto text-xs text-text-main font-mono leading-relaxed custom-scrollbar">
            <code>{doc.content.codeBlock.code}</code>
          </pre>
        </section>
      )}

      {doc.content.notes && (
        <section className="mt-8 p-4 rounded-2xl bg-info/5 border border-info/20 flex items-start gap-3">
          <Info size={TOKENS.ICON_SIZES.MD} className="text-info shrink-0 mt-0.5" />
          <div className="text-xs text-text-main leading-relaxed">
            <span className="font-bold">{APP_STRINGS.DOCS.NOTE} </span>
            {doc.content.notes}
          </div>
        </section>
      )}
    </motion.article>
  );
}
