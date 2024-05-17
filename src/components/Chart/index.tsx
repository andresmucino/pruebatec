import React from 'react';
import { EuiPanel } from '@elastic/eui';
import { Chart, Metric, Settings } from '@elastic/charts';

export const ListChart = () => {

  const data = Array.from({ length: 30 }).map((d, i) => ({
    x: i,
    y: Math.random() * 1000 + 10000,
  }));

  return (
    <EuiPanel paddingSize="none" style={{ overflow: 'hidden', width: 200 }}>
      <Chart size={[200, 200]}>
        <Settings baseTheme={undefined} />
        <Metric
          id="1"
          data={[
            [
              {
                color: '#6ECCB1',
                title: 'Number of visitors',
                subtitle: 'www.eui.co',
                extra: <span>unique visitors</span>,
                value: data[data.length - 1].y,
                valueFormatter: (v) => `${(v / 1000).toFixed(0)}K`,
                trend: data,
                trendShape: 'area',
                trendA11yTitle:
                  'The current number of visitors in the last 10 minutes',
                trendA11yDescription:
                  'The trend shows a stable number of unique visitors over the last 10 minutes',
              },
            ],
          ]}
        />{' '}
      </Chart>
    </EuiPanel>
  );
};