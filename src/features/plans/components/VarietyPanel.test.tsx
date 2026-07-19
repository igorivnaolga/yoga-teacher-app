import { render, screen } from '@testing-library/react-native';

import type { VarietyAnalysis } from '@/domain/variety';

import { VarietyPanel } from './VarietyPanel';

const baseAnalysis: VarietyAnalysis = {
  weekday: 1,
  weekdayLabel: 'Monday',
  sessionWindow: 2,
  draftSequence: ['mountain', 'forward-fold', 'half-lift'],
  matches: [
    {
      sessionId: 's1',
      date: '2026-07-13',
      classPlanId: 'plan-a',
      kind: 'exact',
      sharedRunLength: 3,
      sharedRatio: 1,
    },
  ],
  overlapLevel: 'high',
  exactSequenceRepeated: true,
};

describe('VarietyPanel', () => {
  it('explains empty weekday history', async () => {
    await render(
      <VarietyPanel
        analysis={{ ...baseAnalysis, sessionWindow: 0, overlapLevel: 'none', matches: [] }}
        matchSummaries={[]}
        hasHistory={false}
      />,
    );

    expect(screen.getByText(/Comparing sequences for Mondays/i)).toBeOnTheScreen();
    expect(screen.getByText(/Individual poses can be reused/i)).toBeOnTheScreen();
  });

  it('shows exact sequence match guidance', async () => {
    await render(
      <VarietyPanel
        analysis={baseAnalysis}
        matchSummaries={[
          {
            sessionId: 's1',
            kind: 'exact',
            label: 'Same full sequence as Monday A (2026-07-13)',
          },
        ]}
        hasHistory
      />,
    );

    expect(screen.getByText(/Exact sequence already taught/i)).toBeOnTheScreen();
    expect(screen.getByText(/Same full sequence as Monday A/i)).toBeOnTheScreen();
  });
});
