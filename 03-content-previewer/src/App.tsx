import { Bell, ChevronDown, Command, Search } from "lucide-react";
import { useState } from "react";
import { ContentForm } from "./components/ContentForm";
import { PreviewCard } from "./components/PreviewCard";
import { ReviewQueue } from "./components/ReviewQueue";
import { Sidebar } from "./components/Sidebar";
import { ContentDraft, ReviewItem } from "./types";
import "./styles.css";

const initialDraft: ContentDraft = { headline: "", format: "Article", tags: ["Q3 campaign", "B2B"] };
const initialQueue: ReviewItem[] = [
  { id: 1, headline: "The modern GTM team's guide to doing more with less", format: "Article", tags: ["GTM strategy", "Leadership"], submittedAt: "Today, 9:42 AM" },
  { id: 2, headline: "Q3 product launch: What sales needs to know", format: "Event Brief", tags: ["Product launch"], submittedAt: "Yesterday, 4:18 PM" },
];

function App() {
  const [draft, setDraft] = useState(initialDraft);
  const [queue, setQueue] = useState(initialQueue);

  const submitForReview = () => {
    if (!draft.headline.trim()) return;
    setQueue((current) => [{ ...draft, id: Date.now(), headline: draft.headline.trim(), submittedAt: "Just now" }, ...current]);
    setDraft({ ...initialDraft, headline: "" });
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><ChevronDown size={14} /><strong>Content review</strong></div>
          <div className="topbar-actions"><button className="search-button" type="button"><Search size={16} /> Search <kbd><Command size={11} /> K</kbd></button><button className="notification-button" aria-label="Notifications" type="button"><Bell size={17} /><i /></button><div className="top-avatar">AR</div></div>
        </header>
        <main className="main-content">
          <div className="page-intro"><div><div className="welcome-line"><span className="status-pulse" /> Internal workspace</div><h1>Good morning, Alex <span>✦</span></h1><p>Turn your next idea into content your audience can act on.</p></div><button className="date-button" type="button">Today, Jul 24, 2024 <ChevronDown size={15} /></button></div>
          <div className="dashboard-grid"><ContentForm draft={draft} onChange={setDraft} onSubmit={submitForReview} /><PreviewCard draft={draft} /></div>
          <ReviewQueue items={queue} />
        </main>
      </div>
    </div>
  );
}

export default App;
