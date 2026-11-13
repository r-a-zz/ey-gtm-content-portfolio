import { ClipboardList, FileText, LayoutDashboard, Sparkles, SquarePen } from "lucide-react";

export function Sidebar({ requestCount, reviewCount }: { requestCount: number; reviewCount: number }) {
  return (
    <aside className="sidebar">
      <a className="sidebar-brand" href="#overview" aria-label="GTM content operations overview"><span className="brand-symbol"><Sparkles size={17} /></span><span>GTM<span className="brand-muted">/</span>OPS</span></a>
      <div className="workspace-switcher"><span className="workspace-avatar">G</span><span><strong>GTM Content Hub</strong><small>Demo workspace</small></span><span className="chevron">⌄</span></div>
      <nav className="sidebar-nav" aria-label="Dashboard navigation">
        <p className="nav-label">Workspace</p>
        <a className="nav-item active" href="#overview"><LayoutDashboard size={17} strokeWidth={1.8} /><span>Overview</span></a>
        <a className="nav-item" href="#content-editor"><SquarePen size={17} strokeWidth={1.8} /><span>Content editor</span></a>
        <a className="nav-item" href="#content-requests"><ClipboardList size={17} strokeWidth={1.8} /><span>Content requests</span><b>{requestCount}</b></a>
        <a className="nav-item" href="#review-queue"><FileText size={17} strokeWidth={1.8} /><span>Review queue</span><b>{reviewCount}</b></a>
        <p className="nav-label nav-label-spaced">Quality</p>
        <a className="nav-item" href="#ai-review"><Sparkles size={17} strokeWidth={1.8} /><span>AI quality reviewer</span></a>
      </nav>
      <div className="sidebar-footer"><div className="user-avatar">ML</div><span><strong>Morgan Lee</strong><small>Demo reviewer</small></span><span className="more">•••</span></div>
    </aside>
  );
}
