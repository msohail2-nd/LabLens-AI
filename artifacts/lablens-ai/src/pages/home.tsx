import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateBetaSignup } from '@workspace/api-client-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CapabilityStatus, DemoHowToTest, ResearchDemo } from '@/components/research-demo';
import { ArrowDown, ArrowRight, Camera, Check, CheckCircle2, ChevronRight, ClipboardList, FileText, FolderOpen, GitBranch, Layers3, Link2, Menu, Monitor, NotebookPen, Search, ShieldCheck, Sparkles, X } from 'lucide-react';

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
      <div className="window-top"><div className="window-dots" aria-hidden="true"><i /><i /><i /></div><div className="window-label">LABLENS / CONCEPT RECORD</div><div className="window-status">ILLUSTRATIVE · NOT LIVE</div></div>
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
              <div className="app-panel-title"><span>AI SUMMARY · CONCEPT</span><Sparkles size={14} /></div>
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
        <p className="hero-copy">Research evidence is scattered across notebooks, instrument files, PDFs, project folders, and experimental history. LabLens AI is being developed as an AI-powered research continuity and knowledge-retrieval layer to connect those records and help reconstruct how the work evolved—alongside the LIMS and ELN tools you already use.</p>
        <div className="hero-actions">
          <a href="#beta" className="btn-primary" data-testid="link-hero-beta">Join the beta <ArrowRight size={16} aria-hidden="true" /></a>
          <a href="#preview" className="btn-secondary" data-testid="link-hero-preview">Explore the product <ArrowDown size={15} aria-hidden="true" /></a>
          <a href="#research-demo" className="btn-secondary" data-testid="link-hero-demo">Try the research demo <ArrowRight size={15} aria-hidden="true" /></a>
        </div>
        <div className="hero-fine">For graduate researchers, academic laboratories &amp; industrial R&amp;D</div>
        <p className="availability-note">Landing page and beta signup only. No file upload, AI search, instrument integrations, or experiment workspace is available yet. Product view below is illustrative.</p>
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
  { number: '01', title: 'Search', body: 'Planned: search a unified research record spanning notebooks, instrument files, PDFs, project folders, and experimental history.' },
  { number: '02', title: 'Connect', body: 'Planned: link related material across tools and reconstruct the context around an experiment.' },
  { number: '03', title: 'Review', body: 'Planned: inspect AI-generated summaries with source citations, then confirm or correct them yourself.' },
  { number: '04', title: 'Continue', body: 'Planned: carry a traceable account of decisions and evidence into the next run or an advisor update.' },
];
function Workflow() {
  return <section className="section workflow" id="workflow"><div className="container">
    <Reveal className="workflow-head"><div className="section-heading"><span className="eyebrow eyebrow-line">02 / A CONTINUOUS RECORD</span><h2 className="display">From loose evidence<br />to a living record.</h2></div><p>These are planned beta capabilities, not features available today. LabLens is intended to complement your existing LIMS and ELN, not replace either one.</p></Reveal>
    <div className="steps">{steps.map(step => <Reveal key={step.number}><div className="step" data-testid={`step-${step.title.toLowerCase()}`}><span className="step-number">{step.number} / 04</span><h3>{step.title}</h3><p>{step.body}</p></div></Reveal>)}</div>
  </div></section>;
}

const capabilities = [
  { icon: Search, title: 'Unified research record search', description: 'Planned: search across connected notebooks, instrument files, PDFs, project folders, and experimental history.' },
  { icon: Link2, title: 'Context linking & experiment reconstruction', description: 'Planned: connect evidence across tools to retrace which conditions, changes, and decisions belong to an experiment.' },
  { icon: Sparkles, title: 'Source-cited AI summaries', description: 'Planned: generate summaries that point to their source material and make uncertainty visible.' },
  { icon: ShieldCheck, title: 'Human-reviewed suggestions', description: 'Planned: researchers check, correct, or reject AI suggestions before relying on them.' },
  { icon: ClipboardList, title: 'Traceable updates', description: 'Planned: prepare a draft progress update that links back to relevant evidence for review.' },
];
function Capabilities() {
  return <section className="section capabilities" id="product"><div className="container cap-layout">
    <div className="section-heading"><span className="eyebrow eyebrow-line">03 / THE PRODUCT · PLANNED</span><h2 className="display">Less detective work.<br />More continuity.</h2><p>Proposed beta capabilities for keeping experiments legible across the tools your team already uses. Nothing here is currently available in a working product.</p></div>
    <div className="cap-list">{capabilities.map(({ icon: Icon, title, description }) => <Reveal key={title}><article className="cap-item" data-testid={`capability-${title.toLowerCase().replace(/\s/g, '-')}`}><div className="cap-icon"><Icon size={17} strokeWidth={1.8} aria-hidden="true" /></div><div><h3>{title}</h3><p>{description}</p></div></article></Reveal>)}</div>
  </div></section>;
}

function Comparison() {
  return <section className="section compare" id="comparison"><div className="container">
    <Reveal className="section-heading"><span className="eyebrow eyebrow-line">04 / BUILT TO COMPLEMENT YOUR STACK</span><h2 className="display">Different tools.<br />Different jobs.</h2><p>LIMS and ELNs are established parts of research operations. LabLens is being planned as a continuity layer across them and other project sources—not a replacement.</p></Reveal>
    <div className="compare-grid">
      <Reveal><article className="compare-card role-card"><header><b>LIMS</b><Layers3 size={17} color="#8b9cac" /></header><p className="role-focus">Common focus</p><p>Sample records, testing workflows, quality control, and traceability.</p><p className="role-note">Capabilities vary by system and configuration.</p></article></Reveal>
      <Reveal><article className="compare-card role-card"><header><b>ELNs</b><NotebookPen size={17} color="#8b9cac" /></header><p className="role-focus">Common focus</p><p>Capturing and documenting experiments, protocols, observations, and results.</p><p className="role-note">Some ELNs also provide search and AI features.</p></article></Reveal>
      <Reveal><article className="compare-card role-card after"><header><b>LABLENS · PLANNED</b><Link2 size={17} color="#9ddfd4" /></header><p className="role-focus">Intended focus</p><p>Cross-tool evidence linking, retrieval, experiment-history reconstruction, and research continuity.</p><p className="role-note">Some LIMS and ELNs already offer search or AI. LabLens is not claiming otherwise.</p></article></Reveal>
    </div>
    <div className="comparison-caveat">The distinction is the planned cross-tool continuity workflow—not a claim that existing systems lack search, AI, or traceability.</div>
  </div></section>;
}

function Scenarios() {
  return <section className="section scenarios" id="scenarios"><div className="container">
    <Reveal className="section-heading"><span className="eyebrow eyebrow-line">05 / EXAMPLES FROM CHEMISTRY &amp; MATERIALS</span><h2 className="display">Follow the evidence,<br />not a file trail.</h2><p>Illustrative use cases for a future product. These are examples of intended workflows, not claims about a working feature.</p></Reveal>
    <div className="scenario-list">
      <Reveal><article className="scenario"><span className="scenario-index">01 / OXIDATION SERIES</span><div><h3>Nickel oxidation, across NMR and XRD</h3><p>Imagine linking an oxidation experiment’s notebook observations to NMR spectra, XRD files, and the project folder where analyses live—then retracing which run produced which evidence.</p></div></article></Reveal>
      <Reveal><article className="scenario"><span className="scenario-index">02 / EXACT CONDITIONS</span><div><h3>Find the conditions behind a result</h3><p>Retrieve the recorded temperature, solvent ratio, and reaction time tied to a specific sample, with a path back to the original notebook entry or instrument file for verification.</p></div></article></Reveal>
      <Reveal><article className="scenario"><span className="scenario-index">03 / GROUP UPDATE</span><div><h3>Prepare a traceable advisor update</h3><p>Assemble a draft of what changed between runs, which measurements support the account, and what remains uncertain—then have the researcher review it before sharing.</p></div></article></Reveal>
    </div>
  </div></section>;
}

function Integrity() {
  return <section className="section integrity"><div className="container integrity-layout">
    <Reveal className="split-copy"><span className="eyebrow eyebrow-line">06 / RESEARCH INTEGRITY</span><h2 className="display">AI can help connect the dots.<br />It cannot make the call.</h2><p>A useful research record makes its basis visible. Planned summaries would point back to sources, keep uncertainties visible, and require researcher review before anyone relies on them.</p></Reveal>
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
    <Reveal className="section-heading"><span className="eyebrow eyebrow-line">07 / WHO IT'S FOR</span><h2 className="display">For the people doing<br />the work at the bench.</h2><p>Especially when the work is complex, iterative, and spread across more places than any one notebook can hold.</p></Reveal>
    <div className="audience-grid">
      <Reveal><article className="audience-card"><span>01 / GRADUATE RESEARCHERS</span><h3>Keep your own thread.</h3><p>Return to an experiment weeks later and see the notes, files, and reasoning that shaped it.</p></article></Reveal>
      <Reveal><article className="audience-card"><span>02 / ACADEMIC LABORATORIES</span><h3>Pick up where you left off.</h3><p>Carry context between runs, analyses, meetings, and the next version of a protocol.</p></article></Reveal>
      <Reveal><article className="audience-card"><span>03 / INDUSTRIAL R&amp;D TEAMS</span><h3>Make progress easier to share.</h3><p>Keep evidence and project history in view when work moves between experiments, analyses, and updates.</p></article></Reveal>
    </div>
  </div></section>
  <section className="section founders" id="team"><div className="container founder-layout">
    <Reveal className="section-heading founder-copy"><span className="eyebrow eyebrow-line">08 / FROM THE FOUNDERS</span><h2 className="display">Built around a real research problem.</h2><p>LabLens AI began with a familiar question: why does understanding an experiment often take almost as much work as doing it? We are exploring a more connected way to keep the work and its context together.</p></Reveal>
    <Reveal><div className="founder-list"><div className="founder-person"><strong>Muhammad Sohail</strong><span>FOUNDER</span></div></div></Reveal>
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
    <Reveal className="beta-copy"><span className="eyebrow eyebrow-line">09 / EARLY ACCESS</span><h2>Help shape a better research record.</h2><p>We're collecting beta interest from graduate researchers, academic laboratories, and industrial R&amp;D teams. Tell us how your records get scattered, and help us understand the workflows that need support.</p><p className="beta-status">This is a beta interest form, not product access. LabLens currently has no file upload, AI search, instrument integrations, or experiment workspace.</p>
      <div className="beta-points"><div><CheckCircle2 size={17} /> Built for experimental research workflows</div><div><CheckCircle2 size={17} /> Researcher review stays central</div><div><CheckCircle2 size={17} /> Early input helps shape the product</div></div>
    </Reveal>
    <Reveal><p className="privacy-note">Beta interest only. Do not include confidential research data in this form.</p><BetaForm /></Reveal>
  </div></section>;
}

function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-main"><div><Brand /><p>Keep the evidence connected. Keep the research moving.</p></div><nav className="footer-links" aria-label="Footer navigation"><a href="#problem" data-testid="link-footer-problem">The problem</a><a href="#workflow" data-testid="link-footer-workflow">How it works</a><a href="#team" data-testid="link-footer-team">The team</a><a href="#beta" data-testid="link-footer-beta">Join the beta</a></nav></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} LabLens AI. All rights reserved.</span><span>RESEARCH CONTINUITY, WITH THE RESEARCHER IN CONTROL.</span></div>
  </div></footer>;
}

export default function Home() {
  return <div className="site"><Header /><main><Hero /><ResearchDemo /><DemoHowToTest /><CapabilityStatus /><Problem /><Workflow /><Capabilities /><Comparison /><Scenarios /><Integrity /><AudienceAndFounders /><Beta /></main><Footer /></div>;
}