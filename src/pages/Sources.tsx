import { SOURCES } from '../data/research';
import { PageHead, Panel, StatusPill } from '../components/ui';

export default function SourcesPage() {
  const groups = ['Official / exam body', 'Coaching analysis', 'Education portal'] as const;
  return (
    <div>
      <PageHead eyebrow="Research accessed 23 September 2026" title="Sources & limitations">
        Official IIM material defines the exam pattern and dates. Topic-wise counts are not published officially; they come from coaching institutes that reconstruct each slot from candidates’ recollections and response sheets. Major claims were checked against at least two sources; single-source and conflicting figures are labelled on the Trends page.
      </PageHead>
      <div className="grid gap-4">
        {groups.map((g) => (
          <Panel key={g} title={g}>
            <ul className="grid gap-3">
              {SOURCES.filter((s) => s.kind === g).map((s) => (
                <li key={s.key}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="font-semibold">{s.name}</a>
                  <div className="mono text-xs text-muted break-all">{s.url}</div>
                  <p className="text-sm">{s.usedFor}</p>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
        <Panel title="Limitations">
          <ul className="grid list-disc gap-2 pl-5">
            <li><StatusPill tone="warn">Reconstructed</StatusPill> All topic counts are coaching-institute reconstructions, and institutes classify borderline topics differently.</li>
            <li><StatusPill tone="warn">Conflicting</StatusPill> CAT 2025 DILR and QA TITA counts, and the 2024 third VA type, differ between sources.</li>
            <li><StatusPill tone="neutral">Not verified</StatusPill> 2023 TITA counts per section could not be confirmed from two sources.</li>
            <li><StatusPill tone="neutral">Access</StatusPill> iimcat.ac.in returned HTTP 403 to this research environment; official facts were confirmed through two independent reports of the official notification.</li>
            <li><StatusPill tone="neutral">Estimates</StatusPill> Percentile–score figures come from one source and are scaled scores that vary with paper difficulty.</li>
            <li><StatusPill tone="accent">Originality</StatusPill> No CAT question or passage is reproduced. All 300 questions and 16 passages in this app were written for it, including DILR data, which is invented.</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
