import React from 'react';

interface ChartData {
    name: string;
    income: number;
    expenses: number;
}

interface ChartProps {
    data: ChartData[];
}

export const SimpleBarChart: React.FC<ChartProps> = ({ data }) => {
    const width = 500;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const maxValue = Math.max(...data.map(d => d.income), ...data.map(d => d.expenses));

    const xScale = (index: number) => margin.left + (index * (width - margin.left - margin.right)) / data.length;
    const yScale = (value: number) => height - margin.bottom - (value / maxValue) * (height - margin.top - margin.bottom);
    const barWidth = ((width - margin.left - margin.right) / data.length) * 0.4;

    const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
        const value = (i / 4) * maxValue;
        return { value: Math.round(value), y: yScale(value) };
    });

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Y-axis grid lines and labels */}
            {yAxisLabels.map(({ value, y }, i) => (
                <g key={i}>
                    <line x1={margin.left} x2={width - margin.right} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                    <text x={margin.left - 8} y={y} dy="0.32em" textAnchor="end" className="text-xs fill-current text-slate-500">
                        {value}k
                    </text>
                </g>
            ))}

            {/* X-axis labels */}
            {data.map((d, i) => (
                <text key={i} x={xScale(i) + barWidth} y={height - margin.bottom + 15} textAnchor="middle" className="text-xs fill-current text-slate-500">
                    {d.name}
                </text>
            ))}

            {/* Bars */}
            {data.map((d, i) => (
                <g key={i}>
                    <rect
                        x={xScale(i)}
                        y={yScale(d.income)}
                        width={barWidth}
                        height={height - margin.bottom - yScale(d.income)}
                        fill="#02C39A"
                        rx="2"
                    />
                    <rect
                        x={xScale(i) + barWidth}
                        y={yScale(d.expenses)}
                        width={barWidth}
                        height={height - margin.bottom - yScale(d.expenses)}
                        fill="#f87171"
                        rx="2"
                    />
                </g>
            ))}
        </svg>
    );
};
