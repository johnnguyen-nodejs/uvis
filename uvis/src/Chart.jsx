
import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
let socket = new WebSocket('ws://localhost:8080');

export const ChartComponent = props => {
    const {
        colors: {
            backgroundColor = '#222222',
            lineColor1 = '#2962FF',
            lineColor2 = '#32a852',
            lineColor3 = '#32a89c',
            lineColor4 = '#a8325d',
            lineColor5 = '#9aa832',
            lineWidth = 1,
            textColor = 'white',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(
        () => {
            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef.current.width });
            };

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                width: chartContainerRef.current.width,
                height: 800,
                timeScale: {
                    timeVisible: true,        // Show time on the axis
                    secondsVisible: true,     // Include seconds in the time axis
                },
                grid: {
                    vertLines: {
                        color: '#4444445e',      // Custom color for vertical grid lines
                    },
                    horzLines: {
                        color: '#4444445e',      // Custom color for horizontal grid lines
                    },
                },
                crosshair: {
                    mode: 0,
                }
            });
            chart.timeScale().fitContent();

            const newSeries = chart.addCandlestickSeries({ upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350', priceLineVisible: false });
            newSeries.setData([]);
            
            const newSeries1 = chart.addLineSeries({ color: lineColor1, lineWidth, priceLineVisible: false });      
            newSeries1.setData([]);
            const newSeries2 = chart.addLineSeries({ color: lineColor2, lineWidth, priceLineVisible: false });      
            newSeries2.setData([]);
            const newSeries3 = chart.addLineSeries({ color: lineColor3, lineWidth, priceLineVisible: false });      
            newSeries3.setData([]);
            const newSeries4 = chart.addLineSeries({ color: lineColor4, lineWidth, priceLineVisible: false });      
            newSeries4.setData([]);
            const newSeries5 = chart.addLineSeries({ color: lineColor5, lineWidth, priceLineVisible: false });      
            newSeries5.setData([]);
            socket.close()
            socket = new WebSocket('ws://localhost:8080');
            socket.addEventListener('message', (event) => {
                let data = JSON.parse(event.data) 
                if(data?.candle){
                    newSeries.update(data.candle)
                }
                if(data?.line1){
                    newSeries1.update(data?.line1)
                }
                if(data?.line2){
                    newSeries2.update(data?.line2)
                }
                if(data?.line3){
                    newSeries3.update(data?.line3)
                }
                if(data?.line4){
                    newSeries4.update(data?.line4)
                }
                if(data?.line5){
                    newSeries5.update(data?.line5)
                }
                if(data?.markers){
                    newSeries.setMarkers(data?.markers)
                }
            })

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);

                chart.remove();
            };
        },
        [backgroundColor, textColor, areaTopColor, areaBottomColor]
    );
    
    return (
        <div
            ref={chartContainerRef}
        />
    );
};


