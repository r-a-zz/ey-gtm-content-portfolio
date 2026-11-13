import { Bell, CalendarDays, ChevronDown, Command, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ContentForm } from "./components/ContentForm";
import { ContentRequests } from "./components/ContentRequests";
import { GenAIReviewer } from "./components/GenAIReviewer";
import { PreviewCard } from "./components/PreviewCard";
import { ReviewQueue } from "./components/ReviewQueue";
import { Sidebar } from "./components/Sidebar";
import { ContentDraft, ContentRequest, QualityCheck, ReviewItem, ReviewStatus, validateMetadata } from "./types";
import "./styles.css";

const STORAGE_KEYS = {
  draft: "gtm-ops-draft-v2",
  queue: "gtm-ops-review-queue-v2",
  requests: "gtm-ops-requests-v2",
  aiReview: "gtm-ops-ai-review-v1",
};

function localDate(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

const initialDraft: ContentDraft = {
  headline: "",
  format: "Article",
  tags: ["Q3 campaign", "B2B"],
  author: "Content editor",
  publishDate: localDate(),
  audience: "GTM teams",
  description: "",
  hasImage: false,
  altText: "",
  destinationUrl: "",
};

function createChecklist(): Record<QualityCheck, boolean> {
  return {
    "Correct heading hierarchy": false,
    "Consistent formatting and terminology": false,
    "Relevant graphics and image quality": false,
    "Image alternative text": false,
    "Working links": false,
    "Complete metadata": false,
    "Responsive layout": false,
    "Appropriate visual styling": false,
  };
}

function createInitialQueue(): ReviewItem[] {
  const now = new Date().toISOString();
  return [
    {
      ...initialDraft,
      id: 1001,
      headline: "A practical guide to a more focused GTM motion",
      format: "Article",
      tags: ["GTM strategy", "Planning"],
      submittedAt: now,
      status: "In Review",
      checklist: createChecklist(),
      history: [{ id: "demo-1001", status: "In Review", action: "Submitted for review", actor: "Content editor (demo)", changedAt: now }],
    },
    {
      ...initialDraft,
      id: 1002,
      headline: "Product launch briefing for the sales team",
      format: "Event Brief",
      tags: ["Product launch"],
      submittedAt: now,
      status: "Changes Requested",
      checklist: createChecklist(),
      history: [
        { id: "demo-1002-a", status: "In Review", action: "Submitted for review", actor: "Content editor (demo)", changedAt: now },
        { id: "demo-1002-b", status: "Changes Requested", action: "Requested changes", actor: "Morgan Lee (demo reviewer)", changedAt: now, note: "Please confirm the audience and add alt text to the launch graphic." },
      ],
    },
  ];
}

function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [draft, setDraft] = useState(() => loadState(STORAGE_KEYS.draft, initialDraft));
  const [queue, setQueue] = useState(() => loadState(STORAGE_KEYS.queue, createInitialQueue()));
  const [requests, setRequests] = useState(() => loadState<ContentRequest[]>(STORAGE_KEYS.requests, []));
  const [aiReview, setAiReview] = useState(() => loadState(STORAGE_KEYS.aiReview, { content: "", guidelines: "Use plain language, accurate claims, inclusive wording, and a calm, helpful tone.", prompt: "", suggestions: "", accepted: "", outstanding: "" }));

  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(draft)); }, [draft]);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.queue, JSON.stringify(queue)); }, [queue]);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.requests, JSON.stringify(requests)); }, [requests]);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.aiReview, JSON.stringify(aiReview)); }, [aiReview]);

  const metadataChecks = validateMetadata(draft);
  const submitForReview = () => {
    if (!metadataChecks.every((check) => check.passed)) return;
    const changedAt = new Date().toISOString();
    const item: ReviewItem = {
      ...draft,
      id: Date.now(),
      headline: draft.headline.trim(),
      submittedAt: changedAt,
      status: "In Review",
      checklist: createChecklist(),
      history: [{ id: `${Date.now()}-submitted`, status: "In Review", action: "Submitted for review", actor: "Content editor (demo)", changedAt }],
    };
    setQueue((current) => [item, ...current]);
    setDraft({ ...initialDraft, publishDate: localDate() });
  };

  const addRequest = (request: Omit<ContentRequest, "id" | "createdAt">) => {
    setRequests((current) => [{ ...request, id: Date.now(), createdAt: new Date().toISOString() }, ...current]);
  };

  const updateChecklist = (id: number, check: QualityCheck, checked: boolean) => {
    setQueue((current) => current.map((item) => item.id === id ? { ...item, checklist: { ...item.checklist, [check]: checked } } : item));
  };

  const transitionItem = (id: number, status: ReviewStatus, action: string, note: string) => {
    const changedAt = new Date().toISOString();
    setQueue((current) => current.map((item) => item.id !== id ? item : {
      ...item,
      status,
      history: [...item.history, { id: `${Date.now()}-${Math.random()}`, status, action, actor: status === "In Review" ? "Content editor (demo)" : "Morgan Lee (demo reviewer)", changedAt, ...(note.trim() ? { note: note.trim() } : {}) }],
    }));
  };

  const now = new Date();
  const displayDate = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(now);
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="app-shell">
      <Sidebar requestCount={requests.length} reviewCount={queue.filter((item) => item.status === "In Review").length} />
      <div className="app-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><ChevronDown size={14} /><strong>Content operations</strong></div>
          <div className="topbar-actions"><button className="search-button" type="button" aria-label="Search workspace"><Search size={16} /> <span>Search</span><kbd><Command size={11} /> K</kbd></button><button className="notification-button" aria-label="Notifications" type="button"><Bell size={17} /><i /></button><div className="top-avatar" aria-label="Demo workspace">CO</div></div>
        </header>
        <main className="main-content">
          <div className="page-intro" id="overview"><div><div className="welcome-line"><span className="status-pulse" /> Internal workspace</div><h1>{greeting}, content team <span>✦</span></h1><p>Coordinate content requests, editorial checks, and publishing readiness.</p></div><div className="date-chip"><CalendarDays size={15} /> {displayDate}</div></div>
          <div className="demo-notice"><strong>Prototype workspace</strong><span>Sample queue records are simulated. Requests, drafts, review actions, and QA notes are saved only in this browser.</span></div>
          <div className="dashboard-grid" id="content-editor"><ContentForm draft={draft} onChange={setDraft} onSubmit={submitForReview} checks={metadataChecks} /><PreviewCard draft={draft} /></div>
          <ContentRequests items={requests} onCreate={addRequest} />
          <ReviewQueue items={queue} onToggleCheck={updateChecklist} onTransition={transitionItem} />
          <GenAIReviewer value={aiReview} onChange={setAiReview} />
          <footer className="workspace-footer">Demo data only · No connection to a CMS or enterprise workflow system</footer>
        </main>
      </div>
    </div>
  );
}

export default App;
