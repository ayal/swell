import moment from "moment";
import * as React from "react";
import { useEffect } from "react";
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
  key: string;
}

const windStr = (v: number) => {
  if (v > 15) {
    return '+++'
  }
  if (v > 9) {
    return ' ++'
  }
  if (v <= 9) {
    return '  +'
  }
  if (v <= 5) {
    return '  -'
  }
}

const swellStr = (v: number) => {
  if (v > 1) {
    return '+++'
  }
  if (v > 0.3) {
    return ' ++'
  }
  if (v <= 0.3) {
    return '  +'
  }
  if (v <= 0.1) {
    return ' -'
  }
}

const DayTimeData = ({ localTimestamp, wind, swell }: DayTime) => {
  const date = moment(localTimestamp * 1000).add(-3, "hours");
  const windclass = wind.speed < 10 ? "nowind" : "windy";
  const swellclass =
    swell.components.combined.height < 0.4 ? "noswell" : "swell";
  const title = `wind: ${wind.speed} / swell: ${swell.components.combined.height}`;
  return (
    <div className={`time-data ${windclass} ${swellclass}`} title={title}>
      <div>{date.format("HH:mm")}</div>
      <div>{`Wind: ${windStr(wind.speed)}`}</div>
      <div>{`Swell: ${swellStr(swell.components.combined.height)}`}</div>
    </div>
  );
};

const DayData = ({ cal, values }: DayData) => {
  return (
    <div className="day-data">
      <div>{cal}</div>
      <div className="day-times">
        {values.map((x) => {
          return <DayTimeData key={x.localTimestamp.toString()} {...x} />;
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
