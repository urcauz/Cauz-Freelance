import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readDashboardData } from "lib/dashboardStore";

export const dynamic = "force-dynamic";

const ADMIN_COOKIE_NAME = "cauz_admin_session";

function safeText(value, fallback = "N/A") {
  const text = String(value || "").trim();
  return text ? text : fallback;
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatEventLabel(name) {
  return String(name || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function countBy(items, keyGetter) {
  const map = new Map();
  for (const item of items) {
    const key = keyGetter(item);
    if (!key) continue;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

function computeSummary(leads, events) {
  const requests = leads || [];
  const analytics = events || [];

  const discoveryCount = requests.filter((item) =>
    safeText(item.engagementType, "").toLowerCase().includes("discovery")
  ).length;

  const orderCount = requests.filter(
    (item) => !safeText(item.engagementType, "").toLowerCase().includes("discovery")
  ).length;

  const pageViews = analytics.filter((item) => item.name === "page_view").length;
  const submitSuccess = analytics.filter((item) => item.name === "lead_submit_success").length;
  const submitError = analytics.filter((item) => item.name === "lead_submit_error").length;

  const topServices = countBy(requests, (item) => safeText(item.service, ""));
  const topPages = countBy(
    analytics.filter((item) => item.name === "page_view"),
    (item) => safeText(item.path, "")
  );
  const topEvents = countBy(analytics, (item) => safeText(item.name, ""));

  return {
    totalRequests: requests.length,
    discoveryCount,
    orderCount,
    pageViews,
    submitSuccess,
    submitError,
    topServices,
    topPages,
    topEvents
  };
}

function getAdminPassword() {
  return String(process.env.ADMIN_DASHBOARD_PASSWORD || "").trim();
}

function getSessionValue(password) {
  return createHash("sha256").update(`cauz-admin-session:${password}`).digest("hex");
}

function safeEqual(a, b) {
  if (!a || !b) return false;
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

async function loginAdmin(formData) {
  "use server";

  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    redirect("/admin?setup=1");
  }

  const submittedPassword = String(formData.get("password") || "");
  if (submittedPassword !== adminPassword) {
    redirect("/admin?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: getSessionValue(adminPassword),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 14
  });

  redirect("/admin");
}

async function logoutAdmin() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0
  });

  redirect("/admin");
}

export default async function AdminPage({ searchParams }) {
  const resolvedSearchParams =
    searchParams && typeof searchParams.then === "function" ? await searchParams : searchParams || {};

  const setupError = resolvedSearchParams?.setup === "1";
  const authError = resolvedSearchParams?.error === "1";
  const adminPassword = getAdminPassword();
  const cookieStore = await cookies();
  const currentSession = cookieStore.get(ADMIN_COOKIE_NAME)?.value || "";
  const expectedSession = adminPassword ? getSessionValue(adminPassword) : "";
  const unlocked = adminPassword ? safeEqual(currentSession, expectedSession) : false;

  if (!unlocked) {
    return (
      <div className="page admin-shell">
        <section className="section-block section-hero">
          <p className="eyebrow">Admin</p>
          <h1>Private dashboard login.</h1>
          <p className="lead">
            This page is hidden from navigation and can only be opened directly at
            {" "}
            <code>/admin</code>
            {" "}
            with the admin password.
          </p>
        </section>

        <section className="section-block section-reset">
          <article className="admin-card admin-lock-card">
            <h2>Enter Password</h2>
            <p>Use your internal admin password to access analytics, requests, and order data.</p>
            <form action={loginAdmin} className="admin-auth-form">
              <label htmlFor="admin-password">Admin password</label>
              <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
              <button type="submit" className="submit-button">
                Unlock Dashboard
              </button>
            </form>
            {authError ? <p className="feedback error">Wrong password. Please try again.</p> : null}
            {!adminPassword || setupError ? (
              <p className="feedback error">
                Set
                {" "}
                <code>ADMIN_DASHBOARD_PASSWORD</code>
                {" "}
                in your environment file and restart the server.
              </p>
            ) : null}
          </article>
        </section>
      </div>
    );
  }

  const { leads, events } = await readDashboardData();
  const summary = computeSummary(leads, events);
  const recentLeads = leads.slice(0, 12);
  const recentEvents = events.slice(0, 20);

  return (
    <div className="page admin-shell">
      <section className="section-block section-hero">
        <p className="eyebrow">Admin Dashboard</p>
        <h1>Requests, orders, and analytics in one internal view.</h1>
        <p className="lead">
          This dashboard uses first-party data from your own site events and lead submissions. No third-party
          booking or analytics app is required for this view.
        </p>
        <form action={logoutAdmin}>
          <button type="submit" className="chip">
            Lock Dashboard
          </button>
        </form>
      </section>

      <section className="section-block section-reset admin-kpis">
        <article className="admin-kpi">
          <small>Total Requests</small>
          <strong>{summary.totalRequests}</strong>
        </article>
        <article className="admin-kpi">
          <small>Order Requests</small>
          <strong>{summary.orderCount}</strong>
        </article>
        <article className="admin-kpi">
          <small>Discovery Calls</small>
          <strong>{summary.discoveryCount}</strong>
        </article>
        <article className="admin-kpi">
          <small>Page Views</small>
          <strong>{summary.pageViews}</strong>
        </article>
        <article className="admin-kpi">
          <small>Lead Success</small>
          <strong>{summary.submitSuccess}</strong>
        </article>
        <article className="admin-kpi">
          <small>Lead Errors</small>
          <strong>{summary.submitError}</strong>
        </article>
      </section>

      <section className="section-block section-reset admin-grid">
        <article className="admin-card">
          <div className="section-head">
            <p className="eyebrow">Request Queue</p>
            <h2>Latest inquiries</h2>
          </div>
          {recentLeads.length ? (
            <div className="admin-table">
              {recentLeads.map((lead) => (
                <div key={lead.leadId} className="admin-row">
                  <div>
                    <strong>{safeText(lead.name)}</strong>
                    <span>{safeText(lead.email)}</span>
                  </div>
                  <div>
                    <span className="admin-pill">{safeText(lead.engagementType)}</span>
                    <small>{safeText(lead.service)}</small>
                  </div>
                  <div>
                    <small>{safeText(lead.budget)}</small>
                    <small>{safeText(lead.timeline)}</small>
                  </div>
                  <div>
                    <small>{formatDate(lead.submittedAt)}</small>
                    <small>{safeText(lead.leadId)}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-empty">No requests yet.</p>
          )}
        </article>

        <article className="admin-card">
          <div className="section-head">
            <p className="eyebrow">Order Pipeline</p>
            <h2>Project-type requests</h2>
          </div>
          {leads.filter((item) => safeText(item.engagementType, "").toLowerCase() !== "discovery call")
            .length ? (
            <div className="admin-list">
              {leads
                .filter((item) => safeText(item.engagementType, "").toLowerCase() !== "discovery call")
                .slice(0, 8)
                .map((lead) => (
                  <div key={`order_${lead.leadId}`} className="admin-item">
                    <strong>{safeText(lead.name)}</strong>
                    <p>
                      {safeText(lead.engagementType)} | {safeText(lead.service)}
                    </p>
                    <span>
                      {safeText(lead.budget)} | {safeText(lead.timeline)}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="admin-empty">No order-type requests yet.</p>
          )}
        </article>

        <article className="admin-card">
          <div className="section-head">
            <p className="eyebrow">Analytics</p>
            <h2>Top pages and events</h2>
          </div>
          <div className="admin-split">
            <div>
              <h3>Top Pages</h3>
              {summary.topPages.length ? (
                <ul className="admin-mini-list">
                  {summary.topPages.slice(0, 6).map(([path, count]) => (
                    <li key={`page_${path}`}>
                      <span>{path}</span>
                      <strong>{count}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty">No page view events yet.</p>
              )}
            </div>
            <div>
              <h3>Top Events</h3>
              {summary.topEvents.length ? (
                <ul className="admin-mini-list">
                  {summary.topEvents.slice(0, 6).map(([name, count]) => (
                    <li key={`event_${name}`}>
                      <span>{formatEventLabel(name)}</span>
                      <strong>{count}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty">No analytics events yet.</p>
              )}
            </div>
          </div>
        </article>

        <article className="admin-card">
          <div className="section-head">
            <p className="eyebrow">Service Demand</p>
            <h2>What clients are asking for</h2>
          </div>
          {summary.topServices.length ? (
            <ul className="admin-mini-list">
              {summary.topServices.slice(0, 8).map(([service, count]) => (
                <li key={`service_${service}`}>
                  <span>{service}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-empty">No service data yet.</p>
          )}
        </article>
      </section>

      <section className="section-block section-reset">
        <article className="admin-card">
          <div className="section-head">
            <p className="eyebrow">Recent Events</p>
            <h2>Latest analytics stream</h2>
          </div>
          {recentEvents.length ? (
            <div className="admin-events">
              {recentEvents.map((event) => (
                <div key={event.id} className="admin-event">
                  <strong>{formatEventLabel(event.name)}</strong>
                  <span>{safeText(event.path, "/")}</span>
                  <small>{formatDate(event.createdAt)}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-empty">No events captured yet.</p>
          )}
        </article>
      </section>
    </div>
  );
}
