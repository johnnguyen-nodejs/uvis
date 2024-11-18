
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
                chart.applyOptions({ width: chartContainerRef.current.width, minBarSpacing: 0.5,});
            };

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                width: chartContainerRef.current.width,
                height: chartContainerRef.current.height,
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
            const volumeSeries = chart.addHistogramSeries({
                color: '#26a69a',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '', // set as an overlay by setting a blank priceScaleId
                // set the positioning of the volume series
                scaleMargins: {
                    top: 0.3, // highest point of the series will be 70% away from the top
                    bottom: 0,
                },
            });
            volumeSeries.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.3, // highest point of the series will be 70% away from the top
                    bottom: 0,
                },
            });
            chart.subscribeCrosshairMove((param) => {
                if (param.time) {
                    const priceData = param.seriesPrices.get(lineSeries);
    
                    // Display information about the current time
                    infoBox.textContent = `Time: ${param.time}, Value: ${priceData}`;
                    infoBox.style.visibility = 'visible';
                } else {
                    infoBox.textContent = 'Hover over the chart to see data...';
                    infoBox.style.visibility = 'hidden';
                }
            });
            // const newSeries1 = chart.addLineSeries({ color: lineColor1, lineWidth, priceLineVisible: false });      
            // newSeries1.setData([]);
            // const newSeries2 = chart.addLineSeries({ color: lineColor2, lineWidth, priceLineVisible: false });      
            // newSeries2.setData([]);
            // const newSeries3 = chart.addLineSeries({ color: lineColor3, lineWidth, priceLineVisible: false });      
            // newSeries3.setData([]);
            // const newSeries4 = chart.addLineSeries({ color: lineColor4, lineWidth, priceLineVisible: false });      
            // newSeries4.setData([]);
            // const newSeries5 = chart.addLineSeries({ color: lineColor5, lineWidth, priceLineVisible: false });      
            // newSeries5.setData([]);
            socket.close()
            socket = new WebSocket('ws://localhost:8080');
            socket.addEventListener('message', (event) => {
                let data = JSON.parse(event.data) 
                if(data?.candle){
                    newSeries.setData(data.candle)
                }
                if(data?.volume){
                    volumeSeries.setData(data.volume);
                }
                if(data?.line){
                    for(let i = 0; i < data?.line.length; i++){
                        let newSeriesLine = chart.addLineSeries({ color: data?.line[i].color, lineWidth, priceLineVisible: false });      
                        newSeriesLine.setData(data?.line[i].data);
                    }
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
            style={{ height: "100vh"}}
            ref={chartContainerRef}
        />
    );
};


