import React, { useState, useEffect } from "react";
import { Area } from "@ant-design/charts";
import { LineConfig } from "@ant-design/charts/es/line";
import { AreaConfig } from "@ant-design/charts/es/area";
import { ColumnConfig } from "@ant-design/charts/es/column";
import { Plot, PlotEvent } from "@ant-design/charts/es/interface";

type Base = LineConfig | AreaConfig | ColumnConfig;

const PlotMaps: Record<string, Plot<Base>> = {};

let PreTooltipData: { date: string; value: number };

const Charts = (props: any) => {
  const [data, setData] = useState([]);

  let config = {
    data,
    xField: props.xField,
    yField: props.yField,
    height: 200
  };

  useEffect(() => {
    //config.xField = props.xField;
    //config.yField = props.yField;
    setData(props.data);
    console.log(config);
  }, [props.data]);

  const showTooltip = ({ x, y }: { x: number; y: number }) => {
    Object.keys(PlotMaps).forEach((plot) => {
      PlotMaps[plot].chart.showTooltip({ x, y });
    });
  };

  const setTooltipPosition = (evt: PlotEvent, plot: Plot<Base>) => {
    const { x, y } = evt.gEvent;
    const currentData = plot.chart.getTooltipItems({ x, y });
    if (currentData[0]?.data.date === PreTooltipData?.date) {
      return;
    }
    PreTooltipData = currentData[0]?.data;
    showTooltip({ x, y });
  };

  return (
    data.length > 0 && (
      <Area
        {...config}
        onReady={(plot) => {
          PlotMaps.area = plot;
          plot.on("mousemove", (evt: PlotEvent) => {
            setTooltipPosition(evt, plot);
          });
        }}
      />
    )
  );
};

export default Charts;
