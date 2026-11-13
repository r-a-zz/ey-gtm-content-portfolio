import { BarChart3, FileText, FolderOpen, HelpCircle, LayoutDashboard, Settings, Sparkles } from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Content library", icon: FolderOpen },
  { label: "Review queue", icon: FileText, count: 4 },
  { label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-symbol"><Sparkles size={17} /></span>
        <span>GTM<span className="brand-muted">/</span>OS</span>
      </div>
      <div className="workspace-switcher">
        <span className="workspace-avatar">N</span>
        <span><strong>Northstar GTM</strong><small>Internal workspace</small></span>
        <span className="chevron">⌄</span>
      </div>
      <nav className="sidebar-nav" aria-label="Dashboard navigation">
        <p className="nav-label">Workspace</p>
        {navigation.map(({ label, icon: Icon, active, count }) => (
          <a className={`nav-item ${active ? "active" : ""}`} href={`#${label.toLowerCase().replace(" ", "-")}`} key={label}>
            <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{count && <b>{count}</b>}
          </a>
        ))}
        <p className="nav-label nav-label-spaced">Support</p>
        <a className="nav-item" href="#help"><HelpCircle size={17} strokeWidth={1.8} /><span>Help center</span></a>
        <a className="nav-item" href="#settings"><Settings size={17} strokeWidth={1.8} /><span>Settings</span></a>
      </nav>
      <div className="sidebar-footer">
        <div className="user-avatar">AR</div>
        <span><strong>Alex Rivera</strong><small>Content lead</small></span>
        <span className="more">•••</span>
      </div>
    </aside>
  );
}
