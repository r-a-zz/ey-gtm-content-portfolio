import { CheckCircle2, ChevronRight, Clock3, MoreHorizontal } from "lucide-react";
import { ReviewItem } from "../types";

export function ReviewQueue({ items }: { items: ReviewItem[] }) {
  return (
    <section className="queue-section" aria-labelledby="queue-heading">
      <div className="queue-heading"><div><p className="section-kicker">Team workflow</p><h2 id="queue-heading">Review queue</h2></div><button className="view-all" type="button">View all <ChevronRight size={15} /></button></div>
      <div className="queue-card">
        <div className="queue-table-heading"><span>Content item</span><span>Format</span><span>Status</span><span>Submitted</span><span /></div>
        {items.length === 0 ? <div className="empty-queue">Your submitted content will appear here.</div> : items.map((item) => (
          <div className="queue-row" key={item.id}>
            <div className="queue-title"><span className="queue-icon">✦</span><span><strong>{item.headline}</strong><small>{item.tags.length ? item.tags.map((tag) => `#${tag}`).join(" · ") : "No target tags"}</small></span></div>
            <span className="format-text">{item.format}</span>
            <span className="status"><CheckCircle2 size={14} /> In review</span>
            <span className="submitted"><Clock3 size={13} /> {item.submittedAt}</span>
            <button className="icon-button" aria-label={`More options for ${item.headline}`} type="button"><MoreHorizontal size={17} /></button>
          </div>
        ))}
      </div>
    </section>
  );
}
