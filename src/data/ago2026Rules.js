// Atlantic Gathering Open (AGO) 2026 Official HEMA Tournament Rules Architecture

export const AGO_2026_TOURNAMENT = {
  id: 'ago-2026',
  name: 'Atlantic Gathering Open (AGO) 2026',
  shortName: 'AGO 2026',
  year: 2026,
  location: 'Atlantic Region HEMA Confederation',
  version: '2026.1',
  effectiveDate: '2026-01-01',
  description: 'Official ruleset for the Atlantic Gathering Open 2026 HEMA Tournament covering Open Longsword, Women\'s/Tiered Longsword, Rapier & Dagger, and Sabre.',
  
  matchFormat: {
    durationMinutes: 3,
    maxScore: 10,
    mercyLead: 5, // Lead by 5 in final minute ends match
    maxDoubleHitsPerMatch: 3,
    doubleHitPenaltyAtMax: 'On 3rd double hit, both fighters receive 0 pts & double warning. 4th double hit results in double loss (0 match points for both).'
  },

  divisions: [
    {
      id: 'open-longsword',
      name: 'Open Longsword',
      weapon: 'Steel Feder / Longsword',
      specifications: 'Flexibility minimum 12kg at tip; max length 140cm; total weight <= 1600g.'
    },
    {
      id: 'womens-longsword',
      name: 'Women\'s Longsword',
      weapon: 'Steel Feder / Longsword',
      specifications: 'Same technical scoring as Open division.'
    },
    {
      id: 'rapier-dagger',
      name: 'Rapier & Dagger',
      weapon: 'Cup-hilt / Swept-hilt Rapier & Main Gauche',
      specifications: 'Flexibility minimum 8kg at tip; dagger flex 10kg.'
    },
    {
      id: 'sabre',
      name: 'Sabre / Single Sword',
      weapon: 'Military / Historical Sabre',
      specifications: 'Curved or straight blade with full basket or bowl hilt.'
    }
  ],

  scoringZones: {
    deep: {
      points: 3,
      label: 'Deep Target (3 Pts)',
      areas: ['Head (Mask front & sides)', 'Back of Head (Mask rear protector)', 'Chest', 'Ribs', 'Upper Back', 'Shoulders'],
      color: '#f59e0b'
    },
    shallow: {
      points: 2,
      label: 'Shallow Target (2 Pts)',
      areas: ['Upper Arm (Bicep/Tricep)', 'Forearm & Elbow', 'Thigh', 'Knee & Calf'],
      color: '#3b82f6'
    },
    low: {
      points: 1,
      label: 'Extremity Target (1 Pt)',
      areas: ['Hands & Gorget/Gloves', 'Wrists', 'Feet & Ankle'],
      color: '#10b981'
    },
    forbidden: {
      points: 0,
      label: 'Forbidden / Illegal Target (Penalty)',
      areas: ['Spine (Direct spinal column)', 'Groin (Direct strike)', 'Unprotected Back of Knee'],
      color: '#ef4444'
    }
  },

  hitQualityCriteria: [
    {
      type: 'Cut',
      description: 'Must show clear edge alignment with at least 45° of weapon arc rotation prior to contact. Must exhibit audible or mechanical impact structure without being dangerous/excessive.',
      validSurfaces: ['Edge (True or False edge)']
    },
    {
      type: 'Thrust',
      description: 'Must land with tip on target and cause visible flex in the blade or demonstrate positive forward body mass continuation.',
      validSurfaces: ['Point / Tip']
    },
    {
      type: 'Slice / Draw Cut',
      description: 'Must press edge into target and draw/push across target surface for at least 12 inches (30cm) with body weight pressure.',
      validSurfaces: ['True edge', 'False edge']
    }
  ],

  rulesByTopic: [
    {
      id: 'afterblow',
      title: 'Afterblow & Timing Rules (1-Tempo Rule)',
      icon: 'Clock',
      summary: 'Afterblows must be initiated within 1 step or 1 physical tempo of the initial hit.',
      sections: [
        {
          code: 'AGO-4.1',
          heading: 'Definition of Afterblow',
          text: 'An afterblow is an attack launched by the defender immediately after receiving a hit. To be valid, the afterblow motion must begin within 1 step or 1 physical tempo of the primary hit.'
        },
        {
          code: 'AGO-4.2',
          heading: 'Afterblow Scoring Calculation (Net Difference)',
          text: 'AGO 2026 uses a net-deduction scoring model for afterblows. The afterblow target score is subtracted from the initial strike target score.',
          examples: [
            'Initial strike to Head (3 pts) - Afterblow to Arm (2 pts) = Fighter A receives 1 point.',
            'Initial strike to Arm (2 pts) - Afterblow to Head (3 pts) = Fighter B receives 1 point.',
            'Initial strike to Head (3 pts) - Afterblow to Head (3 pts) = 0 points awarded (Clean reset).'
          ]
        },
        {
          code: 'AGO-4.3',
          heading: 'Late / Out of Tempo Attacks',
          text: 'Attacks initiated after 1 step or after the referee has called "HALT" are classified as Late Attacks. They do not deduct points from the initial striker and may incur a Yellow Card for delay/safety.'
        }
      ]
    },
    {
      id: 'double-hits',
      title: 'Double Hits & Disqualification Policy',
      icon: 'AlertTriangle',
      summary: 'Simultaneous hits without defense result in 0 points and count toward match double limit.',
      sections: [
        {
          code: 'AGO-5.1',
          heading: 'Definition of Double Hit',
          text: 'A double hit occurs when both fighters land valid strikes on each other simultaneously (within the same tempo) without either fighter executing a defensive parry or cover.'
        },
        {
          code: 'AGO-5.2',
          heading: 'Scoring Penalty for Double Hits',
          text: 'Double hits yield 0 points for both fighters. Every double hit is recorded on the ring score board.'
        },
        {
          code: 'AGO-5.3',
          heading: '3-Double Limit & Double Match Loss',
          text: 'Upon reaching 3 double hits in a single match, both fighters receive a mandatory Warning. If a 4th double hit occurs, the match immediately terminates as a Double Loss (0 match points for both competitors in pool standings).'
        }
      ]
    },
    {
      id: 'grappling',
      title: 'Grappling, Wrestling & Disarms',
      icon: 'ShieldAlert',
      summary: '3-second close measure grappling limit. Controlled takedowns and disarms score bonus points.',
      sections: [
        {
          code: 'AGO-6.1',
          heading: '3-Second Grappling Window',
          text: 'Grappling (body-to-body or hand-to-hilt contact) is allowed for a maximum of 3 seconds. The referee will count "1, 2, HALT" if no scoring action occurs.'
        },
        {
          code: 'AGO-6.2',
          heading: 'Controlled Takedowns (+2 Points)',
          text: 'Executing a controlled throw or takedown where the opponent lands on the mat while the attacker remains standing or in dominant control awards +2 points. Dangerous dumps (landing on head/neck) are strictly forbidden and result in Red Card.'
        },
        {
          code: 'AGO-6.3',
          heading: 'Weapon Disarm (+2 or +3 Points)',
          text: 'Stripping the weapon completely from an opponent\'s grip awards +2 points. Disarming while retaining point control on the opponent awards +3 points.'
        },
        {
          code: 'AGO-6.4',
          heading: 'Forbidden Striking in Grapple',
          text: 'Striking with the pommel to the mask or face is STRICTLY PROHIBITED (Yellow/Red Card). Pommel thrusts to the padded chest are permitted for push control only (0 pts).'
        }
      ]
    },
    {
      id: 'ring-outs',
      title: 'Ring-Outs & Boundary Rules',
      icon: 'Square',
      summary: 'Stepping entirely outside the 8m x 8m ring boundary incurs warnings and points penalties.',
      sections: [
        {
          code: 'AGO-7.1',
          heading: 'Ring-Out Definition',
          text: 'A Ring-Out occurs when a competitor places both feet completely outside the outer ring boundary line.'
        },
        {
          code: 'AGO-7.2',
          heading: 'Fleeing / Step-Out Penalty (+1 Pt to Opponent)',
          text: 'If a fighter steps out of bounds while retreating or fleeing from engagement without throwing an attack, 1 point is awarded to the opponent.'
        },
        {
          code: 'AGO-7.3',
          heading: 'Strike While Stepping Out',
          text: 'If a fighter lands a hit while simultaneously stepping out, the hit is scored, but the fighter receives a Boundary Warning. Two boundary warnings in a match result in 1 point penalty.'
        }
      ]
    },
    {
      id: 'safety-gear',
      title: 'Mandatory Safety & Equipment Inspection',
      icon: 'Shield',
      summary: 'Strict gear requirements mandatory before entering the ring.',
      sections: [
        {
          code: 'AGO-2.1',
          heading: 'Fencing Mask & Back of Head',
          text: 'FIE 1600N mask or 350N with mandatory rigid back-of-head protection. No gaps between mask overlay and throat gorget.'
        },
        {
          code: 'AGO-2.2',
          heading: 'Gorget & Body Protection',
          text: 'Rigid throat gorget worn under jacket. 350N puncture resistant fencing jacket (800N recommended for Open Longsword). Heavy hard elbows, knees, and shin guards required.'
        },
        {
          code: 'AGO-2.3',
          heading: 'Hand Protection Standard',
          text: 'Open Longsword requires heavy clamshell gloves (e.g. SPES Heavy, Sparring Gloves, ProGauntlet). Light 350N gloves are allowed ONLY for Rapier & Dagger.'
        }
      ]
    },
    {
      id: 'penalties',
      title: 'Penalties & Cards Progression',
      icon: 'FileWarning',
      summary: 'Clear warning levels: Verbal -> Yellow Card (-1 pt) -> Red Card (-3 pts) -> Black Card (DQ).',
      sections: [
        {
          code: 'AGO-8.1',
          heading: 'Verbal Warning',
          text: 'Issued for minor delays, non-dangerous ring-out, or turning back to opponent.'
        },
        {
          code: 'AGO-8.2',
          heading: 'Yellow Card (-1 Point)',
          text: 'Issued for excessive force, strike after HALT, prohibited pommel strike to face, or striking forbidden zones (spine/groin).'
        },
        {
          code: 'AGO-8.3',
          heading: 'Red Card (-3 Points / Match Forfeit)',
          text: 'Issued for dangerous throwing technique, unsportsmanlike conduct, or second Yellow Card infraction. Results in deduction of 3 points or match forfeit.'
        },
        {
          code: 'AGO-8.4',
          heading: 'Black Card (Tournament Disqualification)',
          text: 'Issued for intentional injury, violent assault, or gross disrespect to officials. Competitor is ejected from all AGO 2026 events.'
        }
      ]
    }
  ],

  frequentlyAskedQuestions: [
    {
      id: 'faq-1',
      question: 'Can I pommel strike an opponent\'s mask in AGO 2026?',
      verdict: 'Forbidden (Yellow / Red Card)',
      summary: 'No. Pommel strikes to the mask/face are strictly illegal in AGO 2026 due to concussion risk.',
      explanation: 'Under rule AGO-6.4, pommel strikes directed at the head or mask are prohibited and carry a mandatory Yellow Card (-1 point penalty) or Red Card for repeated offences. Pommel contact is permitted only as a gentle push to the chest during a grapple.',
      code: 'AGO-6.4'
    },
    {
      id: 'faq-2',
      question: 'How is an afterblow calculated if I hit the head and they hit my arm?',
      verdict: 'Net Score: You receive +1 Point',
      summary: 'Head (3 pts) minus Arm Afterblow (2 pts) = 1 Point awarded to you.',
      explanation: 'AGO 2026 uses net difference scoring (AGO-4.2). Your initial head strike is worth 3 points. Their valid 1-tempo afterblow to your arm is worth 2 points. 3 - 2 = 1 point awarded to you.',
      code: 'AGO-4.2'
    },
    {
      id: 'faq-3',
      question: 'What happens if we double hit 3 times in a match?',
      verdict: 'Double Warning & 0 Pts. 4th Double = Double Loss',
      summary: 'The 3rd double hit gives 0 points and a final warning. A 4th double hit results in both fighters losing the match.',
      explanation: 'According to AGO-5.3, after 3 double hits, both fighters receive a mandatory warning. If a 4th double hit occurs in the same match, the match ends immediately in a Double Loss, awarding 0 match points to both fighters in pool standings.',
      code: 'AGO-5.3'
    },
    {
      id: 'faq-4',
      question: 'How long can a grapple last before the referee calls halt?',
      verdict: 'Maximum 3 Seconds',
      summary: 'Grappling is limited to 3 seconds of active struggle.',
      explanation: 'Under AGO-6.1, fighters have 3 seconds to execute a valid takedown (+2 pts), disarm (+2/+3 pts), or strike in grapple. If no progress is made by 3 seconds, the referee halts the exchange and resets to distance.',
      code: 'AGO-6.1'
    },
    {
      id: 'faq-5',
      question: 'Is striking with the flat of the sword valid for points?',
      verdict: 'No Score',
      summary: 'Flat strikes are invalid. Strikes must show edge alignment or clear thrust structure.',
      explanation: 'Hit quality criteria (AGO-3.1) require cuts to have clear edge alignment with 45° rotation. Flat strikes do not score points and will be called "No Quality" by judges.',
      code: 'AGO-3.1'
    },
    {
      id: 'faq-6',
      question: 'What are the points awarded for a controlled takedown?',
      verdict: '+2 Points',
      summary: 'A controlled throw or takedown onto the mat awards +2 points.',
      explanation: 'Under AGO-6.2, bringing an opponent to the mat safely while staying in control scores +2 points. Uncontrolled or head-first throws are illegal.',
      code: 'AGO-6.2'
    }
  ]
};
