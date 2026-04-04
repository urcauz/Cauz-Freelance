"use client";

import { useMemo, useState } from "react";

const visualModes = ["Cinematic", "Editorial", "Neo Brutal", "Minimal Luxury"];
const motionProfiles = ["Smooth", "Aggressive", "Precision", "Experimental"];
const contentStyles = ["Story-first", "Data-first", "Offer-first"];
const previewModes = ["conversion", "pricing", "testimonial"];
const viewportModes = ["desktop", "mobile"];

const visualTokens = {
  Cinematic: {
    bg: "linear-gradient(145deg, #151018, #23122c 44%, #2f1642)",
    border: "rgba(255, 176, 96, 0.32)",
    accent: "#ff9a5c",
    accentSoft: "rgba(255, 154, 92, 0.22)",
    text: "#f8ecff",
    muted: "#d1b7e9"
  },
  Editorial: {
    bg: "linear-gradient(145deg, #10161f, #15232f 44%, #1d2d3b)",
    border: "rgba(121, 202, 255, 0.28)",
    accent: "#74dbff",
    accentSoft: "rgba(116, 219, 255, 0.2)",
    text: "#eaf8ff",
    muted: "#b9cfdb"
  },
  "Neo Brutal": {
    bg: "linear-gradient(145deg, #17130d, #292010 44%, #3a2911)",
    border: "rgba(255, 214, 116, 0.32)",
    accent: "#ffcc69",
    accentSoft: "rgba(255, 204, 105, 0.22)",
    text: "#fff6de",
    muted: "#e2cfa0"
  },
  "Minimal Luxury": {
    bg: "linear-gradient(145deg, #111520, #182134 44%, #212b42)",
    border: "rgba(168, 188, 235, 0.31)",
    accent: "#9fc0ff",
    accentSoft: "rgba(159, 192, 255, 0.2)",
    text: "#eef3ff",
    muted: "#bdc8e4"
  }
};

const interactionPresets = {
  smooth: {
    label: "Smooth",
    duration: "0.32s",
    easing: "cubic-bezier(.2,.74,.2,1)",
    lift: 6
  },
  snappy: {
    label: "Snappy",
    duration: "0.2s",
    easing: "cubic-bezier(.27,1.32,.62,1)",
    lift: 10
  },
  cinematic: {
    label: "Cinematic",
    duration: "0.5s",
    easing: "cubic-bezier(.18,.88,.22,1)",
    lift: 7
  }
};

const scenarios = [
  {
    id: "launch",
    name: "Launch Sprint",
    summary: "Fast product launch with clear CTA structure.",
    values: {
      visualMode: "Editorial",
      motionProfile: "Precision",
      contentStyle: "Offer-first",
      complexity: 62,
      conversionBias: 84,
      interaction: "smooth",
      previewMode: "conversion"
    }
  },
  {
    id: "rebrand",
    name: "Rebrand Push",
    summary: "Stronger brand signal while keeping conversions tight.",
    values: {
      visualMode: "Cinematic",
      motionProfile: "Smooth",
      contentStyle: "Story-first",
      complexity: 74,
      conversionBias: 71,
      interaction: "cinematic",
      previewMode: "testimonial"
    }
  },
  {
    id: "sales",
    name: "Sales Focus",
    summary: "Pricing-led layout for direct offer clarity.",
    values: {
      visualMode: "Neo Brutal",
      motionProfile: "Aggressive",
      contentStyle: "Data-first",
      complexity: 70,
      conversionBias: 91,
      interaction: "snappy",
      previewMode: "pricing"
    }
  }
];

const defaults = {
  scenarioId: scenarios[0].id,
  visualMode: scenarios[0].values.visualMode,
  motionProfile: scenarios[0].values.motionProfile,
  contentStyle: scenarios[0].values.contentStyle,
  complexity: scenarios[0].values.complexity,
  conversionBias: scenarios[0].values.conversionBias,
  interaction: scenarios[0].values.interaction,
  radius: 20,
  shadowDepth: 52,
  previewMode: scenarios[0].values.previewMode,
  viewportMode: "desktop"
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function PlaygroundPage() {
  const [scenarioId, setScenarioId] = useState(defaults.scenarioId);
  const [visualMode, setVisualMode] = useState(defaults.visualMode);
  const [motionProfile, setMotionProfile] = useState(defaults.motionProfile);
  const [contentStyle, setContentStyle] = useState(defaults.contentStyle);
  const [complexity, setComplexity] = useState(defaults.complexity);
  const [conversionBias, setConversionBias] = useState(defaults.conversionBias);
  const [interaction, setInteraction] = useState(defaults.interaction);
  const [radius, setRadius] = useState(defaults.radius);
  const [shadowDepth, setShadowDepth] = useState(defaults.shadowDepth);
  const [previewMode, setPreviewMode] = useState(defaults.previewMode);
  const [viewportMode, setViewportMode] = useState(defaults.viewportMode);
  const [exportMessage, setExportMessage] = useState("");

  const selectedVisual = useMemo(() => {
    return visualTokens[visualMode] || visualTokens.Cinematic;
  }, [visualMode]);

  const interactionToken = interactionPresets[interaction] || interactionPresets.smooth;

  const qualityScore = useMemo(() => {
    const complexityBalance = 100 - Math.abs(complexity - 68);
    const conversionWeight = conversionBias;
    const styleWeight = contentStyle === "Data-first" ? 90 : contentStyle === "Offer-first" ? 88 : 84;
    const combined = complexityBalance * 0.35 + conversionWeight * 0.45 + styleWeight * 0.2;
    return Math.round(clamp(combined, 0, 100));
  }, [complexity, contentStyle, conversionBias]);

  const strategyNotes = useMemo(() => {
    const sectionOrder =
      contentStyle === "Story-first"
        ? "Narrative hero -> trust proof -> process -> CTA"
        : contentStyle === "Data-first"
          ? "Outcome headline -> metrics block -> case proof -> CTA"
          : "Offer statement -> deliverables -> objections -> booking CTA";

    const heroLine =
      visualMode === "Cinematic"
        ? "High-contrast visual storytelling with controlled pacing."
        : visualMode === "Editorial"
          ? "Clear typography system with balanced spacing and hierarchy."
          : visualMode === "Neo Brutal"
            ? "Bold shapes and high emphasis for immediate attention."
            : "Minimal layout with focused accents and restrained motion.";

    const ctaLine =
      conversionBias > 78
        ? "Primary CTA repeated in hero and closing section."
        : "CTA appears at key checkpoints without visual pressure.";

    return { heroLine, sectionOrder, ctaLine };
  }, [contentStyle, conversionBias, visualMode]);

  const liveComponentVars = useMemo(() => {
    const blurShadow =
      "0 " +
      Math.max(16, Math.round(shadowDepth / 3)) +
      "px " +
      shadowDepth +
      "px rgba(0, 0, 0, 0.4)";

    return {
      "--lab-bg": selectedVisual.bg,
      "--lab-border": selectedVisual.border,
      "--lab-accent": selectedVisual.accent,
      "--lab-accent-soft": selectedVisual.accentSoft,
      "--lab-text": selectedVisual.text,
      "--lab-muted": selectedVisual.muted,
      "--lab-radius": radius + "px",
      "--lab-shadow": blurShadow,
      "--lab-duration": interactionToken.duration,
      "--lab-easing": interactionToken.easing,
      "--lab-lift": interactionToken.lift + "px"
    };
  }, [interactionToken.duration, interactionToken.easing, interactionToken.lift, radius, selectedVisual, shadowDepth]);

  const previewContent = useMemo(() => {
    if (previewMode === "pricing") {
      return {
        badge: "Pricing Preview",
        title: "Growth Build Package",
        text: "Two-week delivery focused on messaging clarity and conversion structure.",
        metricValue: "$4.8k",
        metricLabel: "Starting package",
        primaryAction: "Request Scope",
        secondaryAction: "Compare Plans"
      };
    }

    if (previewMode === "testimonial") {
      return {
        badge: "Testimonial Preview",
        title: "Client Signal Block",
        text: "Client feedback section tuned for trust before the booking CTA.",
        metricValue: "5.0/5",
        metricLabel: "Client rating",
        primaryAction: "View Outcomes",
        secondaryAction: "Open Case"
      };
    }

    return {
      badge: "Conversion Preview",
      title: "Hero Conversion Block",
      text: "Lead capture section with clear offer framing and direct action.",
      metricValue: "+31%",
      metricLabel: "CTR in one test",
      primaryAction: "Book This Style",
      secondaryAction: "Use in Hero"
    };
  }, [previewMode]);

  const buildBrief = useMemo(() => {
    return [
      "PLAYGROUND BRIEF",
      "Visual Mode: " + visualMode,
      "Motion Profile: " + motionProfile,
      "Content Style: " + contentStyle,
      "Complexity: " + complexity,
      "Conversion Pressure: " + conversionBias,
      "Section Order: " + strategyNotes.sectionOrder,
      "Hero Note: " + strategyNotes.heroLine,
      "CTA Note: " + strategyNotes.ctaLine
    ].join("\n");
  }, [complexity, contentStyle, conversionBias, motionProfile, strategyNotes.ctaLine, strategyNotes.heroLine, strategyNotes.sectionOrder, visualMode]);

  const copyExport = async (payload, label) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
      } else {
        const node = document.createElement("textarea");
        node.value = payload;
        document.body.appendChild(node);
        node.select();
        document.execCommand("copy");
        document.body.removeChild(node);
      }

      setExportMessage(label + " copied.");
      setTimeout(() => setExportMessage(""), 1600);
    } catch {
      setExportMessage("Clipboard unavailable in this browser.");
      setTimeout(() => setExportMessage(""), 1600);
    }
  };

  const applyScenario = (nextScenario) => {
    setScenarioId(nextScenario.id);
    setVisualMode(nextScenario.values.visualMode);
    setMotionProfile(nextScenario.values.motionProfile);
    setContentStyle(nextScenario.values.contentStyle);
    setComplexity(nextScenario.values.complexity);
    setConversionBias(nextScenario.values.conversionBias);
    setInteraction(nextScenario.values.interaction);
    setPreviewMode(nextScenario.values.previewMode);
  };

  const randomizeSettings = () => {
    setScenarioId("custom");
    setVisualMode(randomPick(visualModes));
    setMotionProfile(randomPick(motionProfiles));
    setContentStyle(randomPick(contentStyles));
    setComplexity(randomInt(30, 96));
    setConversionBias(randomInt(34, 98));
    setInteraction(randomPick(Object.keys(interactionPresets)));
    setRadius(randomInt(10, 30));
    setShadowDepth(randomInt(34, 88));
    setPreviewMode(randomPick(previewModes));
    setViewportMode(randomPick(viewportModes));
  };

  const resetSettings = () => {
    setScenarioId(defaults.scenarioId);
    setVisualMode(defaults.visualMode);
    setMotionProfile(defaults.motionProfile);
    setContentStyle(defaults.contentStyle);
    setComplexity(defaults.complexity);
    setConversionBias(defaults.conversionBias);
    setInteraction(defaults.interaction);
    setRadius(defaults.radius);
    setShadowDepth(defaults.shadowDepth);
    setPreviewMode(defaults.previewMode);
    setViewportMode(defaults.viewportMode);
  };

  return (
    <div className="page page-playground">
      <section className="section-block section-hero">
        <p className="eyebrow">Interactive Playground</p>
        <h1>Live concept lab for how I design and think.</h1>
        <p className="lead">
          This page is intentionally interactive so potential clients can feel the process, not just read
          about it.
        </p>
      </section>

      <section className="section-block playground-grid">
        <article className="panel-card">
          <h3>Creative Controls</h3>

          <label>
            Visual Direction
            <select
              value={visualMode}
              onChange={(event) => {
                setScenarioId("custom");
                setVisualMode(event.target.value);
              }}
            >
              {visualModes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Motion Profile
            <select
              value={motionProfile}
              onChange={(event) => {
                setScenarioId("custom");
                setMotionProfile(event.target.value);
              }}
            >
              {motionProfiles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Content Style
            <select
              value={contentStyle}
              onChange={(event) => {
                setScenarioId("custom");
                setContentStyle(event.target.value);
              }}
            >
              {contentStyles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Interface Complexity ({complexity})
            <input
              type="range"
              min="0"
              max="100"
              value={complexity}
              onChange={(event) => {
                setScenarioId("custom");
                setComplexity(Number(event.target.value));
              }}
            />
          </label>

          <label>
            Conversion Pressure ({conversionBias})
            <input
              type="range"
              min="0"
              max="100"
              value={conversionBias}
              onChange={(event) => {
                setScenarioId("custom");
                setConversionBias(Number(event.target.value));
              }}
            />
          </label>
        </article>

        <article className="panel-card blueprint">
          <p className="eyebrow">Scenario Presets</p>
          <h3>Prebuilt setups for common freelance goals.</h3>
          <div className="scenario-grid">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={scenarioId === scenario.id ? "chip scenario-pill active" : "chip scenario-pill"}
                onClick={() => applyScenario(scenario)}
              >
                {scenario.name}
              </button>
            ))}
          </div>
          <div className="build-brief">
            <p>
              <strong>Focus:</strong> {strategyNotes.heroLine}
            </p>
            <p>
              <strong>Structure:</strong> {strategyNotes.sectionOrder}
            </p>
            <p>
              <strong>CTA Logic:</strong> {strategyNotes.ctaLine}
            </p>
          </div>
        </article>

        <article className="panel-card visual-lab">
          <p className="eyebrow">Motion + Layer Test</p>
          <div className="lab-stage">
            <span className="blob blob-a" />
            <span className="blob blob-b" />
            <span className="blob blob-c" />
            <div className="lab-grid" />
          </div>
          <p>
            I prototype visual behavior directly in-browser to tune performance and make the final experience
            feel polished.
          </p>
        </article>
      </section>

      <section className="section-block component-lab">
        <article className="panel-card lab-controls">
          <p className="eyebrow">Live Component Lab</p>
          <h3>Stable controls, useful presets, and reusable output.</h3>

          <div className="lab-toolbar">
            <button type="button" className="lab-copy" onClick={randomizeSettings}>
              Randomize
            </button>
            <button type="button" className="lab-copy" onClick={resetSettings}>
              Reset
            </button>
            <button type="button" className="lab-copy" onClick={() => copyExport(buildBrief, "Brief")}>
              Copy Brief
            </button>
          </div>

          <div className="playground-metrics">
            <div className="metric-pill">
              <strong>{qualityScore}</strong>
              <span>Quality Score</span>
            </div>
            <div className="metric-pill">
              <strong>{previewMode}</strong>
              <span>Preview Type</span>
            </div>
            <div className="metric-pill">
              <strong>{viewportMode}</strong>
              <span>Viewport</span>
            </div>
          </div>

          <label>
            Corner Radius ({radius}px)
            <input
              type="range"
              min="8"
              max="32"
              value={radius}
              onChange={(event) => setRadius(Number(event.target.value))}
            />
          </label>

          <label>
            Shadow Depth ({shadowDepth}px)
            <input
              type="range"
              min="26"
              max="90"
              value={shadowDepth}
              onChange={(event) => setShadowDepth(Number(event.target.value))}
            />
          </label>

          <div className="interaction-row">
            {Object.entries(interactionPresets).map(([key, value]) => (
              <button
                key={key}
                type="button"
                className={interaction === key ? "chip active" : "chip"}
                onClick={() => setInteraction(key)}
              >
                {value.label}
              </button>
            ))}
          </div>

          <div className="interaction-row">
            {previewModes.map((mode) => (
              <button
                key={mode}
                type="button"
                className={previewMode === mode ? "chip active" : "chip"}
                onClick={() => setPreviewMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="interaction-row">
            {viewportModes.map((mode) => (
              <button
                key={mode}
                type="button"
                className={viewportMode === mode ? "chip active" : "chip"}
                onClick={() => setViewportMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>

          <p className="export-message">{exportMessage}</p>
          <pre className="code-export">{buildBrief}</pre>
        </article>

        <div className={viewportMode === "mobile" ? "lab-preview-wrap mobile" : "lab-preview-wrap"}>
          <article className="live-component" style={liveComponentVars}>
            <span className="live-badge">{previewContent.badge}</span>
            <h4>{previewContent.title}</h4>
            <p>{previewContent.text}</p>
            <div className="live-metrics">
              <strong>{previewContent.metricValue}</strong>
              <span>{previewContent.metricLabel}</span>
            </div>
            <button type="button" className="live-action">
              {previewContent.primaryAction}
            </button>
          </article>

          <article className="live-component mini" style={liveComponentVars}>
            <span className="live-badge">Secondary Block</span>
            <h4>Support Card</h4>
            <p>Companion section for proof, objection handling, or quick process clarity.</p>
            <button type="button" className="live-action ghost">
              {previewContent.secondaryAction}
            </button>
          </article>
        </div>
      </section>
    </div>
  );
}
