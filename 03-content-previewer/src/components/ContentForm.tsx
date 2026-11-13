import { CheckCircle2, Circle, Plus, X } from "lucide-react";
import { ContentDraft, CONTENT_FORMATS, ValidationCheck } from "../types";

interface ContentFormProps {
  draft: ContentDraft;
  onChange: (draft: ContentDraft) => void;
  onSubmit: () => void;
  checks: ValidationCheck[];
}

export function ContentForm({ draft, onChange, onSubmit, checks }: ContentFormProps) {
  const addTag = () => {
    const tag = window.prompt("Add a target tag");
    const cleanTag = tag?.trim().replace(/^#/, "");
    if (cleanTag && !draft.tags.includes(cleanTag)) onChange({ ...draft, tags: [...draft.tags, cleanTag] });
  };
  const removeTag = (tag: string) => onChange({ ...draft, tags: draft.tags.filter((item) => item !== tag) });
  const passedCount = checks.filter((check) => check.passed).length;

  return (
    <section className="panel editor-panel" aria-labelledby="create-heading">
      <div className="panel-heading">
        <div><p className="section-kicker">Create content</p><h2 id="create-heading">Content details</h2></div>
        <span className={`step-pill ${passedCount === checks.length ? "step-pill-ready" : ""}`}>{passedCount}/{checks.length} checks passed</span>
      </div>
      <div className="form-content">
        <label className="field-label" htmlFor="headline">Title <span>Required</span></label>
        <input id="headline" className="text-input" required value={draft.headline} onChange={(event) => onChange({ ...draft, headline: event.target.value })} placeholder="Write a clear, audience-focused title" />

        <div className="form-two-column">
          <div><label className="field-label" htmlFor="author">Author <span>Required</span></label><input id="author" className="text-input" required value={draft.author} onChange={(event) => onChange({ ...draft, author: event.target.value })} placeholder="Content owner" /></div>
          <div><label className="field-label" htmlFor="publish-date">Publish date <span>YYYY-MM-DD</span></label><input id="publish-date" className="text-input" type="date" required value={draft.publishDate} onChange={(event) => onChange({ ...draft, publishDate: event.target.value })} /></div>
        </div>

        <div className="form-two-column">
          <div><label className="field-label" htmlFor="format">Content type <span>Required</span></label><select id="format" className="text-input select-input" value={draft.format} onChange={(event) => onChange({ ...draft, format: event.target.value as ContentDraft["format"] })}>{CONTENT_FORMATS.map((format) => <option key={format}>{format}</option>)}</select></div>
          <div><label className="field-label" htmlFor="audience">Target audience <span>Required</span></label><input id="audience" className="text-input" required value={draft.audience} onChange={(event) => onChange({ ...draft, audience: event.target.value })} placeholder="Who is this for?" /></div>
        </div>

        <label className="field-label" htmlFor="description">Description <span>{draft.description.length}/160</span></label>
        <textarea id="description" className="text-input textarea-input" maxLength={160} value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} placeholder="Short summary for search and previews" rows={3} />

        <label className="field-label" htmlFor="destination-url">Destination URL <span>Optional</span></label>
        <input id="destination-url" className="text-input" type="url" value={draft.destinationUrl} onChange={(event) => onChange({ ...draft, destinationUrl: event.target.value })} placeholder="https://example.com/content" />

        <label className="image-toggle"><input type="checkbox" checked={draft.hasImage} onChange={(event) => onChange({ ...draft, hasImage: event.target.checked })} /><span>This content uses an image</span></label>
        {draft.hasImage && <><label className="field-label" htmlFor="alt-text">Image alternative text <span>Required when image is used</span></label><textarea id="alt-text" className="text-input textarea-input" value={draft.altText} onChange={(event) => onChange({ ...draft, altText: event.target.value })} placeholder="Describe the meaningful information in the image" rows={2} /></>}

        <div className="field-label tag-label">Target tags <span>Optional</span></div>
        <div className="tag-editor" aria-label="Target tags">{draft.tags.map((tag) => <span className="tag" key={tag}>#{tag}<button type="button" aria-label={`Remove ${tag} tag`} onClick={() => removeTag(tag)}><X size={12} /></button></span>)}<button type="button" className="add-tag" onClick={addTag}><Plus size={14} /> Add tag</button></div>

        <div className="validation-report" aria-live="polite">
          <div className="validation-heading"><div><p className="section-kicker">Preflight</p><h3>Metadata validation</h3></div><span>{passedCount} of {checks.length} passed</span></div>
          <ul>{checks.map((check) => <li key={check.label} className={check.passed ? "validation-pass" : "validation-fail"}>{check.passed ? <CheckCircle2 size={15} /> : <Circle size={15} />}<span><strong>{check.label}</strong><small>{check.detail}</small></span></li>)}</ul>
        </div>
      </div>
      <div className="panel-action">
        <button className="submit-button" type="button" onClick={onSubmit} disabled={!checks.every((check) => check.passed)}>Submit for review <span>→</span></button>
        <p>All metadata checks must pass before submission.</p>
      </div>
    </section>
  );
}
