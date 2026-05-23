"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sliders, Gauge, Crop } from "lucide-react";

export function CaptureSettings() {
  const [confidence, setConfidence] = useState(75);
  const [fps, setFps] = useState(2);
  const [region, setRegion] = useState("full");
  const [dirty, setDirty] = useState(false);

  const markDirty = () => setDirty(true);

  const handleSave = () => {
    try {
      localStorage.setItem(
        "capture-settings",
        JSON.stringify({ confidence, fps, region })
      );
      setDirty(false);
      toast.success("Capture settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Gauge className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display">OCR Confidence Threshold</h2>
            <p className="text-sm text-muted-foreground">
              Minimum confidence required to accept OCR-detected text. Higher values reduce false positives.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="confidence">Confidence</label>
            <span className="text-sm tabular-nums font-mono text-primary">{confidence}%</span>
          </div>
          <input
            id="confidence"
            type="range"
            min={50}
            max={99}
            value={confidence}
            onChange={(e) => {
              setConfidence(Number(e.target.value));
              markDirty();
            }}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Permissive (50%)</span>
            <span>Strict (99%)</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Sliders className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display">Frame Capture Rate</h2>
            <p className="text-sm text-muted-foreground">
              How often to sample the screen for game state changes. Higher rates use more CPU.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 4, 8].map((rate) => (
            <button
              key={rate}
              onClick={() => {
                setFps(rate);
                markDirty();
              }}
              className={`rounded-md border-2 px-4 py-3 text-sm font-medium transition-colors ${
                fps === rate
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              {rate} fps
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Crop className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display">Screen Region</h2>
            <p className="text-sm text-muted-foreground">
              Limit OCR to a specific region of the captured screen for better performance.
            </p>
          </div>
        </div>

        <select
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            markDirty();
          }}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="full">Full screen</option>
          <option value="center">Center (table area)</option>
          <option value="custom">Custom region (configure below)</option>
        </select>
      </div>

      {dirty && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save changes
          </button>
        </div>
      )}
    </div>
  );
}

export default CaptureSettings;
