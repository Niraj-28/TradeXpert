import {
  createChart,
} from "lightweight-charts";

import {
  useEffect,
  useRef,
} from "react";

import useCandleStore from "../../store/candleStore";

const TradingChart = () => {
  const chartContainerRef =
    useRef(null);

  const chartRef =
    useRef(null);

  const candleSeriesRef =
    useRef(null);

  const candles =
    useCandleStore(
      (state) => state.candles
    );

  useEffect(() => {
    const chart = createChart(
      chartContainerRef.current,
      {
        width:
          chartContainerRef.current
            .clientWidth,

        height: 450,

        layout: {
          background: {
            color: "#18181B",
          },

          textColor: "#A1A1AA",
        },

        grid: {
          vertLines: {
            color: "#27272A",
          },

          horzLines: {
            color: "#27272A",
          },
        },

        crosshair: {
          mode: 1,
        },

        rightPriceScale: {
          borderColor: "#3F3F46",
        },

        timeScale: {
          borderColor: "#3F3F46",
        },
      }
    );

    chartRef.current = chart;

    const candleSeries =
      chart.addCandlestickSeries({
        upColor: "#22C55E",

        downColor: "#EF4444",

        borderVisible: false,

        wickUpColor: "#22C55E",

        wickDownColor:
          "#EF4444",
      });

    candleSeriesRef.current =
      candleSeries;

    candleSeries.setData(
      candles
    );

    const handleResize = () => {
      chart.applyOptions({
        width:
          chartContainerRef.current
            .clientWidth,
      });
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (
      candleSeriesRef.current
    ) {
      candleSeriesRef.current.setData(
        candles
      );
    }
  }, [candles]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full"
    />
  );
};

export default TradingChart;