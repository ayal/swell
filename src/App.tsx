import moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import "./styles.css";

interface IWind {
  speed: number;
}

interface ICombined {
  height: number;
}

interface IComponents {
  combined: ICombined;
}

interface ISwell {
  components: IComponents;
}

interface DayTime {
  localTimestamp: number;
  wind: IWind;
  swell: ISwell;
}

interface DayData {
  cal: string;
  values: DayTime[];
}

const DayTimeData = ({ localTimestamp, wind, swell }: DayTime) => {
  const date = moment(localTimestamp * 1000).add(-3, "hours");
  const windclass = wind.speed < 10 ? "nowind" : "windy";
  const swellclass =
    swell.components.combined.height < 0.4 ? "noswell" : "swell";
  return (
    <div className={`time-data ${windclass} ${swellclass}`}>
      <div>{date.format("HH:mm")}</div>
      <div>Wind: {wind.speed.toString().padStart(2, "0")}</div>
      <div>Swell: {swell.components.combined.height.toFixed(1)}</div>
    </div>
  );
};

const DayData = ({ cal, values }: DayData) => {
  return (
    <div className="day-data">
      <div>{cal}</div>
      <div className="day-times">
        {values.map((x) => {
          return <DayTimeData {...x} />;
        })}
      </div>
    </div>
  );
};

export default function App() {
  const [data, setData] = React.useState<DayData[]>([]);
  
  useEffect(() => {
    const load = async () => {
      const res = await fetch("https://plattta.com/_functions/forecast");
      const json = await res.json();
      setData(json);
    };
    load();
  }, []);

  return (
    <div className="App">
      {data?.map((x) => {
        return <DayData {...x} />;
      })}
    </div>
  );
}
