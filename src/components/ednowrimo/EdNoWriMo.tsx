import { ChangeEvent, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import classNames from "classnames";
import { GetUserDataService } from "../../services/GetUserDataService";
import threeStreak from "../../assets/ednowrimo/3 streak.png";
import fiveStreak from "../../assets/ednowrimo/5 streak.png";
import fifteenStreak from "../../assets/ednowrimo/15 streak.png";
import fullStreak from "../../assets/ednowrimo/Full streak.png";
import fivekwords from "../../assets/ednowrimo/5k words.png";
import tenkwords from "../../assets/ednowrimo/10k words.png";
import twentyfivekwords from "../../assets/ednowrimo/25k words.png";
import fiftykwords from "../../assets/ednowrimo/50k words.png";
import firstwords from "../../assets/ednowrimo/First Words.png";

function EdNoWriMo() {
  const getUserDataService = new GetUserDataService();
  const userData = getUserDataService.getUserData();
  const currentDay = new Date().getDate();
  const [dailyInput, setDailyInput] = useState(userData.dailyInputs);
  const [target, setTarget] = useState(userData.target);
  const [dailyTarget, setDailyTarget] = useState(target / 30);
  const maxNumber = () => {
    return (
      dailyInput.reduce((a: number | null, b: number | null) =>
        Math.max(a ?? 0, b ?? 0)
      ) ?? 0
    );
  };
  const currentMax = userData.maxWords;
  const [currentDaily, setCurrentDaily] = useState(currentMax / currentDay);

  const data = dailyInput.map((value: number | null, index: number) => ({
    name: index,
    Target: dailyTarget * index,
    Actual: value,
    Projection: currentDaily * index,
  }));

  const updateTarget = (e: ChangeEvent<HTMLInputElement>) => {
    setTarget(e.currentTarget.valueAsNumber);
    setDailyTarget(e.currentTarget.valueAsNumber / 30);
  };

  const updateProgress = (index: number, value: number) => {
    const dailyArray = dailyInput;
    if (value < maxNumber()) {
      value = maxNumber();
    }
    dailyArray[index] = value;
    setDailyInput(dailyArray);
    setDailyTrend();
  };

  const setDailyTrend = () => {
    const value = maxNumber();
    setCurrentDaily(value / currentDay);
  };

  return (
    <div className="App">
      <div className="endowrimo-page">
        <LineChart width={900} height={450} data={data}>
          <XAxis dataKey="name" interval={0} tickLine={false} />
          <YAxis tickCount={6} />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="Target" stroke="#8884d8" />
          <Line type="monotone" dataKey="Actual" stroke="#82ca9d" />
          <Line
            type="monotone"
            dataKey="Projection"
            stroke="#82ca9d50"
            strokeDasharray={11}
            dot={false}
          />
        </LineChart>
        <div>
          <h3>Your Target</h3>
          <input type="number" placeholder="50000" onChange={updateTarget} />
        </div>
        <div>
          <h3 className="progress-header">Your Progress</h3>
          {dailyInput.map((element: number | null, index: number) => {
            if (index > 0) {
              return (
                <div
                  key={index}
                  className={classNames(
                    "day-input",
                    currentDay === index ? "today" : "",
                    index < currentDay ? "past" : ""
                  )}
                >
                  <h4>Day {index}</h4>
                  <input
                    type="number"
                    placeholder={(element ?? currentMax).toString()}
                    disabled={currentDay < index || currentDay > index}
                    onChange={(event) =>
                      updateProgress(index, event.target.valueAsNumber)
                    }
                  />
                </div>
              );
            } else return null;
          })}
        </div>
        <div className="awards">
          <h3>Your Awards</h3>
          {userData.maxWords > 0 && <img alt="first words" src={firstwords} />}
          {userData.maxStreak > 3 && (
            <img alt="three streak" src={threeStreak} />
          )}
          {userData.maxStreak > 5 && <img alt="five streak" src={fiveStreak} />}
          {userData.maxStreak > 15 && (
            <img alt="fifteen streak" src={fifteenStreak} />
          )}
          {userData.maxStreak > 29 && (
            <img alt="full streak" src={fullStreak} />
          )}
          {userData.maxWords > 5000 && (
            <img alt="5k words written" src={fivekwords} />
          )}
          {userData.maxWords > 10000 && (
            <img alt="10k words written" src={tenkwords} />
          )}
          {userData.maxWords > 25000 && (
            <img alt="25k words written" src={twentyfivekwords} />
          )}
          {userData.maxWords > 49000 && (
            <img alt="50k words written" src={fiftykwords} />
          )}
        </div>
      </div>
    </div>
  );
}

export default EdNoWriMo;
