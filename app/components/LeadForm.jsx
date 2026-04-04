"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "lib/analytics";

const discoverySlots = [
  { label: "Mon 7:30 PM IST", date: "2026-04-06", time: "19:30", timezone: "Asia/Kolkata" },
  { label: "Tue 9:00 PM IST", date: "2026-04-07", time: "21:00", timezone: "Asia/Kolkata" },
  { label: "Wed 11:30 AM UTC", date: "2026-04-08", time: "11:30", timezone: "UTC" },
  { label: "Thu 8:00 PM IST", date: "2026-04-09", time: "20:00", timezone: "Asia/Kolkata" }
];

const defaults = {
  name: "",
  email: "",
  engagementType: "Project Build",
  service: "Frontend System Build",
  budget: "$1k-$3k",
  timeline: "2-4 weeks",
  callDate: "",
  callTime: "",
  timezone: "Asia/Kolkata",
  brief: "",
  source: "Portfolio Site"
};

export default function LeadForm() {
  const [formData, setFormData] = useState(defaults);
  const [submitState, setSubmitState] = useState("idle");
  const [message, setMessage] = useState("");

  const isDiscovery = useMemo(
    () => formData.engagementType.toLowerCase() === "discovery call",
    [formData.engagementType]
  );

  const onChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applySlot = (slot) => {
    setFormData((prev) => ({
      ...prev,
      engagementType: "Discovery Call",
      callDate: slot.date,
      callTime: slot.time,
      timezone: slot.timezone
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setSubmitState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Unable to submit right now.");
      }

      trackEvent("lead_submit_success", {
        service: formData.service,
        engagementType: formData.engagementType,
        source: formData.source
      });

      setSubmitState("success");
      setMessage(
        formData.engagementType === "Discovery Call"
          ? "Booking request received. I will confirm your slot by email."
          : "Project inquiry received. I will reply with next steps shortly."
      );
      setFormData(defaults);
    } catch (error) {
      trackEvent("lead_submit_error", {
        service: formData.service,
        engagementType: formData.engagementType,
        message: error instanceof Error ? error.message : "unknown_error"
      });

      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Unexpected error.");
    }
  };

  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          Name
          <input required value={formData.name} onChange={onChange("name")} placeholder="Your name" />
        </label>

        <label>
          Email
          <input
            required
            type="email"
            value={formData.email}
            onChange={onChange("email")}
            placeholder="you@company.com"
          />
        </label>

        <label>
          Engagement
          <select value={formData.engagementType} onChange={onChange("engagementType")}>
            <option>Project Build</option>
            <option>Discovery Call</option>
            <option>Growth Sprint</option>
            <option>Retainer</option>
          </select>
        </label>

        <label>
          Service Focus
          <select value={formData.service} onChange={onChange("service")}>
            <option>Frontend System Build</option>
            <option>Automation + Tooling</option>
            <option>Growth Engineering</option>
            <option>Creative Ops Delivery</option>
          </select>
        </label>

        <label>
          Budget
          <select value={formData.budget} onChange={onChange("budget")}>
            <option>$1k-$3k</option>
            <option>$3k-$7k</option>
            <option>$7k-$15k</option>
            <option>$15k+</option>
            <option>Not Sure Yet</option>
          </select>
        </label>

        <label>
          Timeline
          <select value={formData.timeline} onChange={onChange("timeline")}>
            <option>ASAP</option>
            <option>1-2 weeks</option>
            <option>2-4 weeks</option>
            <option>1-2 months</option>
          </select>
        </label>
      </div>

      {isDiscovery ? (
        <section className="slot-picker">
          <p>Quick slot presets:</p>
          <div className="slot-grid">
            {discoverySlots.map((slot) => (
              <button
                type="button"
                key={slot.label}
                className="slot-button"
                onClick={() => applySlot(slot)}
              >
                {slot.label}
              </button>
            ))}
          </div>

          <div className="form-grid slot-fields">
            <label>
              Call Date
              <input
                type="date"
                value={formData.callDate}
                onChange={onChange("callDate")}
                required={isDiscovery}
              />
            </label>

            <label>
              Call Time
              <input
                type="time"
                value={formData.callTime}
                onChange={onChange("callTime")}
                required={isDiscovery}
              />
            </label>

            <label>
              Timezone
              <input
                value={formData.timezone}
                onChange={onChange("timezone")}
                placeholder="Asia/Kolkata"
                required={isDiscovery}
              />
            </label>
          </div>
        </section>
      ) : null}

      <label>
        Project Brief
        <textarea
          required
          rows={7}
          value={formData.brief}
          onChange={onChange("brief")}
          placeholder="Describe your goal, audience, and what success looks like."
        />
      </label>

      <div className="form-actions">
        <button disabled={submitState === "loading"} type="submit" className="submit-button">
          {submitState === "loading" ? "Sending..." : "Submit Request"}
        </button>
        <p className={submitState === "error" ? "feedback error" : "feedback"}>{message}</p>
      </div>
    </form>
  );
}
