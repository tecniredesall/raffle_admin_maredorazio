import { useEffect, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function CacheBusterProvider({ children }: Props) {
  useEffect(() => {
    const metaNames = [
      { httpEquiv: "Cache-Control", content: "no-store, no-cache, must-revalidate, max-age=0" },
      { httpEquiv: "Pragma", content: "no-cache" },
      { httpEquiv: "Expires", content: "0" },
    ];

    const metas: HTMLMetaElement[] = [];

    metaNames.forEach(({ httpEquiv, content }) => {
      const existing = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
      if (!existing) {
        const meta = document.createElement("meta");
        meta.httpEquiv = httpEquiv;
        meta.content = content;
        document.head.appendChild(meta);
        metas.push(meta);
      }
    });

    return () => {
      metas.forEach((meta) => meta.remove());
    };
  }, []);

  return <>{children}</>;
}
