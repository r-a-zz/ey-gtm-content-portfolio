import { ArrowUpRight, Clock3, Eye, FileText } from "lucide-react";
import { ContentDraft } from "../types";

export function PreviewCard({ draft }: { draft: ContentDraft }) {
  return (
    <section className="preview-wrap" aria-labelledby="preview-heading">
      <div className="preview-heading"><div><p className="section-kicker">Live preview</p><h2 id="preview-heading">How it will appear</h2></div><span className="live-dot"><i /> Live</span></div>
      <div className="preview-card">
        <div className="preview-art"><div className="art-grid" /><span className="art-mark">✦</span><span className="format-badge"><FileText size={13} /> {draft.format}</span></div>
        <div className="preview-body">
          <div className="preview-meta"><span>GTM Content Hub</span><span>•</span><span>Draft</span></div>
          <h3>{draft.headline.trim() || "Your headline will appear here"}</h3>
          <p>Share a clear point of view that helps your audience make their next move with confidence.</p>
          <div className="preview-tags">{draft.tags.length ? draft.tags.map((tag) => <span key={tag}>#{tag}</span>) : <span>#your-tag</span>}</div>
          <div className="preview-footer"><span><Clock3 size={13} /> 4 min read</span><span><Eye size={13} /> Preview</span><ArrowUpRight size={16} /></div>
        </div>
      </div>
    </section>
  );
}
