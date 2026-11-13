import { ClipboardList, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { ContentRequest, REQUEST_TYPES } from "../types";

interface RequestForm {
  type: ContentRequest["type"];
  priority: ContentRequest["priority"];
  requester: string;
  dueDate: string;
  assetName: string;
  requestedChanges: string;
}

function today(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

const emptyRequest: RequestForm = { type: REQUEST_TYPES[0], priority: "Normal", requester: "", dueDate: today(), assetName: "", requestedChanges: "" };

export function ContentRequests({ items, onCreate }: { items: ContentRequest[]; onCreate: (request: RequestForm) => void }) {
  const [form, setForm] = useState(emptyRequest);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.requester.trim() || !form.assetName.trim() || !form.requestedChanges.trim() || !form.dueDate) return;
    onCreate({ ...form, requester: form.requester.trim(), assetName: form.assetName.trim(), requestedChanges: form.requestedChanges.trim() });
    setForm({ ...emptyRequest, dueDate: today() });
  };

  return (
    <section className="operations-section" id="content-requests" aria-labelledby="requests-heading">
      <div className="section-title-row"><div><p className="section-kicker">Intake and prioritization</p><h2 id="requests-heading">Content requests</h2><p>Capture incoming work with enough context for a clean handoff.</p></div><span className="count-chip"><ClipboardList size={14} /> {items.length} {items.length === 1 ? "request" : "requests"}</span></div>
      <div className="request-layout">
        <form className="panel request-form" onSubmit={submit}>
          <div className="subpanel-heading"><div><h3>Raise a request</h3><p>Required details are marked.</p></div><Plus size={17} /></div>
          <div className="form-two-column">
            <div><label className="field-label" htmlFor="request-type">Request type <span>Required</span></label><select id="request-type" className="text-input" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as RequestForm["type"] })}>{REQUEST_TYPES.map((type) => <option key={type}>{type}</option>)}</select></div>
            <div><label className="field-label" htmlFor="request-priority">Priority</label><select id="request-priority" className="text-input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as RequestForm["priority"] })}>{["Low", "Normal", "High", "Urgent"].map((priority) => <option key={priority}>{priority}</option>)}</select></div>
          </div>
          <div className="form-two-column">
            <div><label className="field-label" htmlFor="requester">Requester <span>Required</span></label><input id="requester" className="text-input" value={form.requester} onChange={(event) => setForm({ ...form, requester: event.target.value })} placeholder="Name or team" required /></div>
            <div><label className="field-label" htmlFor="due-date">Due date <span>Required</span></label><input id="due-date" className="text-input" type="date" min={today()} value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required /></div>
          </div>
          <label className="field-label" htmlFor="asset-name">Asset name <span>Required</span></label><input id="asset-name" className="text-input" value={form.assetName} onChange={(event) => setForm({ ...form, assetName: event.target.value })} placeholder="Page, file, or campaign name" required />
          <label className="field-label request-changes-label" htmlFor="requested-changes">Requested changes <span>Required</span></label><textarea id="requested-changes" className="text-input textarea-input" value={form.requestedChanges} onChange={(event) => setForm({ ...form, requestedChanges: event.target.value })} placeholder="Describe the outcome, key details, and relevant links" rows={4} required />
          <button className="secondary-submit" type="submit">Add to request log <span>→</span></button>
        </form>
        <div className="request-list" aria-live="polite">
          {items.length === 0 ? <div className="empty-panel"><ClipboardList size={20} /><strong>No requests yet</strong><span>New work requests will appear here with their due dates and priority.</span></div> : items.map((item) => (
            <article className="request-card" key={item.id}>
              <div className="request-card-top"><span className={`priority-pill priority-${item.priority.toLowerCase()}`}>{item.priority} priority</span><time dateTime={item.dueDate}>Due {new Date(`${item.dueDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</time></div>
              <h3>{item.assetName}</h3><p className="request-kind">{item.type}</p><p className="request-copy">{item.requestedChanges}</p>
              <div className="request-card-footer"><span>Requested by <strong>{item.requester}</strong></span><span>Intake · {new Date(item.createdAt).toLocaleString()}</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
