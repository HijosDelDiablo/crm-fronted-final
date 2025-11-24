import { createChart, LineSeries } from 'lightweight-charts';
import { useRef, useEffect } from 'react';

const Graphic = ({data, width = 400, height = 300}) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Crear el chart solo una vez
        chartRef.current = createChart(chartContainerRef.current, {
            width: width,
            height: height,
             layout: {
        background: { color: '#131722' },    // Fondo oscuro TradingView
        textColor: '#D9D9D9',                // Texto claro
    },
    grid: {
        vertLines: {
            color: 'rgba(42, 46, 57, 0.5)',  // Líneas verticales suaves
        },
        horzLines: {
            color: 'rgba(42, 46, 57, 0.5)',  // Líneas horizontales suaves
        },
    },
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

        const lineSeries = chartRef.current.addSeries(LineSeries);
        lineSeries.setData(data);

            chartRef.current.timeScale().fitContent();

        return () => {
            // limpiar chart al desmontar
            chartRef.current.remove();
        };
    }, []);

    return (
        <>
            <div 
                ref={chartContainerRef} 
                style={{ width: '400px', height: '300px' }}
            />
        </>
    );
};

export default Graphic;
