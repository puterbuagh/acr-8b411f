"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Spade, Check } from "lucide-react";

type SiteTemplate = {
  id: string;
  name: string;
  description: string;
  regions: string[];
};

const TEMPLATES: SiteTemplate[] = [
  {
    id: "pokerstars",
    name: "PokerStars",
    description: "Cash games & tournaments. Default table theme.",
    regions: ["hole-cards", "community-cards", "pot", "player-stacks", "action-buttons"],
  },
  {
    id: "ggpoker",
    name: "GGPoker",
    description: "Modern HUD layout with bet sizing presets.",
    regions: ["hole-cards", "community-cards", "pot", "player-stacks", "action-buttons", "timer"],
  },
  {
    id: "888poker",
    name: "888poker",
    description: "Classic table view with side panels.",
    regions: ["hole-cards", "community-cards", "pot", "player-stacks"],
  },
  {
    id: "partypoker",
    name: "partypoker",
    description: "Fast-fold and standard tables.",
    regions: ["hole-cards", "community-cards", "pot", "player-stacks"],
  },
  {
    id: "acr",
    name: "Americas Cardroom",
    description: "Custom layout support.",
    regions: ["hole-cards", "community-cards", "pot"],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Define your own OCR regions and parsers.",
    regions: [],
  },
];

export function PokerSiteTemplates() {
  const [selected, setSelected] = useState<string>("pokerstars");

  const handleSelect = (id: string) => {
    setSelected(id);
    try {
      localStorage.setItem("poker-site-template", id);
      toast.success(`${TEMPLATES.find((t) => t.id === id)?.name} template loaded`);
    } catch {
      toast.error("Failed to save template");
    }
  };

  const current = TEMPLATES.find((t) => t.id === selected);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Spade className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display">Active Poker Site</h2>
            <p className="text-sm text-muted-foreground">
              Select your poker client to load pre-configured OCR regions and parsing patterns.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TEMPLATES.map((template) => {
            const isActive = selected === template.id;
            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 rounded-full bg-primary p-1">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                )}
                <div className="font-medium font-display">{template.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {current && current.regions.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-base font-semibold font-display mb-1">Configured Regions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            OCR will scan these regions on {current.name} tables.
          </p>
          <div className="flex flex-wrap gap-2">
            {current.regions.map((region) => (
              <span
                key={region}
                className="rounded-full bg-muted px-3 py-1 text-xs font-mono text-muted-foreground"
              >
                {region}
              </span>
            ))}
          </div>
        </div>
      )}

      {current && current.regions.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Custom templates can be configured via the region selector on the dashboard.
          </p>
        </div>
      )}
    </div>
  );
}

export default PokerSiteTemplates;
