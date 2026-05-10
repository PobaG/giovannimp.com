const LANE_META = {
  power: { label: "Power", studyLabel: "Power + Cable" },
  signal: { label: "Signal", studyLabel: "Signal + Data" },
  lighting: { label: "Lighting", studyLabel: "Lighting Fixtures" },
  rigging: { label: "Rigging", studyLabel: "Rigging + Motors" },
  audio: { label: "Audio", studyLabel: "Audio Deck" }
};

const LESSONS = [
  {
    id: "mixed",
    title: "Crew Call Mix",
    blurb: "A mixed refresher across staging power, cable, lighting, rigging, and audio deck basics.",
    questionCount: 12,
    lanes: ["power", "signal", "lighting", "rigging", "audio"]
  },
  {
    id: "cables",
    title: "Cable Lane",
    blurb: "Power, distro, signal, and connector identification for fast cable naming reps.",
    questionCount: 12,
    lanes: ["power", "signal"]
  },
  {
    id: "lighting",
    title: "Fixture Focus",
    blurb: "Lock in the names of common stage fixtures and a few workhorse looks.",
    questionCount: 10,
    lanes: ["lighting"]
  },
  {
    id: "rigging",
    title: "Rigging Refresh",
    blurb: "Motors, soft goods, hardware, and structure pieces you hear on rigging calls.",
    questionCount: 10,
    lanes: ["rigging"]
  },
  {
    id: "audio",
    title: "Audio Deck",
    blurb: "Fast reps on wedges, fills, subs, speaker cable, and flown PA basics.",
    questionCount: 10,
    lanes: ["audio", "signal"]
  }
];

const STAGE_ITEMS = [
  {
    id: "feeder",
    name: "Feeder",
    aliases: ["Cam-Lok", "4/0 feeder"],
    lane: "power",
    group: "Cable",
    useLine: "High-amperage cable set used to bring generator or mains power into a distro.",
    scenario: "You need to feed a distro from a generator or service disconnect with high current. What do you pull?",
    art: { kind: "power_bundle", accent: "#f97316" },
    photo: ""
  },
  {
    id: "socapex",
    name: "Socapex",
    aliases: ["Soca", "19-pin"],
    lane: "power",
    group: "Cable",
    useLine: "A multipin lighting cable that carries six circuits in one run.",
    scenario: "You want one trunk line carrying six lighting circuits from dimmer beach to the stage. Which cable is it?",
    art: { kind: "multipin", accent: "#f59e0b" },
    photo: ""
  },
  {
    id: "soca-breakout",
    name: "Soca Breakout",
    aliases: ["Breakout", "Fanout"],
    lane: "power",
    group: "Cable",
    useLine: "A fanout that turns one Socapex multipin into individual circuit tails.",
    scenario: "You have a Soca line at the fixture end and need individual tails for separate lights. What adapter do you use?",
    art: { kind: "fanout", accent: "#10b981" },
    photo: ""
  },
  {
    id: "edison",
    name: "Edison Extension",
    aliases: ["Household power"],
    lane: "power",
    group: "Cable",
    useLine: "Standard straight-blade power used for common 120V gear and practicals.",
    scenario: "You need ordinary 120V power for a workbox, practical, or small piece of gear. Which cable fits?",
    art: { kind: "connector_coil", variant: "edison", accent: "#60a5fa" },
    photo: ""
  },
  {
    id: "stage-pin",
    name: "Stage Pin",
    aliases: ["Bates stage pin"],
    lane: "power",
    group: "Cable",
    useLine: "Two-pin-plus-ground theatrical connector common in older venue dimming systems.",
    scenario: "You are in a theater with classic dimmer circuits and two flat pins plus a ground. What cable is that?",
    art: { kind: "connector_coil", variant: "stagepin", accent: "#fb7185" },
    photo: ""
  },
  {
    id: "l620",
    name: "L6-20",
    aliases: ["Twist-lock 20A"],
    lane: "power",
    group: "Cable",
    useLine: "A locking 20A connector often used for distributed power to lighting and AV gear.",
    scenario: "You need a locking 20A twist-lock power line for distro or powered gear. What connector family do you want?",
    art: { kind: "connector_coil", variant: "l620", accent: "#f59e0b" },
    photo: ""
  },
  {
    id: "powercon",
    name: "PowerCON",
    aliases: ["Blue/gray locking power"],
    lane: "power",
    group: "Cable",
    useLine: "A locking power connector commonly used on LED fixtures and powered stage gear.",
    scenario: "A fixture wants the blue-and-gray locking power cable common in LED systems. What is it called?",
    art: { kind: "connector_coil", variant: "powercon", accent: "#2563eb" },
    photo: ""
  },
  {
    id: "true1",
    name: "True1",
    aliases: ["PowerCON True1"],
    lane: "power",
    group: "Cable",
    useLine: "A rugged locking power connector with latch style often used for modern fixture power linking.",
    scenario: "You need the black locking power cable with the yellow latch used on newer fixture systems. What do you grab?",
    art: { kind: "connector_coil", variant: "true1", accent: "#eab308" },
    photo: ""
  },
  {
    id: "jumper",
    name: "Jumper Cable",
    aliases: ["Jumper"],
    lane: "power",
    group: "Cable",
    useLine: "A short cable used to bridge nearby power or distro points without running a full extension.",
    scenario: "You only need a short bridge between two close power points or distro pieces. What cable name fits best?",
    art: { kind: "connector_coil", variant: "jumper", accent: "#94a3b8" },
    photo: ""
  },
  {
    id: "xlr",
    name: "XLR",
    aliases: ["3-pin audio"],
    lane: "signal",
    group: "Cable",
    useLine: "A three-pin balanced cable commonly used for microphones and analog audio lines.",
    scenario: "You are patching a microphone or analog audio signal. Which cable is the standard pick?",
    art: { kind: "connector_coil", variant: "xlr", accent: "#64748b" },
    photo: ""
  },
  {
    id: "dmx",
    name: "DMX",
    aliases: ["5-pin DMX"],
    lane: "signal",
    group: "Cable",
    useLine: "A five-pin control cable used to send lighting data between consoles, nodes, and fixtures.",
    scenario: "You need to move lighting control data between console and fixtures. What cable is the standard call?",
    art: { kind: "connector_coil", variant: "dmx", accent: "#22c55e" },
    photo: ""
  },
  {
    id: "ethercon",
    name: "EtherCON",
    aliases: ["Ruggedized RJ45"],
    lane: "signal",
    group: "Cable",
    useLine: "A locking shell around RJ45 for networked lighting, audio, and show-control runs.",
    scenario: "The call is for shielded network line with a rugged locking shell for stage use. Which connector is it?",
    art: { kind: "connector_coil", variant: "ethercon", accent: "#0f766e" },
    photo: ""
  },
  {
    id: "sdi",
    name: "SDI / BNC",
    aliases: ["BNC video"],
    lane: "signal",
    group: "Cable",
    useLine: "A coaxial video line used for camera feeds, switcher paths, and long-run broadcast signal.",
    scenario: "You need a coax video line for camera or switcher feed instead of network or audio. What do you ask for?",
    art: { kind: "connector_coil", variant: "sdi", accent: "#ef4444" },
    photo: ""
  },
  {
    id: "opticalcon",
    name: "OpticalCON",
    aliases: ["Tactical fiber"],
    lane: "signal",
    group: "Cable",
    useLine: "A ruggedized fiber connector used for long-distance high-bandwidth show networking or video transport.",
    scenario: "The run is long, bandwidth heavy, and needs field-rugged fiber on show site. What connector name fits?",
    art: { kind: "connector_coil", variant: "opticalcon", accent: "#84cc16" },
    photo: ""
  },
  {
    id: "speakon",
    name: "SpeakON",
    aliases: ["NL4"],
    lane: "audio",
    group: "Cable",
    useLine: "A locking speaker cable used between amps, racks, and passive loudspeakers.",
    scenario: "You need a locking speaker cable between an amp output and a passive cabinet. Which connector is right?",
    art: { kind: "connector_coil", variant: "speakon", accent: "#2563eb" },
    photo: ""
  },
  {
    id: "leko",
    name: "Leko",
    aliases: ["Ellipsoidal", "Source Four style"],
    lane: "lighting",
    group: "Fixture",
    useLine: "A hard-edge spotlight used for precise beam control, shutter cuts, and pattern projection.",
    scenario: "You need a fixture that can shutter, focus, and throw a hard-edged beam. Which one do you ask for?",
    art: { kind: "fixture_cyl", variant: "leko", accent: "#f59e0b" },
    photo: ""
  },
  {
    id: "parcan",
    name: "Par Can",
    aliases: ["PAR"],
    lane: "lighting",
    group: "Fixture",
    useLine: "A simple can-style fixture known for punchy beam output and basic wash work.",
    scenario: "You want a classic can-shaped fixture for a straightforward punchy beam or wash. What is it?",
    art: { kind: "fixture_cyl", variant: "parcan", accent: "#fb923c" },
    photo: ""
  },
  {
    id: "fresnel",
    name: "Fresnel",
    aliases: ["Soft-edge wash"],
    lane: "lighting",
    group: "Fixture",
    useLine: "A soft-edge fixture used for warm washes and controllable beam spread.",
    scenario: "You need a softer-edged wash light rather than a hard shuttered beam. Which fixture fits?",
    art: { kind: "fixture_cyl", variant: "fresnel", accent: "#fbbf24" },
    photo: ""
  },
  {
    id: "blinder",
    name: "Blinder",
    aliases: ["Audience blinder"],
    lane: "lighting",
    group: "Fixture",
    useLine: "A bright multi-cell fixture aimed for big audience hits or bold accent moments.",
    scenario: "You need a four-cell style hit fixture for punchy audience looks. What is the common name?",
    art: { kind: "fixture_panel", variant: "blinder", accent: "#f97316" },
    photo: ""
  },
  {
    id: "batten",
    name: "Batten",
    aliases: ["Strip light", "LED bar"],
    lane: "lighting",
    group: "Fixture",
    useLine: "A linear strip fixture used for wall, truss, and scenic washes or pixel effects.",
    scenario: "You want a long linear light for scenic edge, wall, or truss wash. Which fixture name fits?",
    art: { kind: "fixture_panel", variant: "batten", accent: "#22c55e" },
    photo: ""
  },
  {
    id: "moving-wash",
    name: "Moving Wash",
    aliases: ["Moving head wash"],
    lane: "lighting",
    group: "Fixture",
    useLine: "A motorized fixture with pan and tilt built for broad moving wash looks.",
    scenario: "You need a pan-and-tilt fixture for sweeping wash moves rather than a static lamp. What do you call it?",
    art: { kind: "moving_head", accent: "#38bdf8" },
    photo: ""
  },
  {
    id: "strobe",
    name: "Strobe",
    aliases: ["Flash fixture"],
    lane: "lighting",
    group: "Fixture",
    useLine: "A fixture designed for rapid flash effects and explosive accent looks.",
    scenario: "You want a fixture whose whole job is intense flash effects. Which name should jump to mind?",
    art: { kind: "fixture_panel", variant: "strobe", accent: "#eab308" },
    photo: ""
  },
  {
    id: "followspot",
    name: "Followspot",
    aliases: ["Spotlight operator fixture"],
    lane: "lighting",
    group: "Fixture",
    useLine: "A manually aimed spotlight used to track performers from a distance.",
    scenario: "You need an operator-driven spot that tracks a performer through the show. What fixture is that?",
    art: { kind: "fixture_cyl", variant: "followspot", accent: "#60a5fa" },
    photo: ""
  },
  {
    id: "chain-hoist",
    name: "Chain Hoist",
    aliases: ["Motor", "Chain motor"],
    lane: "rigging",
    group: "Rigging",
    useLine: "A motorized hoist used to lift truss, PA, and lighting loads.",
    scenario: "You need the powered motor that lifts truss or arrays into the air. What gear name fits?",
    art: { kind: "hoist", accent: "#64748b" },
    photo: ""
  },
  {
    id: "chain-bag",
    name: "Chain Bag",
    aliases: ["Motor chain bag"],
    lane: "rigging",
    group: "Rigging",
    useLine: "A hanging bag that catches excess hoist chain as the motor travels.",
    scenario: "You are catching slack chain under a motor so it stays contained and clean. What bag is that?",
    art: { kind: "chain_bag", accent: "#0f766e" },
    photo: ""
  },
  {
    id: "spanset",
    name: "Spanset / Gacflex",
    aliases: ["Round sling"],
    lane: "rigging",
    group: "Rigging",
    useLine: "A soft round sling used for wrapping truss or structure as a rigging pick point.",
    scenario: "You need a soft sling around truss instead of hard steel hardware. What do you ask for?",
    art: { kind: "rigging_soft", variant: "spanset", accent: "#22c55e" },
    photo: ""
  },
  {
    id: "shackle",
    name: "Shackle",
    aliases: ["Bow shackle"],
    lane: "rigging",
    group: "Rigging",
    useLine: "A metal rigging connector used to join slings, chains, and hardware points.",
    scenario: "You need a rated metal connector with a removable pin to join rigging hardware. What is it?",
    art: { kind: "rigging_soft", variant: "shackle", accent: "#94a3b8" },
    photo: ""
  },
  {
    id: "motor-distro",
    name: "Motor Distro",
    aliases: ["Motor distro"],
    lane: "rigging",
    group: "Rigging",
    useLine: "A distribution box that provides organized power outs for multiple chain motors.",
    scenario: "You need a distro box dedicated to sending power to several chain motors. What is that box called?",
    art: { kind: "distro_box", accent: "#38bdf8" },
    photo: ""
  },
  {
    id: "truss",
    name: "Box Truss",
    aliases: ["Truss"],
    lane: "rigging",
    group: "Rigging",
    useLine: "The aluminum structural framework used to support lighting, video, and audio loads.",
    scenario: "You need the aluminum structure the whole lighting or PA package hangs from. What is it called?",
    art: { kind: "truss", accent: "#cbd5e1" },
    photo: ""
  },
  {
    id: "monitor-wedge",
    name: "Monitor Wedge",
    aliases: ["Wedge"],
    lane: "audio",
    group: "Audio",
    useLine: "A floor monitor angled up at performers for onstage mix playback.",
    scenario: "You need a floor monitor aimed back at the artist's ears from the deck. What speaker is that?",
    art: { kind: "speaker", variant: "wedge", accent: "#f97316" },
    photo: ""
  },
  {
    id: "front-fill",
    name: "Front Fill",
    aliases: ["Lip fill"],
    lane: "audio",
    group: "Audio",
    useLine: "A small speaker placed along the stage lip to cover audience areas missed by the main PA.",
    scenario: "You need small downstage speakers covering the front rows the main arrays miss. What are they called?",
    art: { kind: "speaker", variant: "frontfill", accent: "#14b8a6" },
    photo: ""
  },
  {
    id: "ground-sub",
    name: "Ground Sub",
    aliases: ["Subwoofer"],
    lane: "audio",
    group: "Audio",
    useLine: "A low-frequency speaker cabinet stacked on the ground for sub-bass reinforcement.",
    scenario: "You are stacking large low-end cabinets on the deck for bass energy. Which speaker type is that?",
    art: { kind: "speaker", variant: "sub", accent: "#0f172a" },
    photo: ""
  },
  {
    id: "line-array",
    name: "Line Array Cabinet",
    aliases: ["Array box"],
    lane: "audio",
    group: "Audio",
    useLine: "A flown loudspeaker cabinet designed to work in a vertical array for even coverage.",
    scenario: "You need the curved flown PA element that builds into a vertical hang. What cabinet type is it?",
    art: { kind: "speaker", variant: "array", accent: "#64748b" },
    photo: ""
  }
];

window.StageRightData = {
  LANE_META,
  LESSONS,
  STAGE_ITEMS
};
