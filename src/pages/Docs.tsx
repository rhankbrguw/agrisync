import { useState, useMemo } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { DocsNav } from '../components/DocsNav';
import { DocsSidebar } from '../components/DocsSidebar';
import { DocsContent } from '../components/DocsContent';
import { DOCS_DATA } from '../constants/docsData';
import { FileQuestion } from 'lucide-react';
import { TOKENS } from '../constants/tokens';
import { APP_STRINGS } from '../constants/strings';

export function Docs() {
  const [activeId, setActiveId] = useState<string>(DOCS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  useDocumentTitle(APP_STRINGS.TITLES.DOCS);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return DOCS_DATA;
    return DOCS_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.content.overview.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const activeDoc = useMemo(() => {
    const found = filteredItems.find((item) => item.id === activeId);
    return found || filteredItems[0] || null;
  }, [filteredItems, activeId]);

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col">
      <DocsNav searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        <DocsSidebar
          items={filteredItems}
          activeId={activeDoc?.id || ''}
          onSelect={setActiveId}
        />

        {activeDoc ? (
          <DocsContent doc={activeDoc} />
        ) : (
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center text-text-muted">
            <FileQuestion size={TOKENS.ICON_SIZES.XXL} className="text-border mb-3" />
            <h2 className="text-sm font-bold text-text-main">{APP_STRINGS.DOCS.TOPIC_NOT_FOUND}</h2>
            <p className="text-xs text-text-muted mt-1">{APP_STRINGS.DOCS.TOPIC_NOT_FOUND_DESC}</p>
          </div>
        )}
      </main>
    </div>
  );
}
