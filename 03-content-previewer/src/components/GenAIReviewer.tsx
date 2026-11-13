import { Clipboard, ClipboardCheck, Sparkles } from "lucide-react";
import { useState } from "react";

export interface AIReviewNotes {
  content: string;
  guidelines: string;
  prompt: string;
  suggestions: string;
  accepted: string;
  outstanding: string;
}

export function GenAIReviewer({ value, onChange }: { value: AIReviewNotes; onChange: (next: AIReviewNotes) => void }) {
  const [copyMessage, setCopyMessage] = useState("");
  const generatePrompt = () => {
    if (!value.content.trim()) return;
    const prompt = [
      "Act as a careful editorial quality reviewer. Review the supplied content and return concise, actionable findings grouped under Grammar and clarity, Readability, Metadata completeness, Accessibility, and Brand and style alignment.",
      "Check heading hierarchy, descriptive links, image alternative text when images are referenced, and consistency. Separate objective errors from optional suggestions. Do not invent facts, metrics, citations, or claims. Preserve the author's intent and flag uncertainty instead of guessing.",
      `Brand guidance: ${value.guidelines.trim() || "No additional brand guidance supplied."}`,
      "Content to review:",
      value.content.trim(),
    ].join("\n\n");
    onChange({ ...value, prompt });
    setCopyMessage("Prompt generated. Review it, then copy it into your chosen GenAI tool.");
  };
  const copyPrompt = async () => {
    if (!value.prompt) return;
    try {
      await navigator.clipboard.writeText(value.prompt);
      setCopyMessage("Prompt copied to clipboard.");
    } catch {
      setCopyMessage("Clipboard access is unavailable. Select and copy the prompt text below.");
    }
  };

  return (
    <section className="operations-section" id="ai-review" aria-labelledby="ai-review-heading">
      <div className="section-title-row"><div><p className="section-kicker">Editorial support</p><h2 id="ai-review-heading">AI-assisted content quality reviewer</h2><p>Prepare a repeatable review prompt and record human decisions.</p></div><span className="ai-label"><Sparkles size={14} /> Prompt toolkit</span></div>
      <div className="ai-review-layout">
        <div className="panel ai-prompt-panel">
          <label className="field-label" htmlFor="review-content">Content to review <span>Paste text or page copy</span></label>
          <textarea id="review-content" className="text-input textarea-input" rows={7} value={value.content} onChange={(event) => onChange({ ...value, content: event.target.value })} placeholder="Paste approved or draft content here. Avoid confidential or personal information." />
          <label className="field-label" htmlFor="brand-guidance">Brand guidance <span>Optional</span></label>
          <textarea id="brand-guidance" className="text-input textarea-input" rows={3} value={value.guidelines} onChange={(event) => onChange({ ...value, guidelines: event.target.value })} />
          <div className="prompt-actions"><button className="secondary-submit" type="button" onClick={generatePrompt} disabled={!value.content.trim()}><Sparkles size={15} /> Generate review prompt</button><p>The prompt covers grammar, readability, metadata, accessibility, and brand guidance.</p></div>
          {value.prompt && <div className="generated-prompt"><div className="generated-prompt-heading"><strong>Review prompt</strong><button className="copy-button" type="button" onClick={copyPrompt}><Clipboard size={14} /> Copy prompt</button></div><textarea aria-label="Generated review prompt" className="text-input textarea-input prompt-output" readOnly value={value.prompt} rows={9} /><p className="copy-feedback" aria-live="polite">{copyMessage || "Paste this prompt into Microsoft Copilot, ChatGPT, or another approved tool."}</p></div>}
        </div>
        <div className="panel qa-report-panel">
          <div className="subpanel-heading"><div><h3>Final QA report</h3><p>Compare suggestions with editorial judgment.</p></div><ClipboardCheck size={17} /></div>
          <label className="field-label" htmlFor="ai-suggestions">Suggested corrections <span>Paste tool response</span></label><textarea id="ai-suggestions" className="text-input textarea-input" rows={5} value={value.suggestions} onChange={(event) => onChange({ ...value, suggestions: event.target.value })} placeholder="Record the useful suggestions returned by the GenAI tool" />
          <label className="field-label" htmlFor="accepted-changes">Accepted changes</label><textarea id="accepted-changes" className="text-input textarea-input" rows={4} value={value.accepted} onChange={(event) => onChange({ ...value, accepted: event.target.value })} placeholder="List changes reviewed and accepted by an editor" />
          <label className="field-label" htmlFor="open-issues">Outstanding issues</label><textarea id="open-issues" className="text-input textarea-input" rows={4} value={value.outstanding} onChange={(event) => onChange({ ...value, outstanding: event.target.value })} placeholder="Track questions or issues still needing human review" />
          <p className="ai-limitation">This prototype generates prompts only. It does not call an AI service, verify claims, or replace human editorial and accessibility review. Follow your organization's data handling guidance before pasting content into an external tool.</p>
        </div>
      </div>
    </section>
  );
}
