"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionNav from "@/components/SectionNav";
import CheatsheetSection from "@/components/CheatsheetSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import cheatsheetData from "../../data/cheatsheet.json";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const totalItems = useMemo(
    () =>
      cheatsheetData.sections.reduce(
        (sum, section) => sum + section.items.length,
        0
      ),
    []
  );

  const matchCount = useMemo(() => {
    if (!searchQuery) return totalItems;
    return cheatsheetData.sections.reduce((sum, section) => {
      return (
        sum +
        section.items.filter(
          (item) =>
            item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.explanation.toLowerCase().includes(searchQuery.toLowerCase())
        ).length
      );
    }, 0);
  }, [searchQuery, totalItems]);

  return (
    <div className="min-h-screen">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main>
        <Hero
          version={cheatsheetData.version}
          lastUpdated={cheatsheetData.lastUpdated}
          totalItems={totalItems}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <SectionNav sections={cheatsheetData.sections} />

          {/* Search Results Info */}
          {searchQuery && (
            <div className="text-center mb-8">
              <p className="text-[#8b949e] text-sm">
                Found{" "}
                <span className="text-[#a855f7] font-medium">
                  {matchCount}
                </span>{" "}
                results for &ldquo;
                <span className="text-white">{searchQuery}</span>&rdquo;
              </p>
            </div>
          )}

          {/* Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cheatsheetData.sections.map((section) => (
              <div key={section.id} id={section.id}>
                <CheatsheetSection
                  section={section}
                  searchQuery={searchQuery}
                />
              </div>
            ))}
          </div>

          {/* No Results */}
          {searchQuery && matchCount === 0 && (
            <div className="text-center py-16">
              <p className="text-[#8b949e] text-lg">
                No results found for &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-[#8b949e] text-sm mt-2">
                Try a different search term
              </p>
            </div>
          )}
        </div>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
