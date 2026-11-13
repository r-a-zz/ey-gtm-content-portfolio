import { Plus, X } from "lucide-react";
import { CONTENT_FORMATS, ContentDraft } from "../types";

interface ContentFormProps {
  draft: ContentDraft;
  onChange: (draft: ContentDraft) => void;
  onSubmit: () => void;
}

export function ContentForm({ draft, onChange, onSubmit }: ContentFormProps) {
  const addTag = () => {
    const tag = window.prompt("Add a target tag");
    const cleanTag = tag?.trim().replace(/^#/, "");
    if (cleanTag && !draft.tags.includes(cleanTag)) onChange({ ...draft, tags: [...draft.tags, cleanTag] });
  };

  const removeTag = (tag: string) => onChange({ ...draft, tags: draft.tags.filter((item) => item !== tag) });

  return (
    <section className="panel editor-panel" aria-labelledby="create-heading">
      <div className="panel-heading">
        <div><p className="section-kicker">Create content</p><h2 id="create-heading">Content details</h2></div>
        <span className="step-pill">Step 1 of 2</span>
      </div>
      <div className="form-content">
        <label className="field-label" htmlFor="headline">Headline <span>Required</span></label>
        <input id="headline" className="text-input" value={draft.headline} onChange={(event) => onChange({ ...draft, headline: event.target.value })} placeholder="Write a clear, compelling headline..." />
        <p className="field-hint">Keep it concise and focused on the audience outcome.</p>

        <label className="field-label" htmlFor="format">Content format <span>Required</span></label>
        <select id="format" className="text-input select-input" value={draft.format} onChange={(event) => onChange({ ...draft, format: event.target.value as ContentDraft["format"] })}>
          {CONTENT_FORMATS.map((format) => <option key={format}>{format}</option>)}
        </select>

        <div className="field-label tag-label">Target tags <span>Optional</span></div>
        <div className="tag-editor">
          {draft.tags.map((tag) => <span className="tag" key={tag}>#{tag}<button type="button" aria-label={`Remove ${tag} tag`} onClick={() => removeTag(tag)}><X size={12} /></button></span>)}
          <button type="button" className="add-tag" onClick={addTag}><Plus size={14} /> Add tag</button>
        </div>
      </div>
      <div className="panel-action">
        <button className="submit-button" type="button" onClick={onSubmit} disabled={!draft.headline.trim()}>Submit for QA <span>→</span></button>
        <p>By submitting, your content will be added to the review queue.</p>
      </div>
    </section>
  );
}
