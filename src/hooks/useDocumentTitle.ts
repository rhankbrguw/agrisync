import { useEffect, useRef } from 'react';

export function useDocumentTitle(title: string) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const saved = defaultTitle.current;
    return () => {
      document.title = saved;
    };
  }, []);
}
