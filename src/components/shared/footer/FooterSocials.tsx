"use client";

import dynamic from "next/dynamic";

const IconRenderer = dynamic(() => import("@/components/shared/IconRenderer"), {
  ssr: false,
  loading: () => <span className="w-5 h-5 inline-block" aria-hidden="true" />,
});

interface SocialLink {
  id: string;
  name: string;
  icon: string;
  link: string;
}

export default function FooterSocials({ links }: { links: SocialLink[] }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {links.map((social) => (
        <a
          key={social.id}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          title={social.name}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm"
        >
          <IconRenderer name={social.icon} className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}
