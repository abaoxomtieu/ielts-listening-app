'use client';

import React from 'react';
import PlanLabelling from './PlanLabelling';
import MapLabelling from './MapLabelling';
import DiagramLabelling from './DiagramLabelling';
import { PlanLabelling as PlanLabellingType, MapLabelling as MapLabellingType, DiagramLabelling as DiagramLabellingType } from '../../types';

const planLabellingData: PlanLabellingType = {
  meta: {
    questionType: 'plan_map_diagram',
    variant: 'plan_labelling',
    section: 2,
    questionNumber: 11,
    difficulty: 'medium',
    version: '1.0',
    createdAt: '2025-01-11T00:00:00Z'
  },
  content: {
    questionText: 'Label the rooms in the library floor plan below.',
    image: {
      url: '/images/section2-library-plan.png',
      altText: 'Library floor plan with unlabeled rooms',
      width: 800,
      height: 600,
      hotspots: [
        { id: 11, x: 150, y: 100, label: '?', position: 'top' },
        { id: 12, x: 450, y: 100, label: '?', position: 'top' },
        { id: 13, x: 150, y: 300, label: '?', position: 'top' },
        { id: 14, x: 450, y: 300, label: '?', position: 'top' },
        { id: 15, x: 300, y: 500, label: '?', position: 'bottom' }
      ]
    },
    questions: [
      { id: 11, text: 'Room 1 (top left)' },
      { id: 12, text: 'Room 2 (top right)' },
      { id: 13, text: 'Room 3 (bottom left)' },
      { id: 14, text: 'Room 4 (bottom right)' },
      { id: 15, text: 'Central area' }
    ],
    answer: {
      '11': 'Reception Desk',
      '12': 'Computer Room',
      '13': 'Quiet Study Area',
      '14': 'Group Study Room',
      '15': 'Circulation Desk'
    },
    answerLabels: {
      '11': 'A',
      '12': 'B',
      '13': 'C',
      '14': 'D',
      '15': 'E'
    },
    explanation: 'Starting from the entrance on the left, you first encounter the Reception Desk (11). Moving clockwise, the Computer Room (12) is in the top right corner.',
    instructions: 'Choose the correct letters A-E from the box.',
    wordLimit: null,
    audioTimeRange: {
      start: '02:00',
      end: '03:45'
    },
    media: {
      image: '/images/section2-library-plan.png',
      audio: '/audio/section2.mp3'
    },
    uiHints: {
      displayType: 'imageWithLabels',
      showNumberedLabels: true,
      alphabeticalOptions: ['A', 'B', 'C', 'D', 'E'],
      dragAndDrop: true
    },
    validation: {
      minQuestions: 3,
      maxQuestions: 6,
      required: true
    }
  },
  answerKey: {
    '11': 'A',
    '12': 'B',
    '13': 'C',
    '14': 'D',
    '15': 'E'
  },
  scoring: {
    points: 1,
    partialCredit: false,
    penaltyForWrong: 0
  }
};

const mapLabellingData: MapLabellingType = {
  meta: {
    questionType: 'plan_map_diagram',
    variant: 'map_labelling',
    section: 2,
    questionNumber: 11,
    difficulty: 'hard',
    version: '1.0',
    createdAt: '2025-01-11T00:00:00Z'
  },
  content: {
    questionText: 'Label the locations on the town map below.',
    image: {
      url: '/images/section2-town-map.png',
      altText: 'Town map with unlabeled locations',
      width: 900,
      height: 700,
      hotspots: [
        { id: 11, x: 200, y: 150, label: '11', position: 'right', marker: 'pin' },
        { id: 12, x: 450, y: 200, label: '12', position: 'right', marker: 'pin' },
        { id: 13, x: 650, y: 350, label: '13', position: 'left', marker: 'pin' },
        { id: 14, x: 350, y: 500, label: '14', position: 'right', marker: 'pin' },
        { id: 15, x: 700, y: 550, label: '15', position: 'left', marker: 'pin' }
      ]
    },
    questions: [
      { id: 11, text: 'Location 11' },
      { id: 12, text: 'Location 12' },
      { id: 13, text: 'Location 13' },
      { id: 14, text: 'Location 14' },
      { id: 15, text: 'Location 15' }
    ],
    directionsVocabulary: {
      startingPoint: 'You are at the Tourist Information Centre in the centre of town',
      keyPhrases: [
        'opposite',
        'next to',
        'turn left',
        'turn right',
        'go straight ahead',
        'at the junction',
        'on the corner of'
      ]
    },
    answer: {
      '11': 'Post Office',
      '12': 'Library',
      '13': 'Swimming Pool',
      '14': 'Shopping Centre',
      '15': 'Train Station'
    },
    answerLabels: {
      '11': 'A',
      '12': 'B',
      '13': 'C',
      '14': 'D',
      '15': 'E'
    },
    explanation: 'Starting from the Tourist Information Centre, the Post Office (11) is opposite it on the other side of the street.',
    instructions: 'Choose the correct letters A-E from the box.',
    wordLimit: null,
    audioTimeRange: {
      start: '03:00',
      end: '05:30'
    },
    media: {
      image: '/images/section2-town-map.png',
      audio: '/audio/section2.mp3'
    },
    uiHints: {
      displayType: 'mapWithMarkers',
      showNumberedLabels: true,
      alphabeticalOptions: ['A', 'B', 'C', 'D', 'E'],
      dragAndDrop: true,
      zoomEnabled: true
    },
    validation: {
      minQuestions: 3,
      maxQuestions: 6,
      required: true
    }
  },
  answerKey: {
    '11': 'A',
    '12': 'B',
    '13': 'C',
    '14': 'D',
    '15': 'E'
  },
  scoring: {
    points: 1,
    partialCredit: false,
    penaltyForWrong: 0
  }
};

const diagramLabellingData: DiagramLabellingType = {
  meta: {
    questionType: 'plan_map_diagram',
    variant: 'diagram_labelling',
    section: 4,
    questionNumber: 31,
    difficulty: 'medium',
    version: '1.0',
    createdAt: '2025-01-11T00:00:00Z'
  },
  content: {
    questionText: 'Label the parts of the water filtration system diagram below.',
    image: {
      url: '/images/section4-water-filtration.png',
      altText: 'Water filtration system diagram with unlabeled parts',
      width: 850,
      height: 650,
      hotspots: [
        { id: 31, x: 100, y: 150, label: '31', position: 'right', connector: 'arrow' },
        { id: 32, x: 250, y: 250, label: '32', position: 'right', connector: 'arrow' },
        { id: 33, x: 400, y: 350, label: '33', position: 'right', connector: 'arrow' },
        { id: 34, x: 550, y: 450, label: '34', position: 'right', connector: 'arrow' },
        { id: 35, x: 700, y: 550, label: '35', position: 'left', connector: 'arrow' }
      ]
    },
    questions: [
      { id: 31, text: 'First stage' },
      { id: 32, text: 'Second stage' },
      { id: 33, text: 'Third stage' },
      { id: 34, text: 'Fourth stage' },
      { id: 35, text: 'Final stage' }
    ],
    processFlow: [
      { step: 1, description: 'Water enters the system' },
      { step: 2, description: 'Screening removes large debris' },
      { step: 3, description: 'Coagulation and sedimentation' },
      { step: 4, description: 'Filtration through sand and gravel' },
      { step: 5, description: 'Disinfection with chlorine' },
      { step: 6, description: 'Clean water distributed' }
    ],
    answer: {
      '31': 'Intake Pump',
      '32': 'Screening Chamber',
      '33': 'Sedimentation Tank',
      '34': 'Filter Beds',
      '35': 'Chlorination Unit'
    },
    answerLabels: {
      '31': 'A',
      '32': 'B',
      '33': 'C',
      '34': 'D',
      '35': 'E'
    },
    explanation: 'The water filtration process begins at the Intake Pump (31), which draws water from the source.',
    instructions: 'Choose the correct letters A-E from the box.',
    wordLimit: null,
    audioTimeRange: {
      start: '06:15',
      end: '08:30'
    },
    media: {
      image: '/images/section4-water-filtration.png',
      audio: '/audio/section4.mp3'
    },
    uiHints: {
      displayType: 'diagramWithLabels',
      showNumberedLabels: true,
      alphabeticalOptions: ['A', 'B', 'C', 'D', 'E'],
      dragAndDrop: true,
      showProcessFlow: true
    },
    validation: {
      minQuestions: 3,
      maxQuestions: 6,
      required: true
    }
  },
  answerKey: {
    '31': 'A',
    '32': 'B',
    '33': 'C',
    '34': 'D',
    '35': 'E'
  },
  scoring: {
    points: 1,
    partialCredit: false,
    penaltyForWrong: 0
  }
};

export default function ExampleUsage() {
  return (
    <div className="space-y-12 p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Plan/Map/Diagram Components Demo</h1>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Plan Labelling</h2>
        <PlanLabelling data={planLabellingData} />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Map Labelling</h2>
        <MapLabelling data={mapLabellingData} />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Diagram Labelling</h2>
        <DiagramLabelling data={diagramLabellingData} />
      </section>
    </div>
  );
}
