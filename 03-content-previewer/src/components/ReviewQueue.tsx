import { Check, CheckCircle2, ChevronDown, Clock3, FileText, RotateCcw, Send, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { QUALITY_CHECKS, QualityCheck, ReviewItem, ReviewStatus } from "../types";

type Transition = (id: number, status: ReviewStatus, action: string, note: string) => void;

function formattedTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function ReviewQueue({ items, onToggleCheck, onTransition }: {
  items: ReviewItem[];
  onToggleCheck: (id: number, check: QualityCheck, checked: boolean) => void;
  onTransition: Transition;
}) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const inReviewCount = items.filter((item) => item.status === "In Review").length;

  return (
    <section className="operations-section" id="review-queue" aria-labelledby="queue-heading">
      <div className="section-title-row"><div><p className="section-kicker">Editorial workflow</p><h2 id="queue-heading">Review queue</h2><p>Move each item through a visible review and release history.</p></div><span className="count-chip"><Clock3 size={14} /> {inReviewCount} in review</span></div>
      <div className="queue-card queue-card-expanded">
        <div className="queue-table-heading"><span>Content item</span><span>Format</span><span>Status</span><span>Submitted</span><span /></div>
        {items.length === 0 ? <div className="empty-queue">New submissions will appear here after metadata checks pass.</div> : items.map((item) => {
          const expanded = expandedId === item.id;
          const checklistDone = QUALITY_CHECKS.every((check) => item.checklist[check]);
          return <article className={`review-item ${expanded ? "review-item-expanded" : ""}`} key={item.id}>
            <div className="queue-row">
              <div className="queue-title"><span className="queue-icon"><FileText size={14} /></span><span><strong>{item.headline}</strong><small>{item.tags.length ? item.tags.map((tag) => `#${tag}`).join(" · ") : "No target tags"}</small></span></div>
              <span className="format-text">{item.format}</span>
              <span className={`status-pill status-${item.status.toLowerCase().replace(/ /g, "-")}`}>{item.status}</span>
              <span className="submitted"><Clock3 size={13} /> {formattedTime(item.submittedAt)}</span>
              <button className="expand-review" type="button" aria-expanded={expanded} aria-label={`${expanded ? "Close" : "Open"} review for ${item.headline}`} onClick={() => setExpandedId(expanded ? null : item.id)}><ChevronDown size={16} /></button>
            </div>
            {expanded && <div className="review-details">
              <div className="review-detail-grid">
                <div className="quality-checklist">
                  <div className="subpanel-heading"><div><h3>Editorial quality checklist</h3><p>Complete these checks before approval ({QUALITY_CHECKS.filter((check) => item.checklist[check]).length}/{QUALITY_CHECKS.length}).</p></div><ShieldCheck size={17} /></div>
                  <ul>{QUALITY_CHECKS.map((check) => <li key={check}><label><input type="checkbox" checked={item.checklist[check]} onChange={(event) => onToggleCheck(item.id, check, event.target.checked)} /><span>{check}</span></label></li>)}</ul>
                </div>
                <div className="review-audit">
                  <h3>Change history</h3><p>Sample workflow activity recorded with a demo identity and timestamp.</p>
                  <ol>{[...item.history].reverse().map((event) => <li key={event.id}><span className={`history-marker status-${event.status.toLowerCase().replace(/ /g, "-")}`} /><div><strong>{event.action}</strong><small>{event.actor} · {formattedTime(event.changedAt)}</small>{event.note && <p>{event.note}</p>}</div></li>)}</ol>
                </div>
              </div>
              {item.status === "In Review" || item.status === "Changes Requested" ? <div className="review-action-area">
                <label className="field-label" htmlFor={`review-note-${item.id}`}>Reviewer note <span>Optional</span></label>
                <textarea id={`review-note-${item.id}`} className="text-input textarea-input" rows={2} value={notes[item.id] ?? ""} onChange={(event) => setNotes({ ...notes, [item.id]: event.target.value })} placeholder="Add context for requested changes, rejection, or approval" />
                <div className="workflow-actions">
                  {item.status === "In Review" && <>
                    <button className="workflow-button workflow-request" type="button" onClick={() => onTransition(item.id, "Changes Requested", "Requested changes", notes[item.id] ?? "")}><RotateCcw size={14} /> Request changes</button>
                    <button className="workflow-button workflow-reject" type="button" onClick={() => onTransition(item.id, "Draft", "Rejected and returned to draft", notes[item.id] ?? "")}><X size={14} /> Reject</button>
                    <button className="workflow-button workflow-approve" type="button" disabled={!checklistDone} title={!checklistDone ? "Complete the editorial checklist before approving" : undefined} onClick={() => onTransition(item.id, "Approved", "Approved", notes[item.id] ?? "")}><Check size={14} /> Approve</button>
                  </>}
                  {item.status === "Changes Requested" && <button className="workflow-button workflow-approve" type="button" onClick={() => onTransition(item.id, "In Review", "Resubmitted for review", notes[item.id] ?? "")}><Send size={14} /> Resubmit for review</button>}
                </div>
                {item.status === "In Review" && !checklistDone && <p className="approval-hint">Finish all checklist items to enable approval.</p>}
              </div> : item.status === "Approved" ? <div className="publish-bar"><p><CheckCircle2 size={16} /> Approval recorded. The item is ready for a simulated publish action.</p><button className="workflow-button workflow-approve" type="button" onClick={() => onTransition(item.id, "Published", "Marked published", "Prototype status only; no CMS publishing occurred.")}><Send size={14} /> Mark published</button></div> : item.status === "Published" ? <p className="published-note"><CheckCircle2 size={16} /> Marked published in this simulated workflow. No CMS was updated.</p> : <button className="workflow-button workflow-request" type="button" onClick={() => onTransition(item.id, "In Review", "Submitted for review", notes[item.id] ?? "")}><Send size={14} /> Submit draft for review</button>}
            </div>}
          </article>;
        })}
      </div>
      <p className="simulation-caption">Queue statuses and history are prototype records stored in local browser storage; they do not publish content.</p>
    </section>
  );
}
