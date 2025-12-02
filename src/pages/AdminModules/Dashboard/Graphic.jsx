import { createChart, AreaSeries } from 'lightweight-charts';
import { useRef, useEffect } from 'react';

const Graphic = ({ data, colors: {
    backgroundColor = '#131722',
    lineColor = '#2962FF',
    textColor = '#D9D9D9',
    areaTopColor = '#2962FF',
    areaBottomColor = 'rgba(41, 98, 255, 0.28)',
} = {} }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            }
        };

        chartRef.current = createChart(chartContainerRef.current, {
            layout: {
                background: { color: backgroundColor },
                textColor: textColor,
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
                horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            crosshair: {
                mode: 1,
                vertLine: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    width: 1,
                    style: 0,
                    labelBackgroundColor: '#131722'
                },
                horzLine: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    width: 1,
                    style: 0,
                    labelBackgroundColor: '#131722'
                }
            },
            timeScale: {
                borderColor: 'rgba(197, 203, 206, 0.4)',
            },
            rightPriceScale: {
                borderColor: 'rgba(197, 203, 206, 0.4)',
            }
        });

        chartRef.current.timeScale().fitContent();

        const newSeries = chartRef.current.addSeries(AreaSeries, { 
            lineColor, 
            topColor: areaTopColor, 
            bottomColor: areaBottomColor 
        });
        newSeries.setData(data);

        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            chartRef.current.remove();
        };
    }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    return (
        <div
            ref={chartContainerRef}
            style={{ width: '100%', height: '100%', minHeight: '300px' }}
        />
    );
};

export default Graphic;
