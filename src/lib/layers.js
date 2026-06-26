export const LAYERS = [
  {
    id: 'org',
    cls: 'border-[#1C4448]',
    labelBg: 'bg-[#1C4448]',
    name: 'Organisational Influences',
    desc: 'Strategy, resourcing, culture, governance, decisions of senior management.',
    hint: 'e.g. production pressure over safety, under-resourced WHS function, weak governance of critical risk.',
    defaultType: 'latent',
  },
  {
    id: 'sup',
    cls: 'border-[#0F766E]',
    labelBg: 'bg-[#0F766E]',
    name: 'Task / Environmental Conditions',
    desc: 'The task as planned and the conditions it was performed in — environment, equipment state, work design.',
    hint: 'e.g. poor work design, degraded equipment, environmental hazard, inadequate planning of the task.',
    defaultType: 'latent',
  },
  {
    id: 'pre',
    cls: 'border-[#7FA88B]',
    labelBg: 'bg-[#7FA88B]',
    name: 'Individual / Team Actions',
    desc: 'Condition and actions of the people performing the work — fitness, competency, decisions, errors.',
    hint: 'e.g. fatigue, time pressure, skill-based slip, decision error, routine or exceptional violation.',
    defaultType: 'latent',
  },
  {
    id: 'act',
    cls: 'border-[#D9923A]',
    labelBg: 'bg-[#D9923A]',
    name: 'Absent or Failed Defences',
    desc: 'The last-line barriers — engineering controls, PPE, interlocks, emergency response.',
    hint: 'e.g. guard removed, interlock bypassed, no fallback protection, emergency response delay.',
    defaultType: 'active',
  },
  {
    id: 'def',
    cls: 'border-[#C5563D]',
    labelBg: 'bg-[#C5563D]',
    name: 'The Incident',
    desc: 'The realised loss event — the hazard reaching the target after all defences were breached.',
    hint: 'e.g. the loss event, the harm, the high-potential outcome that resulted.',
    defaultType: 'latent',
  },
];

export const DEMO_DATA = {
  meta: {
    ref: 'INV-2026-014',
    title: 'Loss of control — haul truck, ramp 3 descent',
    event_date: '2026-05-18',
    investigator: 'M. Campbell',
    outcome: 'Haul truck lost retardation on descent, ran through windrow into laydown area. No injury; significant property damage and high-potential near-miss for personnel below ramp.',
  },
  timeline: [
    { text: 'Night-shift haul cycle commences on ramp 3; operator on 12th consecutive night.', whys: ['Roster pattern permitted 12 consecutive nights.', 'Fatigue management standard not enforced for relief crews.'], evidence_ids: ['ev5'] },
    { text: 'Intermittent retarder fault present but not actioned from prior pre-start reports.', whys: ['Defect not escalated to remove unit from service.', 'No trigger linked retarder faults to a stop-work decision.'], evidence_ids: ['ev2'] },
    { text: 'Truck begins loaded descent; operator selects a higher gear than procedure for the grade.', whys: [], evidence_ids: ['ev1'] },
    { text: 'Retardation fades on descent; truck accelerates beyond control speed.', whys: [], evidence_ids: ['ev1'] },
    { text: 'Service brake applied late; insufficient distance remaining to recover.', whys: [], evidence_ids: [] },
    { text: 'Truck runs through windrow into laydown area; high-potential near-miss.', whys: ['No runaway escape ramp provided on ramp 3.'], evidence_ids: ['ev4'] },
  ],
  holes: {
    org: [
      { type: 'latent', text: 'Fleet replacement deferred two budget cycles; ageing trucks retained beyond planned service life under production pressure.', ctrl: 'Capital risk review failed to escalate retardation reliability as a critical-control concern.', ev: 'Asset register; Exec minutes Q3' },
      { type: 'latent', text: 'No formal critical control management framework for "loss of control on grade" despite it being a recognised principal mining hazard.', ctrl: 'CCM framework absent for this MUH.', ev: 'WHS system review' },
    ],
    sup: [
      { type: 'latent', text: 'Pre-start defect reports for intermittent retarder fault not actioned across three shifts; no trigger to remove unit from service.', ctrl: 'Defect escalation procedure existed but was not enforced by supervision.', ev: 'Pre-start logs 15–18 May' },
    ],
    pre: [
      { type: 'latent', text: 'Operator at end of 12th consecutive night shift; roster pattern exceeded fatigue management standard.', ctrl: 'Fatigue risk control (roster limits) inadequate / exceeded.', ev: 'Roster records; FRMS' },
      { type: 'active', text: 'Operator selected a descent gear higher than site procedure for the grade and load.', ctrl: 'Gear-selection rule not reinforced; no in-cab decision support.', ev: 'Vehicle telemetry' },
    ],
    act: [
      { type: 'active', text: 'Service brake applied late as retardation faded; insufficient distance to recover before windrow.', ctrl: 'Last-resort braking response defeated by degraded system + late recognition.', ev: 'Telemetry; interview W2' },
    ],
    def: [
      { type: 'latent', text: 'Runaway-vehicle escape ramp not provided on ramp 3; windrow was sole physical defence.', ctrl: 'Engineering last-line defence absent.', ev: 'Mine plan; site inspection' },
    ],
  },
};

export const DEMO_EVIDENCE = [
  { id: 'ev1', title: 'Vehicle telemetry — ramp 3 descent', type: 'telemetry', description: 'Speed, gear selection, and brake application data exported from fleet management system.' },
  { id: 'ev2', title: 'Pre-start defect reports 15–18 May', type: 'document', description: 'Three consecutive shifts logged intermittent retarder fault; not escalated to remove unit from service.' },
  { id: 'ev3', title: 'Operator interview — W2', type: 'interview', description: 'Statement from night-shift operator regarding gear selection and retardation fade.' },
  { id: 'ev4', title: 'Site inspection — ramp 3', type: 'site_observation', description: 'Photographs of windrow damage and laydown area; no escape ramp present on descent.' },
  { id: 'ev5', title: 'Roster records — May cycle', type: 'document', description: 'Confirms 12 consecutive night shifts; FRMS exemption logged but not reviewed.' },
];

export const DEMO_PEEPO = {
  people: [
    { text: 'Operator on 12th consecutive night shift — fatigue.', evidence_ids: ['ev5'] },
    { text: 'Relief operator not available; roster gap.', evidence_ids: [] },
    { text: 'Supervisor did not action prior retarder defect reports.', evidence_ids: ['ev2'] },
  ],
  equipment: [
    { text: 'Ageing haul truck retained beyond planned service life.', evidence_ids: [] },
    { text: 'Intermittent retarder fault across three shifts.', evidence_ids: ['ev2'] },
    { text: 'No in-cab decision support for descent gear selection.', evidence_ids: ['ev1'] },
  ],
  environment: [
    { text: 'Ramp 3 descent grade and load condition.', evidence_ids: [] },
    { text: 'No runaway escape ramp provided.', evidence_ids: ['ev4'] },
    { text: 'Windrow was sole physical defence at base.', evidence_ids: ['ev4'] },
  ],
  procedures: [
    { text: 'Gear-selection rule for grade not reinforced.', evidence_ids: [] },
    { text: 'Defect escalation procedure not enforced by supervision.', evidence_ids: ['ev2'] },
    { text: 'No trigger linking retarder faults to stop-work decision.', evidence_ids: [] },
  ],
  organisation: [
    { text: 'Fleet replacement deferred two budget cycles under production pressure.', evidence_ids: [] },
    { text: 'No critical control management framework for "loss of control on grade".', evidence_ids: [] },
    { text: 'Fatigue management standard not enforced for relief crews.', evidence_ids: ['ev5'] },
  ],
};

export function getInitialHoles() {
  const holes = {};
  LAYERS.forEach(l => { holes[l.id] = []; });
  return holes;
}

export function interpret(latent, active, layersHit) {
  if (latent + active === 0) return 'Add barrier breaches to each layer to build the trajectory. The investigative goal is to surface latent conditions, not stop at the active failure.';
  if (latent === 0 && active > 0) return 'Caution: only active failures mapped so far. An accident that penetrated multiple layers almost always rests on latent conditions upstream — interrogate supervision and organisational tiers before concluding.';
  if (latent >= active) return `This profile is weighted toward latent conditions (${latent} latent vs ${active} active) — consistent with an organisational, systemic unwanted event. Corrective actions should target the system as designed and managed, prioritising critical controls in the hierarchy.`;
  return `${latent} latent and ${active} active breaches mapped across ${layersHit} layers. Test whether each active failure was a foreseeable consequence of an upstream latent condition before assigning weight to point-of-operation behaviour.`;
}