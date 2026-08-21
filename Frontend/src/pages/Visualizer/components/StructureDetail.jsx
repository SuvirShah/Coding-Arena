import React from "react";
import { useParams, Link } from "react-router";
import { structuresData } from "../data/structuresData";

export default function StructureDetail() {
  const { id } = useParams();
  
  // Provide a minimal fallback if id is not found
  const data = structuresData[id] || {
    title: id ? id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Topic Not Found",
    summary: "Detailed content is under construction.",
    badges: ["Coming Soon"],
    definition: "Coming soon.",
    intuition: "Coming soon.",
    why: "Coming soon.",
    structure: "Coming soon.",
    timeComplexity: [],
    spaceComplexity: "N/A",
    operations: [],
    pros: [],
    cons: [],
    useCases: [],
    whereUsed: "Coming soon.",
    mistakes: [],
    interview: "Coming soon.",
    implementations: {},
    related: []
  };

  return (
    <article className="text-[#EAEAEA] font-sans pb-24 antialiased">
      
      {/* 1. HERO HEADER AREA */}
      <header className="mb-14">
        <div className="flex flex-wrap gap-2 mb-6">
          {data.badges.map((badge, i) => (
            <span key={i} className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
              {badge}
            </span>
          ))}
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
          {data.title}
        </h1>
        <p className="text-xl lg:text-2xl text-[#a09880] font-light leading-relaxed max-w-4xl border-l-4 border-yellow-500 pl-6 py-2">
          {data.summary}
        </p>
      </header>

      <div className="space-y-16">
        
        {/* NEW: HISTORY & FACTS */}
        {(data.history || (data.facts && data.facts.length > 0)) && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.history && (
              <div className="md:col-span-2 bg-[#1a1611] rounded-3xl p-8 shadow-xl border border-[#332b21]">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="text-amber-500 mr-3 text-2xl">📜</span> History & Origins
                </h2>
                <p className="text-[#EAEAEA] leading-relaxed text-lg">{data.history}</p>
              </div>
            )}
            {data.facts && data.facts.length > 0 && (
              <div className="md:col-span-1 bg-[#1a1611] rounded-3xl p-8 shadow-xl border border-[#332b21] bg-gradient-to-br from-[#1a1611] to-[#211c15]/50">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                  <span className="text-emerald-500 mr-2 text-xl">✨</span> Interesting Facts
                </h2>
                <ul className="space-y-3">
                  {data.facts.map((fact, i) => (
                    <li key={i} className="text-[#EAEAEA] text-sm leading-relaxed flex items-start">
                      <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* 2. OVERVIEW: DEFINITION & INTUITION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1a1611] rounded-3xl p-8 shadow-xl border border-[#332b21] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center relative z-10">
              <span className="text-yellow-500 mr-3 text-2xl">●</span> Definition
            </h2>
            <p className="text-[#EAEAEA] leading-relaxed text-lg relative z-10">{data.definition}</p>
          </div>
          <div className="bg-[#1a1611] rounded-3xl p-8 shadow-xl border border-[#332b21] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center relative z-10">
              <span className="text-amber-500 mr-3 text-2xl">💡</span> Intuition
            </h2>
            <p className="text-[#EAEAEA] leading-relaxed text-lg relative z-10">{data.intuition}</p>
          </div>
        </section>

        {/* 3. ARCHITECTURE */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-yellow-400 uppercase mb-3">Why it exists</h3>
              <p className="text-[#EAEAEA] leading-relaxed text-lg">{data.why}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-widest text-amber-400 uppercase mb-3">Internal Structure</h3>
              <p className="text-[#EAEAEA] leading-relaxed text-lg">{data.structure}</p>
            </div>
          </div>
          {data.engineeringRelevance && (
            <div className="bg-[#1a1611] rounded-2xl p-6 border-l-4 border-emerald-500 shadow-sm">
              <h3 className="text-sm font-bold tracking-widest text-emerald-400 uppercase mb-2">Practical Engineering Relevance</h3>
              <p className="text-[#EAEAEA] leading-relaxed text-lg">{data.engineeringRelevance}</p>
            </div>
          )}
        </section>

        {/* 4. COMPLEXITY TABLE */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center justify-between">
            Complexity
            <span className="bg-[#1a1611] text-amber-400 text-sm font-mono px-4 py-2 rounded-xl border border-[#332b21] shadow-sm">
              Space: <span className="font-bold text-white">{data.spaceComplexity}</span>
            </span>
          </h2>
          
          <div className="bg-[#1a1611] rounded-3xl border border-[#332b21] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#15120d] border-b border-[#332b21]">
                    <th className="px-8 py-5 text-xs font-extrabold text-[#7a7260] uppercase tracking-widest">Operation</th>
                    <th className="px-8 py-5 text-xs font-extrabold text-[#7a7260] uppercase tracking-widest">Time</th>
                    <th className="px-8 py-5 text-xs font-extrabold text-[#7a7260] uppercase tracking-widest">Space</th>
                    <th className="px-8 py-5 text-xs font-extrabold text-[#7a7260] uppercase tracking-widest">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#332b21]/50">
                  {data.timeComplexity.length > 0 ? (
                    data.timeComplexity.map((tc, i) => (
                      <tr key={i} className="hover:bg-[#332b21]/30 transition-colors">
                        <td className="px-8 py-6 text-white font-semibold text-lg">{tc.op}</td>
                        <td className="px-8 py-6 text-yellow-400 font-mono text-lg">{tc.time}</td>
                        <td className="px-8 py-6 text-amber-400 font-mono text-lg">{tc.space}</td>
                        <td className="px-8 py-6 text-[#a09880] text-sm leading-relaxed">{tc.notes}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="px-8 py-6 text-[#7a7260]">No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. PROS & CONS (SIDE-BY-SIDE) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-3xl p-10 shadow-lg">
            <h3 className="text-2xl font-bold text-emerald-400 mb-8 flex items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
                <span className="text-emerald-500 text-lg">✓</span>
              </div>
              Advantages
            </h3>
            <ul className="space-y-5">
              {data.pros.length > 0 ? data.pros.map((pro, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 mr-4 flex-shrink-0"></div>
                  <span className="text-[#EAEAEA] text-lg leading-relaxed">{pro}</span>
                </li>
              )) : <li className="text-[#7a7260]">No data available</li>}
            </ul>
          </div>
          <div className="bg-rose-950/20 border border-rose-900/30 rounded-3xl p-10 shadow-lg">
            <h3 className="text-2xl font-bold text-rose-400 mb-8 flex items-center">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center mr-4">
                <span className="text-rose-500 text-lg">✕</span>
              </div>
              Disadvantages
            </h3>
            <ul className="space-y-5">
              {data.cons.length > 0 ? data.cons.map((con, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2.5 mr-4 flex-shrink-0"></div>
                  <span className="text-[#EAEAEA] text-lg leading-relaxed">{con}</span>
                </li>
              )) : <li className="text-[#7a7260]">No data available</li>}
            </ul>
          </div>
        </section>

        {/* 6. USAGE & INTERVIEW */}
        <section className="bg-[#1a1611] rounded-3xl p-10 border border-[#332b21] shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-emerald-400 uppercase mb-4">When to use</h3>
              <p className="text-[#EAEAEA] text-lg leading-relaxed mb-8">{data.whenToUse}</p>
              
              <h3 className="text-sm font-bold tracking-widest text-rose-400 uppercase mb-4">When NOT to use</h3>
              <p className="text-[#EAEAEA] text-lg leading-relaxed">{data.whenNotToUse}</p>
            </div>
            
            <div className="border-l border-[#332b21] pl-0 md:pl-12">
              <h3 className="text-sm font-bold tracking-widest text-yellow-400 uppercase mb-4">Real-world Applications</h3>
              <ul className="space-y-3 mb-8">
                {data.useCases.length > 0 ? data.useCases.map((uc, i) => (
                  <li key={i} className="text-[#EAEAEA] text-lg flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-yellow-500 before:rounded-full before:mr-3">
                    {uc}
                  </li>
                )) : <li className="text-[#7a7260]">No data available</li>}
              </ul>

              <h3 className="text-sm font-bold tracking-widest text-amber-400 uppercase mb-4">Interview Priority</h3>
              <p className="text-[#EAEAEA] text-lg leading-relaxed bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                {data.interview}
              </p>
            </div>
          </div>
        </section>

        {/* 7. COMMON MISTAKES (CALLOUT) */}
        {data.mistakes && data.mistakes.length > 0 && (
          <section className="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-amber-400 mb-5 flex items-center">
              <span className="text-2xl mr-3">⚠️</span> Common Pitfalls & Mistakes
            </h3>
            <ul className="space-y-3 ml-2">
              {data.mistakes.map((m, i) => (
                <li key={i} className="text-[#EAEAEA] text-lg flex items-start">
                  <span className="text-amber-500 mr-3 mt-0.5">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 8. LANGUAGE IMPLEMENTATIONS */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Implementations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(data.implementations).length > 0 ? Object.entries(data.implementations).map(([lang, code]) => (
              <div key={lang} className="rounded-2xl overflow-hidden border border-[#3d3326] shadow-lg bg-[#211c15]">
                <div className="bg-[#1a1611] px-6 py-4 border-b border-[#332b21] flex justify-between items-center">
                  <span className="text-sm font-extrabold text-[#EAEAEA] uppercase tracking-widest">{lang}</span>
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3d3326]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3d3326]"></div>
                  </div>
                </div>
                <pre className="p-6 text-sm font-mono text-emerald-300 overflow-x-auto m-0 leading-relaxed">
                  <code>{code}</code>
                </pre>
              </div>
            )) : <p className="text-[#7a7260]">No code samples available.</p>}
          </div>
        </section>

        {/* 9. RELATED STRUCTURES */}
        {data.related && data.related.length > 0 && (
          <section className="pt-8 border-t border-[#332b21]">
            <h3 className="text-sm font-bold tracking-widest text-[#7a7260] uppercase mb-6">Related Structures</h3>
            <div className="flex flex-wrap gap-4">
              {data.related.map((rel, i) => (
                <Link key={i} to={rel.path} className="px-5 py-2.5 bg-[#1a1611] border border-[#3d3326] rounded-xl text-sm font-semibold text-yellow-400 hover:bg-[#332b21] hover:text-yellow-300 hover:border-yellow-500/50 transition-all duration-300 shadow-sm">
                  {rel.name}
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
}
