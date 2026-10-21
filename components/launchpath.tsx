"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Search, BookOpen, FlaskConical, Layers3, ChevronRight, Check, Clock3, ShieldCheck, ExternalLink, Copy, Download, X, LoaderCircle, CircleHelp, Compass, CheckCheck } from "lucide-react";
import { guides } from "@/lib/guides";
import type { Guide } from "@/lib/guide";

type Page = "library" | "evidence" | "about";
function Mark({ name, small = false }: { name: string; small?: boolean }) {
  return <span className={`app-mark ${name.toLowerCase()} ${small ? "small" : ""}`} aria-hidden="true">{name === "GitHub" ? <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.6c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg> : name === "Gmail" ? <svg viewBox="0 0 32 25" fill="none" strokeWidth="4.5">
    <path stroke="#4285f4" d="M3 23V5" />
    <path stroke="#34a853" d="M29 23V5" />
    <path stroke="#ea4335" d="m3 5 13 10L29 5" />
    <path stroke="#fbbc04" d="M29 5v7" />
  </svg> : name === "Slack" ? <span className="slack-symbol">✣</span> : name.slice(0, 1).toUpperCase()}</span>;
}
function Badge({ difficulty }: { difficulty: Guide["difficulty"] }) {
  return <span className={`badge ${difficulty.toLowerCase()}`}>
    <span />{difficulty === "Unknown" ? "Needs investigation" : `${difficulty} complexity`}</span>;
}
function Citation({ guide, id }: { guide: Guide; id: string }) {
  const s = guide.sources.find(s => s.id === id); return s ? <a className="citation" href={s.url} target="_blank" rel="noreferrer" title={s.title}>Source <ArrowUpRight size={12} />
  </a> : null;
}

export default function Launchpath() {
  const [page, setPage] = useState<Page>("library");
  const [guide, setGuide] = useState<Guide | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All guides");
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [generated, setGenerated] = useState<Guide[]>([]);
  const readController = useRef<AbortController | null>(null);
  useEffect(() => {
    const read = () => {
      readController.current?.abort();
      setLoading(false);
      const id = new URLSearchParams(location.search).get("guide");
      if (!id) { setGuide(null); return; }
      const seed = guides.find(g => g.id === id);
      if (seed) { setGuide(seed); return; }
      setLoading(true); setMessage("");
      const control = new AbortController(); readController.current = control;
      fetch(`/api/guides/${encodeURIComponent(id)}`, { signal: control.signal }).then(async r => { const d = await r.json() as Guide & { error?: string }; if (!r.ok) throw new Error(d.error || "Guide unavailable"); if (new URLSearchParams(location.search).get("guide") === id) setGuide(d); }).catch(e => { if (e.name !== "AbortError") setMessage(e.message); }).finally(() => { if (!control.signal.aborted) setLoading(false); });
    };
    read(); window.addEventListener("popstate", read); return () => { readController.current?.abort(); window.removeEventListener("popstate", read); };
  }, []);
  function open(g: Guide) { readController.current?.abort(); setLoading(false); setGuide(g); setMessage(""); history.pushState(null, "", `?guide=${encodeURIComponent(g.id)}`); window.scrollTo(0, 0); }
  function nav(p: Page) { readController.current?.abort(); setLoading(false); setPage(p); setGuide(null); setMessage(""); history.pushState(null, "", "/"); window.scrollTo(0, 0); }
  const results = [...guides, ...generated].filter(g => `${g.name} ${g.tagline}`.toLowerCase().includes(query.toLowerCase()) && (filter === "All guides" || (filter === "Quick starts" ? g.difficulty === "Low" : g.difficulty !== "Low")));
  return <div className="shell">
    <aside className="sidebar">
      <a className="brand" href="/" onClick={e => { e.preventDefault(); nav("library"); }}>
        <span className="brand-icon">
          <Compass size={23} />
        </span>launchpath<span className="brand-dot">.</span>
      </a>
      <span className="workspace-label">DEVELOPER WORKSPACE</span>
      <nav aria-label="Main navigation">
        <button className={page === "library" ? "nav-item active" : "nav-item"} onClick={() => nav("library")}>
          <BookOpen size={18} />Guide library<span className="nav-count">{3 + generated.length}</span>
        </button>
        <button className={page === "evidence" ? "nav-item active" : "nav-item"} onClick={() => nav("evidence")}>
          <FlaskConical size={18} />Research & evidence</button>
        <button className={page === "about" ? "nav-item active" : "nav-item"} onClick={() => nav("about")}>
          <Layers3 size={18} />How it works</button>
      </nav>
      <div className="sidebar-note">
        <span className="tiny-kicker">PLANNING AN INTEGRATION</span>
        <p>Check the provider’s requirements before you commit to a launch date.</p>
        <button onClick={() => setModal(true)}>Investigate an app <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="sidebar-bottom">
        <span className="status-dot" />3 provider guides<div>Sources checked 19 Oct 2026</div>
      </div>
    </aside>
    <div className="main-shell">
      <header className="topbar">
        <div className="breadcrumb">Workspace <ChevronRight size={13} />
          <span>{guide ? guide.name : page === "library" ? "Guide library" : page === "evidence" ? "Research & evidence" : "How it works"}</span>
        </div>
        <a className="subtle-link" href="https://docs.composio.dev/toolkits/managed-auth" target="_blank" rel="noreferrer">Managed OAuth directory <ArrowUpRight size={14} />
        </a>
      </header>
      <main id="main-content">
        {loading ? <div className="load-state">
          <LoaderCircle className="spin" />Opening saved guide…</div> : guide ? <GuideView key={guide.id} guide={guide} back={() => nav("library")} /> : page === "library" ? <>
            <div className="page-heading">
              <div>
                <div className="eyebrow">
                  <span className="status-dot" />APP REGISTRATION & APPROVAL</div>
                <h1>OAuth setup guides</h1>
                <p>Find out what you need to register an app, test a connection, and release it to users.</p>
              </div>
              <aside className="release-note">
                <span className="tiny-kicker">THREE SEPARATE CHECKS</span>
                <ol>
                  <li>
                    <span>01</span>Register the provider app</li>
                  <li>
                    <span>02</span>Test a user connection</li>
                  <li>
                    <span>03</span>Check release requirements</li>
                </ol>
              </aside>
            </div>
            <section className="research-banner">
              <div className="banner-icon">
                <FlaskConical size={23} />
              </div>
              <div>
                <h2>Research another provider</h2>
                <p>Enter an app, describe the integration, and get a sourced setup guide.</p>
              </div>
              <button className="primary" onClick={() => setModal(true)}>Investigate an app <ArrowUpRight size={16} />
              </button>
            </section>
            <div className="section-heading">
              <div>
                <h2>Provider guides</h2>
                <p>Each guide covers a specific use case and distribution plan.</p>
              </div>
              <span className="muted-count">{3 + generated.length} guides available</span>
            </div>
            <div className="library-controls">
              <div className="filters" aria-label="Filter guides">{["All guides", "Quick starts", "Approval paths"].map(f => <button key={f} aria-pressed={filter === f} className={filter === f ? "selected" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div>
              <label className="search">
                <Search size={17} />
                <input aria-label="Search guide library" placeholder="Search apps…" value={query} onChange={e => setQuery(e.target.value)} />
              </label>
            </div>
            <div className="guide-grid">{results.map(g => <button className="guide-card" key={g.id} onClick={() => open(g)}>
              <div className="card-top">
                <Mark name={g.name} />
                <Badge difficulty={g.difficulty} />
              </div>
              <h3>{g.name}<ArrowUpRight size={19} />
              </h3>
              <p className="card-tagline">{g.tagline}</p>
              <div className="card-metrics">
                <span>
                  <Clock3 size={15} />{g.id === "github" ? "Est. 30–60 min setup" : g.id === "gmail" ? "Est. 1–2 h initial setup" : g.id === "slack" ? "Est. 1–2 h initial setup" : "See effort estimate"}</span>
                <span>
                  <ShieldCheck size={15} />{g.id === "github" ? "Organization policy may apply" : g.id === "gmail" ? "Restricted-scope verification" : g.id === "slack" ? "Distribution requirements" : "Live research · needs review"}</span>
              </div>
              <div className="card-footer">
                <span>{g.kind === "curated" ? "Official sources checked" : "Agent draft · review sources"}</span>
                <ArrowRight size={16} />
              </div>
            </button>)}</div>
            {results.length === 0 ? <div className="empty">
              <Search />
              <h3>No matching guide yet</h3>
              <p>Investigate this provider using its name or official website.</p>
              <button className="primary" onClick={() => setModal(true)}>Research an app <FlaskConical size={15} />
              </button>
            </div> : null}
            <div className="library-footnote">
              <ShieldCheck size={17} />
              <p>Setup estimates and review timelines are separate. Open a guide for its sources and testing notes.</p>
              <button onClick={() => nav("evidence")}>View research notes <ArrowRight size={14} />
              </button>
            </div>
            <section className="concept-strip">
              <span className="concept-number">01</span>
              <div>
                <h3>One registration. Many user connections.</h3>
                <p>Your OAuth app identifies your product to a provider. Each user separately authorizes their account. Registration, user consent and public-launch approval are different milestones.</p>
              </div>
              <CircleHelp size={23} />
            </section>
          </> : page === "evidence" ? <EvidencePage open={open} /> : <AboutPage />}
        {message ? <div role="alert" className="error-box">{message}<button onClick={() => nav("library")}>Return to library</button>
        </div> : null}
        <footer className="page-footer">
          <span>launchpath. <span className="footer-separator">/</span> OAuth registration and release requirements</span>
          <span>Research snapshot · 19 Oct 2026</span>
        </footer>
      </main>
    </div>
    {modal ? <ResearchModal close={() => setModal(false)} done={g => { setGenerated(gs => [g, ...gs.filter(x => x.id !== g.id)]); setModal(false); open(g); }} /> : null}
  </div>;
}

function GuideView({ guide: g, back }: { guide: Guide; back: () => void }) {
  const [tab, setTab] = useState("Setup path");
  const [completed, setCompleted] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  useEffect(() => { try { const d = JSON.parse(localStorage.getItem(`launchpath:v1:${g.id}`) || "[]"); if (Array.isArray(d)) setCompleted(d.filter(x => Number.isInteger(x) && x >= 0 && x < g.steps.length)); } catch { } }, [g.id, g.steps.length]);
  function toggle(i: number) { setCompleted(old => { const next = old.includes(i) ? old.filter(x => x !== i) : [...old, i]; try { localStorage.setItem(`launchpath:v1:${g.id}`, JSON.stringify(next)); } catch { setToast("Progress cannot be saved in this browser."); } return next; }); }
  async function share() { try { await navigator.clipboard.writeText(`${location.origin}/?guide=${encodeURIComponent(g.id)}`); setToast("Guide link copied. Recipient needs access to this site."); } catch { setToast("Copy this page’s address to share the guide."); } }
  function download() { const lines = [`# ${g.name} — OAuth launch guide`, `Scenario: ${g.scenario}`, `Evidence checked: ${g.checkedAt}`, `Difficulty: ${g.difficulty}`, `Effort: ${g.effort}`, `Wait: ${g.wait}`, g.verdict, "## Next action", `${g.next.title}: ${g.next.detail}`, g.next.url, "## Scopes", ...g.scopes.map(s => `${s.name}: ${s.reason}\nSource: ${g.sources.find(x => x.id === s.source)?.url}`), "## Prerequisites", ...g.prerequisites.map(x => `- ${x}`), "## Steps", ...g.steps.map((s, i) => `${i + 1}. ${s.title} (${s.owner})\n${s.detail}\nSource: ${g.sources.find(x => x.id === s.source)?.url}`), "## Blockers", ...g.blockers.map(b => `### ${b.title}\n${b.fix}\nSource: ${g.sources.find(x => x.id === b.source)?.url}`), "## Agent / human handoff", ...g.agentCan.map(x => `Agent: ${x}`), ...g.humanMust.map(x => `Human: ${x}`), "## Limits", ...g.unknowns, `Setup attempt: ${g.attempt}`, `Correction: ${g.correction}`, "## Sources", ...g.sources.map(s => `- [${s.title}](${s.url}): ${s.supports}`)]; const url = URL.createObjectURL(new Blob([lines.join("\n\n")], { type: "text/markdown" })); const a = document.createElement("a"); a.href = url; a.download = `${g.id}-oauth-guide.md`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  return <>
    <button className="back-link" onClick={back}>← All guides</button>
    <div className="guide-title">
      <div className="guide-title-main">
        <Mark name={g.name} />
        <div>
          <div className="eyebrow">SETUP GUIDE</div>
          <h1>{g.name}</h1>
        </div>
      </div>
      <div className="guide-actions">
        <button className="secondary" onClick={download}>
          <Download size={15} />Export guide</button>
        <button className="primary" onClick={share}>
          <Copy size={15} />Share guide</button>
      </div>
    </div>
    <p className="guide-subtitle">{g.tagline}</p>
    <div className="guide-meta">
      <Badge difficulty={g.difficulty} />
      <span>
        <ShieldCheck size={14} />{g.kind === "curated" ? "Documentation checked" : "Agent draft · setup not tested"} · {g.checkedAt}</span>
    </div>
    {g.kind === "generated" ? <div className="notice">Live research draft. Sources were collected by the agent; no provider registration or approval was performed. Verify the evidence before acting.</div> : null}
    <div className="scenario">
      <span className="tiny-kicker">THIS GUIDE’S ASSUMPTIONS</span>
      <p>{g.scenario}</p>
    </div>
    <div className="summary-grid">
      <div>
        <Clock3 size={18} />
        <span>YOUR HANDS-ON WORK</span>
        <p>{g.effort}</p>
      </div>
      <div>
        <ShieldCheck size={18} />
        <span>EXTERNAL WAIT & APPROVAL</span>
        <p>{g.wait}</p>
      </div>
    </div>
    <div className="guide-layout">
      <div>
        <div className="guide-tabs" role="tablist" aria-label="Guide sections">{["Setup path", "Blockers", "Evidence"].map(t => <button role="tab" aria-selected={tab === t} key={t} onClick={() => setTab(t)} className={tab === t ? "selected" : ""}>{t}{t === "Blockers" ? <span>{g.blockers.length}</span> : null}</button>)}</div>
        <div role="tabpanel">{tab === "Setup path" ? <>
            <section className="guide-section">
            {g.id === "slack" ? <div className="setup-draft">
              <span className="tiny-kicker">DEVELOPMENT STARTER · CHECKED 21 OCT 2026</span>
              <h3>Try a local mention-response bot</h3>
              <p>This manifest uses Socket Mode for a single development workspace. You will still need to create the app, generate tokens, and run a bot. The JSON was checked locally, not submitted to Slack’s validator.</p>
              <p>Socket Mode apps cannot currently be listed in Slack Marketplace. Use HTTP event delivery before following the commercial release path below.</p>
              <div className="starter-links">
                <a className="secondary" href="/starters/slack-socket-mode.json" download><Download size={14} />Download manifest</a>
                <a className="citation" href="https://docs.slack.dev/apis/events-api/using-socket-mode/" target="_blank" rel="noreferrer">Socket Mode requirements <ArrowUpRight size={12} /></a>
              </div>
              <p className="small-muted">After importing: create an app-level token with connections:write, install the bot, configure both tokens in your runtime, then invite and mention it in a channel.</p>
            </div> : null}
            <h2>Before you start</h2>
            <ul className="prerequisites">{g.prerequisites.map(p => <li key={p}>
              <Check size={15} />{p}</li>)}</ul>
          </section>
          <section className="guide-section">
            <h2>Permissions for this use case</h2>{g.scopes.map(s => <div className="scope-row" key={s.name}>
              <code>{s.name}</code>
              <p>{s.reason}</p>
              <Citation guide={g} id={s.source} />
            </div>)}</section>
          <section className="guide-section">
            <div className="section-heading">
              <h2>Your setup path</h2>
              <span className="muted-count">{completed.length}/{g.steps.length} checked</span>
            </div>
            <p className="small-muted">Your checklist is saved on this browser. Checking a step is your record, not verification by the agent.</p>
            <div className="steps">{g.steps.map((s, i) => <div className={`step ${completed.includes(i) ? "complete" : ""}`} key={s.title}>
              <button className="step-check" aria-label={`${completed.includes(i) ? "Uncheck" : "Complete"} step ${i + 1}: ${s.title}`} aria-pressed={completed.includes(i)} onClick={() => toggle(i)}>{completed.includes(i) ? <Check size={16} /> : i + 1}</button>
              <div>
                <div className="step-title">
                  <h3>{s.title}</h3>
                  <span className={`owner ${s.owner.toLowerCase()}`}>{s.owner}</span>
                </div>
                <p>{s.detail}</p>
                <Citation guide={g} id={s.source} />
              </div>
            </div>)}</div>
          </section>
        </> : tab === "Blockers" ? <section className="guide-section">
          <h2>When you get stuck</h2>
          <p className="small-muted">Common failures and the action needed to resolve them.</p>{g.blockers.map(b => <details className="blocker" key={b.title}>
            <summary>{b.title}<ChevronRight size={16} />
            </summary>
            <p>{b.fix}</p>
            <Citation guide={g} id={b.source} />
          </details>)}<Handoff guide={g} />
        </section> : <section className="guide-section">
          <h2>Sources and testing notes</h2>
          <div className="evidence-note">
            <span className="tiny-kicker">SETUP ATTEMPT · {g.kind === "curated" ? "RESEARCH AGENT" : "NOT PERFORMED"}</span>
            <p>{g.attempt}</p>
          </div>
          <div className="evidence-note correction">
            <span className="tiny-kicker">WHAT THE INVESTIGATION CHANGED</span>
            <p>{g.correction}</p>
          </div>
          <h3>Still uncertain</h3>
          <ul className="plain-list">{g.unknowns.map(u => <li key={u}>{u}</li>)}</ul>
          <h3>Source register</h3>{g.sources.map((s, i) => <a className="source-row" key={s.id} href={s.url} target="_blank" rel="noreferrer">
            <span className="source-number">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <strong>{s.title}</strong>
              <p>{s.supports}</p>
              <small>{new URL(s.url).hostname}</small>
            </div>
            <ArrowUpRight size={17} />
          </a>)}<Handoff guide={g} />
        </section>}</div>
      </div>
      <aside className="guide-aside">
        <div className="next-card">
          <span className="tiny-kicker">
            <Compass size={14} /> NEXT STEP</span>
          <h2>{g.next.title}</h2>
          <p>{g.next.detail}</p>
          <a className="primary" href={g.next.url} target="_blank" rel="noreferrer">Open next-step resource <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="verdict-card">
          <ShieldCheck size={20} />
          <h3>Before public release</h3>
          <p>{g.verdict}</p>
        </div>
        <div className="progress-card">
          <span className="tiny-kicker">YOUR CHECKLIST</span>
          <strong>{completed.length} of {g.steps.length} steps</strong>
          <div className="progress-track">
            <span style={{ width: `${completed.length / g.steps.length * 100}%` }} />
          </div>
          <p>Progress stays on this device.<br />Shared guides start with a fresh checklist.</p>
        </div>
      </aside>
    </div>
    {toast ? <div className="toast" role="status">
      <CheckCheck size={17} />{toast}<button aria-label="Dismiss notification" onClick={() => setToast("")}>
        <X size={15} />
      </button>
    </div> : null}
  </>;
}
function Handoff({ guide: g }: { guide: Guide }) {
  return <div className="handoff">
    <h2>Who does what</h2>
    <div className="handoff-grid">
      <div>
        <span className="tiny-kicker">
          <FlaskConical size={13} /> AGENT CAN HELP</span>
        <ul>{g.agentCan.map(x => <li key={x}>{x}</li>)}</ul>
      </div>
      <div>
        <span className="tiny-kicker">YOU TAKE OVER</span>
        <ul>{g.humanMust.map(x => <li key={x}>{x}</li>)}</ul>
      </div>
    </div>
  </div>;
}
function EvidencePage({ open }: { open: (g: Guide) => void }) {
  return <>
    <div className="eyebrow">RESEARCH RECORD</div>
    <h1>Research notes</h1>
    <p className="intro-copy">Two research agents investigated three providers. They checked official documentation and attempted public setup entry points. No provider registration, consent flow, token exchange or approval was completed.</p>
    <div className="evidence-legend">{[["Documented", "An official source states it."], ["Observed", "The agent saw the accessible flow."], ["Estimated", "A product judgment, not measured."], ["Unknown", "Evidence does not establish it."]].map(([t, d]) =>
      <div key={t}>
        <ShieldCheck size={18} />
        <strong>{t}</strong>
        <p>{d}</p>
      </div>)}</div>{guides.map(g =>
        <section className="research-record" key={g.id}>
          <div className="record-heading">
            <Mark name={g.name} small />
            <h2>{g.name}</h2>
            <button className="subtle-link" onClick={() => open(g)}>Read guide <ArrowUpRight size={15} />
            </button>
          </div>
          <span className="tiny-kicker">WHAT WE ATTEMPTED</span>
          <p>{g.attempt}</p>
          <span className="tiny-kicker">WHAT WE CORRECTED</span>
          <p>{g.correction}</p>
          <div className="record-sources">{g.sources.map(s =>
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.title}<ArrowUpRight size={11} />
            </a>)}</div>
        </section>)}</>;
}
function AboutPage() {
  return <>
    <div className="eyebrow">ABOUT THIS TOOL</div>
    <h1>How the guides work</h1>
    <p className="intro-copy">Launchpath helps agent builders navigate provider app registration and public-launch requirements. It does not create credentials or claim to secure provider approval.</p>
    <section className="research-record">
      <h2>Three milestones, different decisions</h2>
      <ol className="about-steps">
        <li>
          <strong>Register your product</strong>
          <p>Create the OAuth app that identifies your integration to the provider.</p>
        </li>
        <li>
          <strong>Connect a user</strong>
          <p>Each user separately grants access. A successful test connection does not establish public-launch readiness.</p>
        </li>
        <li>
          <strong>Prepare for your launch path</strong>
          <p>Check scopes, audience, distribution, administrator policy and applicable review.</p>
        </li>
      </ol>
    </section>
    <section className="research-record">
      <h2>Could managed OAuth shorten the route?</h2>
      <p>Composio provides a managed registration for supported toolkits. A custom registration can be necessary or useful for your own consent-screen identity, custom scopes or quota. Check the current toolkit and your specific requirements.</p>
      <a className="subtle-link" href="https://docs.composio.dev/toolkits/managed-auth" target="_blank" rel="noreferrer">Check the managed OAuth directory <ExternalLink size={14} />
      </a>
    </section>
    <section className="research-record">
      <h2>How live investigation works</h2>
      <p>The server asks a research agent to search current public sources, identify the provider and OAuth path, then produce a structured guide. A validation layer checks its format, evidence references and returned search sources before a shareable record is saved.</p>
      <p>A generated guide is an AI research draft. It cannot establish that authenticated setup works, guarantee approval or fill unknown turnaround times with invented numbers. If OAuth support or provider identity is unclear, the guide should say so and give an investigation step.</p>
    </section>
  </>;
}

function ResearchModal({ close, done }: { close: () => void; done: (g: Guide) => void }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/research/status", { signal: abort.signal, cache: "no-store" })
      .then(async response => {
        if (!response.ok) return;
        const status = await response.json() as { available?: boolean };
        if (typeof status.available === "boolean") setAvailable(status.available);
      })
      .catch(() => {});
    return () => abort.abort();
  }, []);
  const [provider, setProvider] = useState(""); const [scenario, setScenario] = useState(""); const [distribution, setDistribution] = useState("Public external integration"); const [busy, setBusy] = useState(false); const [events, setEvents] = useState<string[]>([]); const [error, setError] = useState(""); const ref = useRef<HTMLDialogElement>(null); const controller = useRef<AbortController | null>(null);
  useEffect(() => { ref.current?.showModal(); return () => controller.current?.abort(); }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || available === false) return;
    setBusy(true);
    setError("");
    setEvents([]);
    controller.current = new AbortController();

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, scenario, distribution }),
        signal: controller.current.signal,
      });
      if (!response.ok) {
        const failure = await response.json() as { error?: string };
        throw new Error(failure.error || "Research could not start");
      }
      if (!response.body) throw new Error("Research stream unavailable");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;

      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        const messages = buffer.split("\n\n");
        buffer = messages.pop() || "";

        for (const message of messages) {
          const data = message.split("\n").find(line => line.startsWith("data: "));
          if (!data) continue;
          const update = JSON.parse(data.slice(6));
          if (update.type === "error") throw new Error(update.message);
          if (update.type === "progress") setEvents(previous => [...previous, update.message]);
          if (update.type === "done") {
            finished = true;
            done(update.guide);
          }
        }
      }
      if (!finished) throw new Error("Research ended before a guide was saved. Try again.");
    } catch (failure) {
      controller.current?.abort();
      if (failure instanceof Error && failure.name !== "AbortError") setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return <dialog ref={ref} className="research-modal" onCancel={e => { e.preventDefault(); if (!busy) close(); }} aria-labelledby="research-title">
    <div className="modal-top">
      <span className="research-icon">
        <FlaskConical size={23} />
      </span>
      <button className="icon-button" aria-label={busy ? "Cancel research and close" : "Close"} onClick={() => { controller.current?.abort(); close(); }}>
        <X size={20} />
      </button>
    </div>
    <div className="eyebrow">YOUR NEXT INTEGRATION</div>
    <h2 id="research-title">Research a provider</h2>
    <p>Start with an app name or official website. The agent investigates current sources and builds a guide you can share.</p>
    <form onSubmit={submit}>
      <label>App name or website<input autoFocus required maxLength={200} disabled={busy} value={provider} onChange={e => setProvider(e.target.value)} placeholder="e.g. Notion or https://notion.so" />
      </label>
      <label>What should your integration do?<textarea required minLength={8} maxLength={1200} disabled={busy} value={scenario} onChange={e => setScenario(e.target.value)} placeholder="e.g. Let users search their workspace pages from my AI assistant" />
      </label>
      <label>Who will use it?<select disabled={busy} value={distribution} onChange={e => setDistribution(e.target.value)}>
        <option>Public external integration</option>
        <option>Internal organization only</option>
        <option>Personal prototype / limited testing</option>
      </select>
      </label>
      {available === false ? <div className="service-notice" role="status">Live research is not configured for this demo yet. The provider guides can still be read, shared, and exported.</div> : null}
      <div className="modal-note">
        <ShieldCheck size={17} />
        <span>Public research only. No credentials, registration or approval submission. Guides are saved for people with access to this site.</span>
      </div>{events.length ? <div className="research-events" aria-live="polite">{events.map((t, i) =>
        <div key={i}>{busy && i === events.length - 1 ? <LoaderCircle size={14} className="spin" /> : <Check size={14} />}<span>{t}</span>
        </div>)}</div> : null}{error ? <div className="error-box" role="alert">{error}</div> : null}<button className="primary full-width" disabled={busy || available === false} type="submit">{busy ? <>
          <LoaderCircle size={16} className="spin" />Investigating sources…</> : <>Generate my guide <ArrowUpRight size={16} />
        </>}</button>
    </form>
    <span className="modal-footer">The guide records its sources, assumptions, and unverified steps.</span>
  </dialog>;
}
