
import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
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
    const [labels, setLabels] = useState([])

    useEffect(
        () => {
            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef.current.width, minBarSpacing: 0.05,});
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
                    minBarSpacing: 0.05
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

            const newSeries = chart.addCandlestickSeries({ upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350', priceLineVisible: false, title: 'candle' });
            const volumeSeries = chart.addHistogramSeries({
                color: '#26a69a',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '', // set as an overlay by setting a blank priceScaleId
                // set the positioning of the volume series
                scaleMargins: {
                    top: 0.8, // highest point of the series will be 70% away from the top
                    bottom: 0,
                },
                title: 'volume'
            });
            volumeSeries.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.8, // highest point of the series will be 70% away from the top
                    bottom: 0,
                },
            });
            chart.subscribeCrosshairMove((param) => {
                // console.log(param)
                if (param?.time) {
                    let str = []
                    param?.seriesData?.forEach(t => {
                        delete t.time
                        delete t?.color
                        str.push(Object.entries(t)
                        .map(([key, value]) => `${key}: ${value.toFixed(2)}`)
                        .join(', '))
                    })
                    setLabels(str)
                } else {
                    setLabels([])
                }
            });
            const newSeries1 = chart.addLineSeries({ color: lineColor1, lineWidth, priceLineVisible: false });      
            newSeries1.setData([]);
            // newSeries.setData([]);
            // const newSeries2 = chart.addLineSeries({ color: lineColor2, lineWidth, priceLineVisible: false });      
            // newSeries2.setData([]);
            // const newSeries3 = chart.addLineSeries({ color: lineColor3, lineWidth, priceLineVisible: false });      
            // newSeries3.setData([]);
            // const newSeries4 = chart.addLineSeries({ color: lineColor4, lineWidth, priceLineVisible: false });      
            // newSeries4.setData([]);
            // const newSeries5 = chart.addLineSeries({ color: lineColor5, lineWidth, priceLineVisible: false });      
            // newSeries5.setData([]);

            socket.addEventListener('message', (event) => {
                let data = JSON.parse(event.data) 
                if(data?.candle){
                    newSeries.setData(data.candle)
                }
                if(data?.line1){
                    newSeries1.update(data?.line1)
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
                if(data?.xline){
                    setTimeout(() =>{
                        for(let i = 0; i < data?.xline.length; i++) {
                            let newSeriesLine = chart.addLineSeries({ color: data?.xline[i].color, lineWidth, priceLineVisible: false });      
                        newSeriesLine.setData(data?.xline[i].data);
                        }
                    }, 30000)
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
        <>
            <div
                style={{ height: "100vh"}}
                ref={chartContainerRef}
            />
            <div style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    zIndex: 1,
                    width: '100%',
                    textAlign: 'left'
                }}>
                    {labels.length > 0 && labels?.map((item, index) => (
                        <div className='w-full text-sm' key={index}>{item}</div>
                    ))}
                </div>
        </>
    );
};


