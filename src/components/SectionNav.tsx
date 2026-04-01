"use client";

import {
  Keyboard,
  Terminal,
  Lightbulb,
  Users,
  Server,
  Brain,
  Settings,
  Flag,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Keyboard,
  Terminal,
  Lightbulb,
  Users,
  Server,
  Brain,
  Settings,
  Flag,
};

interface Section {
  id: string;
  title: string;
  color: string;
  icon: string;
}

interface SectionNavProps {
  sections: Section[];
}

export default function SectionNav({ sections }: SectionNavProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className="no-print flex flex-wrap justify-center gap-2 mb-12">
      {sections.map((section) => {
        const Icon = iconMap[section.icon] || Terminal;
        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:scale-105"
            style={{
              borderColor: `${section.color}30`,
              backgroundColor: `${section.color}10`,
              color: section.color,
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            {section.title}
          </button>
        );
      })}
    </nav>
  );
}
