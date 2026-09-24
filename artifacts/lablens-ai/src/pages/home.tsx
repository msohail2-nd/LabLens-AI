import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateBetaSignup } from '@workspace/api-client-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowDown, ArrowRight, Camera, Check, CheckCircle2, ChevronRight, CircleHelp, ClipboardList, FileText, FolderOpen, GitBranch, Layers3, Link2, Menu, Monitor, NotebookPen, Search, ShieldCheck, Sparkles, X } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(120, 'Keep your name under 120 characters.'),
  email: z.string().trim().email('Enter a valid email address.').max(254, 'Keep your email under 254 characters.'),
  researchField: z.string().trim().min(1, 'Please enter your research field.').max(120, 'Keep this under 120 characters.'),
  graduateProgram: z.string().trim().min(1, 'Please enter your graduate program.').max(160, 'Keep this under 160 characters.'),
  biggestChallenge: z.string().trim().min(1, 'Tell us what is hardest to keep track of.').max(2000, 'Keep this under 2,000 characters.'),
});
type SignupValues = z.infer<typeof signupSchema>;

const navItems = [
  { label: 'The problem', href: '#problem' },
  { label: 'How it works', href: '#workflow' },
  { label: 'Product', href: '#product' },
  { label: 'For researchers', href: '#researchers' },
];

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) { element.classList.add('visible'); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.classList.add('visible'); observer.unobserve(element); }
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Brand() {
  return <a href="#top" className="brand" aria-label="LabLens AI, back to top" data-testid="link-brand"><span className="brand-mark" aria-hidden="true" /><span>LabLens<span>AI</span></span></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="container header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map(item => <a key={item.href} href={item.href} data-testid={`link-nav-${item.href.slice(1)}`}>{item.label}</a>)}
      </nav>
      <a className="header-cta" href="#beta" data-testid="link-header-beta">Join the beta <ArrowRight size={14} aria-hidden="true" /></a>
      <button type="button" className="mobile-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} data-testid="button-mobile-menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-panel" aria-label="Mobile navigation">
      {navItems.map(item => <a key={item.href} href={item.href} onClick={() => setOpen(false)} data-testid={`link-mobile-${item.href.slice(1)}`}>{item.label}</a>)}
      <a className="mobile-join" href="#beta" onClick={() => setOpen(false)} data-testid="link-mobile-beta">Join the beta →</a>
    </nav>}
  </header>;
}

function ProductWindow() {
  return <div className="product-wrap" id="preview">
    <div className="product-halo" aria-hidden="true" />
    <div className="product-window" data-testid="panel-product-preview">
      <div className="window-top"><div className="window-dots" aria-hidden="true"><i /><i /><i /></div><div className="window-label">LABLENS / EXPERIMENT RECORD</div><div className="window-status"><span className="kicker-dot" /> CONNECTED RECORD</div></div>
      <div className="window-body">
        <aside className="app-sidebar" aria-label="Example product navigation">
          <div className="sidebar-title">WORKSPACE / RESEARCH</div>
          <div className="sidebar-link active"><Layers3 size={14} /> Experiments</div>
          <div className="sidebar-link"><FolderOpen size={14} /> Sources</div>
          <div className="sidebar-link"><Search size={14} /> Search records</div>
          <div className="sidebar-link"><ClipboardList size={14} /> Updates</div>
          <div className="sidebar-bottom">PROJECT<br /><span style={{ color: '#b8cbd4' }}>Cell response study</span><br /><br />EXAMPLE WORKSPACE</div>
        </aside>
        <div className="app-main">
          <div className="app-crumb">EXPERIMENTS <ChevronRight size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> <strong>EXP-024</strong></div>
          <div className="app-head">
            <div><h3>Drug response · assay optimization</h3><div className="app-subtitle">Experiment 024 <span style={{ padding: '0 7px' }}>·</span> Last updated 14 May</div></div>
            <span className="app-tag"><Link2 size={11} /> 6 SOURCES LINKED</span>
          </div>
          <div className="app-grid">
            <div className="app-panel">
              <div className="app-panel-title"><span>EXPERIMENT CONTINUITY</span><GitBranch size={14} /></div>
              <div className="timeline">
                <div className="timeline-item"><b>Protocol adjusted after pilot run</b><small>Notebook entry · 12 May, 09:41</small></div>
                <div className="timeline-item"><b>Plate images and readout exported</b><small>Instrument computer · 13 May, 16:08</small></div>
                <div className="timeline-item"><b>Normalization script revised</b><small>Analysis folder · 14 May, 11:23</small></div>
              </div>
            </div>
            <div className="app-panel">
              <div className="app-panel-title"><span>CONNECTED SOURCES</span><Link2 size={14} /></div>
              <div className="source-list">
                <span className="source-pill">notebook_0512.pdf</span><span className="source-pill">plate_04.tif</span><span className="source-pill">readout.csv</span><span className="source-pill">analysis_v3.py</span><span className="source-pill">lab_meeting.pptx</span>
              </div>
              <div style={{ borderTop: '1px solid #3a4b5c', marginTop: 18, paddingTop: 13, color: '#879cae', font: "9px 'IBM Plex Mono', monospace" }}>Sources remain attached to the record</div>
            </div>
            <div className="app-panel">
              <div className="app-panel-title"><span>AI-ASSISTED SUMMARY</span><Sparkles size={14} /></div>
              <p className="summary-text">Pilot results led to a longer incubation window. The revised analysis uses the updated baseline, but the reason for excluding two wells still needs researcher confirmation.</p>
              <div className="source-link">Grounded in notebook entry + analysis_v3.py</div>
            </div>
            <div className="app-panel">
              <div className="app-panel-title"><span>RESEARCHER REVIEW</span><ShieldCheck size={14} /></div>
              <div className="review-card"><div className="review-label">SUGGESTION · NOT CONFIRMED</div><p>Confirm why wells B7–B8 were excluded before adding to the record.</p></div>
              <div className="advisor-card"><strong>Advisor update draft</strong>“Pilot completed; incubation timing was adjusted. Exclusion rationale is pending review.”</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p className="caption">ILLUSTRATIVE PRODUCT VIEW — EXAMPLE RECORD, NOT A REAL EXPERIMENT</p>
  </div>;
}

function Hero() {
  return <section className="hero" id="top">
    <div className="container">
      <Reveal className="hero-content">
        <span className="hero-kicker"><span className="kicker-dot" /> BUILT FOR THE WAY RESEARCH ACTUALLY HAPPENS</span>
        <h1 className="display">Stop rebuilding experiments from <em>scattered records.</em></h1>
        <p className="hero-copy">Your work lives across notebooks, instrument computers, photos, files, and half-finished notes. LabLens AI helps you reconnect the evidence, recover the context, and move forward with confidence in what you can verify.</p>
        <div className="hero-actions">
          <a href="#beta" className="btn-primary" data-testid="link-hero-beta">Join the beta <ArrowRight size={16} aria-hidden="true" /></a>
          <a href="#preview" className="btn-secondary" data-testid="link-hero-preview">Explore the product <ArrowDown size={15} aria-hidden="true" /></a>
        </div>
        <div className="hero-fine">For graduate researchers · Built for research continuity</div>
      </Reveal>
      <Reveal><ProductWindow /></Reveal>
    </div>
  </section>;
}

const fragments = [
  { icon: NotebookPen, title: 'Notebook entries', detail: 'THE WHAT & WHEN' },
  { icon: Camera, title: 'Bench photos', detail: 'THE VISUAL EVIDENCE' },
  { icon: Monitor, title: 'Instrument PCs', detail: 'THE RAW OUTPUT' },
  { icon: FolderOpen, title: 'Shared drives', detail: 'THE FILE TRAIL' },
  { icon: FileText, title: 'Temporary notes', detail: 'THE REASON WHY' },
];
function Problem() {
  return <><section className="section problem" id="problem"><div className="container">
    <Reveal className="problem-top">
      <div className="section-heading"><span className="eyebrow eyebrow-line">01 / THE REAL PROBLEM</span><h2 className="display">The experiment is complete.<br />The story is not.</h2></div>
      <div className="side-note">A result is only useful when you can reconstruct what happened: which protocol changed, where the data came from, and why you made that decision.</div>
    </Reveal>
    <Reveal><div className="fragment-grid">
      {fragments.map(({ icon: Icon, title, detail }) => <div className="fragment" key={title} data-testid={`card-fragment-${title.toLowerCase().replace(/\s/g, '-')}`}><Icon size={22} strokeWidth={1.5} aria-hidden="true" /><div><span>{title}</span><br /><small>{detail}</small></div></div>)}
    </div><div className="fragment-callout">The missing piece is usually the connection between them.</div></Reveal>
  </div></section>
  <div className="insight"><div className="container insight-inner"><span className="insight-label">AN OBSERVATION FROM THE BENCH</span><p>Context rarely disappears all at once. <strong>It gets separated into different places</strong> — then costs time to put back together when a paper, meeting, or next experiment depends on it.</p></div></div></>;
}

const steps = [
  { number: '01', title: 'Capture', body: 'Bring in the notes, images, output, and decisions you already create as part of the work.' },
  { number: '02', title: 'Connect', body: 'Link related materials to an experiment so the record reflects the full path, not a single file.' },
  { number: '03', title: 'Recover', body: 'Find source-backed context and revisit what changed, when, and where it was recorded.' },
  { number: '04', title: 'Continue', body: 'Prepare the next step or an advisor update without starting the reconstruction from scratch.' },
];
function Workflow() {
  return <section className="section workflow" id="workflow"><div className="container">
    <Reveal className="workflow-head"><div className="section-heading"><span className="eyebrow eyebrow-line">02 / A CONTINUOUS RECORD</span><h2 className="display">From loose evidence<br />to a living record.</h2></div><p>LabLens follows the natural rhythm of research. Not a new reporting ritual — a clearer view of the work already happening.</p></Reveal>
    <div className="steps">{steps.map(step => <Reveal key={step.number}><div className="step" data-testid={`step-${step.title.toLowerCase()}`}><span className="step-number">{step.number} / 04</span><h3>{step.title}</h3><p>{step.body}</p></div></Reveal>)}</div>
  </div></section>;
}

const capabilities = [
  { icon: Link2, title: 'Experiment-centered records', description: 'Keep the notebook entry, instrument output, photo, analysis, and decision together around the experiment they belong to.' },
  { icon: Search, title: 'Context you can trace', description: 'Navigate back to connected material when you need to check where a detail came from.' },
  { icon: Sparkles, title: 'Source-backed AI assistance', description: 'Generate a starting summary from the available record, with source references rather than unsupported conclusions.' },
  { icon: ShieldCheck, title: 'Review stays with the researcher', description: 'Flag uncertain details and suggestions for confirmation. Your judgment remains part of the scientific record.' },
  { icon: ClipboardList, title: 'Advisor-ready progress updates', description: 'Turn the record into a draft update of what happened, what changed, and what still needs attention.' },
];
function Capabilities() {
  return <section className="section capabilities" id="product"><div className="container cap-layout">
    <div className="section-heading"><span className="eyebrow eyebrow-line">03 / THE PRODUCT</span><h2 className="display">Less detective work.<br />More continuity.</h2><p>Tools for keeping your experiment legible to your future self — and to the people you work with.</p></div>
    <div className="cap-list">{capabilities.map(({ icon: Icon, title, description }) => <Reveal key={title}><article className="cap-item" data-testid={`capability-${title.toLowerCase().replace(/\s/g, '-')}`}><div className="cap-icon"><Icon size={17} strokeWidth={1.8} aria-hidden="true" /></div><div><h3>{title}</h3><p>{description}</p></div></article></Reveal>)}</div>
  </div></section>;
}

function Comparison() {
  return <section className="section compare"><div className="container">
    <Reveal className="section-heading"><span className="eyebrow eyebrow-line">04 / A DIFFERENT WORKFLOW</span><h2 className="display">The same research.<br />A clearer thread.</h2></Reveal>
    <div className="compare-grid">
      <Reveal><article className="compare-card"><header><b>WITHOUT A CONNECTED RECORD</b><CircleHelp size={17} color="#8b9cac" /></header><ul>
        <li><X size={16} /> Search several folders to find the right file version</li>
        <li><X size={16} /> Reconstruct a protocol change from memory</li>
        <li><X size={16} /> Piece together an advisor update at the last minute</li>
        <li><X size={16} /> Wonder whether a detail was documented at all</li>
      </ul></article></Reveal>
      <Reveal><article className="compare-card after"><header><b>WITH LABLENS AI</b><CheckCircle2 size={17} color="#9ddfd4" /></header><ul>
        <li><Check size={16} /> Related sources organized around the experiment</li>
        <li><Check size={16} /> A visible trail of changes and supporting material</li>
        <li><Check size={16} /> A grounded draft to review before sharing</li>
        <li><Check size={16} /> Open questions made explicit, not filled in by guesswork</li>
      </ul></article></Reveal>
    </div>
  </div></section>;
}

function Integrity() {
  return <section className="section integrity"><div className="container integrity-layout">
    <Reveal className="split-copy"><span className="eyebrow eyebrow-line">05 / RESEARCH INTEGRITY</span><h2 className="display">AI can help connect the dots.<br />It cannot make the call.</h2><p>A useful research record makes its basis visible. LabLens is designed to support interpretation, not manufacture certainty: summaries point back to sources, uncertainties remain visible, and researchers review suggestions before relying on them.</p></Reveal>
    <Reveal><div className="integrity-visual" data-testid="panel-research-integrity">
      <div className="integrity-visual-top"><span>RECORD NOTE / EXP-024</span><span>REVIEW PENDING</span></div>
      <div className="integrity-note">“Incubation was extended after the pilot run. The exclusion rationale for wells B7–B8 has not yet been confirmed.”</div>
      <div className="integrity-evidence"><span>↳ SOURCES: notebook_0512.pdf · readout.csv</span><Link2 size={13} /></div>
      <div className="integrity-caution">Suggested summary for researcher review. Source references help you check the record; they do not replace scientific judgment.</div>
    </div></Reveal>
  </div></section>;
}

function AudienceAndFounders() {
  return <><section className="section audience" id="researchers"><div className="container">
    <Reveal className="section-heading"><span className="eyebrow eyebrow-line">06 / WHO IT'S FOR</span><h2 className="display">For the people doing<br />the work at the bench.</h2><p>Especially when the work is complex, iterative, and spread across more places than any one notebook can hold.</p></Reveal>
    <div className="audience-grid">
      <Reveal><article className="audience-card"><span>01 / GRADUATE RESEARCHERS</span><h3>Keep your own thread.</h3><p>Return to an experiment weeks later and see the notes, files, and reasoning that shaped it.</p></article></Reveal>
      <Reveal><article className="audience-card"><span>02 / ROTATING PROJECTS</span><h3>Pick up where you left off.</h3><p>Carry context between runs, analyses, meetings, and the next version of a protocol.</p></article></Reveal>
      <Reveal><article className="audience-card"><span>03 / RESEARCH TEAMS</span><h3>Make progress easier to share.</h3><p>Give advisors and collaborators a clearer update while retaining the underlying trail.</p></article></Reveal>
    </div>
  </div></section>
  <section className="section founders" id="team"><div className="container founder-layout">
    <Reveal className="section-heading founder-copy"><span className="eyebrow eyebrow-line">07 / FROM THE FOUNDERS</span><h2 className="display">Built around a real research problem.</h2><p>LabLens AI began with a familiar question: why does understanding an experiment often take almost as much work as doing it? We are building a more connected way to keep the work and its context together.</p></Reveal>
    <Reveal><div className="founder-list"><div className="founder-person"><strong>Muhammad Sohail</strong><span>CO-FOUNDER</span></div><div className="founder-person"><strong>Ategeka Musinguzi</strong><span>CO-FOUNDER</span></div></div></Reveal>
  </div></section></>;
}

function BetaForm() {
  const mutation = useCreateBetaSignup();
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', researchField: '', graduateProgram: '', biggestChallenge: '' },
  });

  async function onSubmit(values: SignupValues) {
    setFormError('');
    try {
      const result = await mutation.mutateAsync({ data: values });
      if (result.accepted) {
        setSuccessMessage(result.message || 'Your beta interest has been recorded. Thank you for telling us about your research.');
        form.reset();
      } else {
        setFormError(result.message || 'We could not complete your signup. Please try again.');
      }
    } catch (error) {
      const typed = error as { status?: number; response?: { status?: number; data?: { error?: string } }; data?: { error?: string }; message?: string };
      const status = typed?.status ?? typed?.response?.status;
      const message = typed?.response?.data?.error ?? typed?.data?.error ?? typed?.message ?? '';
      if (status === 409 || /already|duplicate|exists/i.test(message)) setFormError('This email is already on the beta list. Thank you for your interest.');
      else if (status === 400 || status === 422) setFormError(message || 'Please check your details and try again.');
      else setFormError('We could not send your request right now. Please try again in a moment.');
    }
  }

  if (successMessage) return <div className="form-card success-state" role="status" data-testid="status-beta-success"><div className="success-icon"><Check size={24} /></div><h3>You're on the list.</h3><p>{successMessage}</p><button type="button" onClick={() => { setSuccessMessage(''); mutation.reset(); }} data-testid="button-another-signup">Submit another response</button></div>;

  return <div className="form-card" data-testid="panel-beta-form"><h3>Join the LabLens AI beta</h3><p className="form-card-intro">Tell us a little about your research and what is hardest to keep together.</p>
    {formError && <div className="form-alert error" role="alert" data-testid="status-beta-error">{formError}</div>}
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} noValidate data-testid="form-beta-signup">
      <div className="field-grid">
        <FormField control={form.control} name="name" render={({ field }) => <FormItem className="field"><FormLabel>Name</FormLabel><FormControl><input {...field} autoComplete="name" placeholder="Your name" maxLength={120} data-testid="input-name" /></FormControl><FormMessage className="field-error" /></FormItem>} />
        <FormField control={form.control} name="email" render={({ field }) => <FormItem className="field"><FormLabel>Email address</FormLabel><FormControl><input {...field} type="email" autoComplete="email" placeholder="you@university.edu" maxLength={254} data-testid="input-email" /></FormControl><FormMessage className="field-error" /></FormItem>} />
        <FormField control={form.control} name="researchField" render={({ field }) => <FormItem className="field"><FormLabel>Research field</FormLabel><FormControl><input {...field} placeholder="e.g. Molecular biology" maxLength={120} data-testid="input-research-field" /></FormControl><FormMessage className="field-error" /></FormItem>} />
        <FormField control={form.control} name="graduateProgram" render={({ field }) => <FormItem className="field"><FormLabel>Graduate program</FormLabel><FormControl><input {...field} placeholder="e.g. PhD in Bioengineering" maxLength={160} data-testid="input-graduate-program" /></FormControl><FormMessage className="field-error" /></FormItem>} />
      </div>
      <FormField control={form.control} name="biggestChallenge" render={({ field }) => <FormItem className="field"><FormLabel>Biggest recordkeeping challenge</FormLabel><FormControl><textarea {...field} placeholder="What part of reconstructing an experiment takes the most time?" maxLength={2000} data-testid="input-biggest-challenge" /></FormControl><FormMessage className="field-error" /></FormItem>} />
      <button type="submit" className="btn-primary form-submit" disabled={mutation.isPending} data-testid="button-submit-beta">{mutation.isPending ? 'Sending your request…' : 'Request beta access'} {!mutation.isPending && <ArrowRight size={16} aria-hidden="true" />}</button>
      <p className="form-footnote">No pricing or commitment. We’ll be in touch about the beta.</p>
    </form></Form>
  </div>;
}

function Beta() {
  return <section className="beta" id="beta"><div className="container beta-layout">
    <Reveal className="beta-copy"><span className="eyebrow eyebrow-line">08 / EARLY ACCESS</span><h2>Help shape a better research record.</h2><p>We're inviting graduate researchers into the LabLens AI beta. Tell us how your records get scattered, and help us build around the workflows that actually need support.</p>
      <div className="beta-points"><div><CheckCircle2 size={17} /> Built for experimental research workflows</div><div><CheckCircle2 size={17} /> Researcher review stays central</div><div><CheckCircle2 size={17} /> Early input helps shape the product</div></div>
    </Reveal>
    <Reveal><BetaForm /></Reveal>
  </div></section>;
}

function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-main"><div><Brand /><p>Keep the evidence connected. Keep the research moving.</p></div><nav className="footer-links" aria-label="Footer navigation"><a href="#problem" data-testid="link-footer-problem">The problem</a><a href="#workflow" data-testid="link-footer-workflow">How it works</a><a href="#team" data-testid="link-footer-team">The team</a><a href="#beta" data-testid="link-footer-beta">Join the beta</a></nav></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} LabLens AI. All rights reserved.</span><span>RESEARCH CONTINUITY, WITH THE RESEARCHER IN CONTROL.</span></div>
  </div></footer>;
}

export default function Home() {
  return <div className="site"><Header /><main><Hero /><Problem /><Workflow /><Capabilities /><Comparison /><Integrity /><AudienceAndFounders /><Beta /></main><Footer /></div>;
}