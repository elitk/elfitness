import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

import { getDatesInWeekJumps } from './utils/getDatesInWeekJumps';

// components
import MenuBar from './components/MenuBar/MenuBar';
import Copyright from './components/Copyright/Copyright';
import Layout from './components/Layout/Layout';

import './App.css';

const Login = lazy(
  (): Promise<typeof import('./pages/LoginPage')> => import('./pages/LoginPage')
);
const Register = lazy(
  (): Promise<typeof import('./pages/RegisterPage')> =>
    import('./pages/RegisterPage')
);
const Goal = lazy(
  (): Promise<typeof import('./pages/GoalPage')> => import('./pages/GoalPage')
);
const Activity = lazy(
  (): Promise<typeof import('./pages/ActivityPage')> =>
    import('./pages/ActivityPage')
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface MyObject {
  weight: number;
  bmi: number;
  [key: string]: number; // index signature that accepts any string key
}

function App() {
  const [dataSet, setDataSet] = useState<string>('weight');

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'My weights',
      },
    },
  };
  const obj = [
    { weight: 79.5, bmi: 28.1 },
    { weight: 79.2, bmi: 27.8 },
    { weight: 79, bmi: 27.6 },
    { weight: 78.5, bmi: 26.1 },
    { weight: 78.7, bmi: 26.3 },
    { weight: 78.4, bmi: 26 },
    { weight: 77.8, bmi: 25.8 },
    { weight: 76.8, bmi: 25.6 },
    { weight: 76.6, bmi: 25.4 },
    { weight: 76.3, bmi: 25.1 },
  ];

  const startDate = new Date(); // Current date
  const numberOfWeeks = 10;
  const datesArray = getDatesInWeekJumps(startDate, numberOfWeeks);
  console.log(datesArray);
  console.log({ datesArray });
  const labels = datesArray;

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        // data: labels.map(() => Math.floor(Math.random() * 6)),
        data: obj.map((data: MyObject) => data[dataSet]),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      // {
      //   label: 'Dataset 2',
      //   data: labels.map(() => Math.floor(Math.random() * 6)),
      //   borderColor: 'rgb(53, 162, 235)',
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      // },
    ],
  };
  return (
    <div className="App">
      <Layout>
        <Suspense fallback={<h2>🌀 Loading...</h2>}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/goal" element={<Goal />} />
            <Route path="/activities" element={<Activity />} />
          </Routes>
        </Suspense>
      </Layout>
      <Copyright />
      {/*       
      <div style={{ height: 500, width: '100%' }}>
        <ToggleButtonGroup
          color="primary"
          value={dataSet}
          exclusive
          onChange={(event: React.MouseEvent<HTMLElement>, value: any) =>
            setDataSet(value)
          }
          aria-label="Platform"
        >
          <ToggleButton value="weight">Weight</ToggleButton>
          <ToggleButton value="bmi">Bmi</ToggleButton>
        </ToggleButtonGroup>
        <Line options={options} data={data} />
      </div> */}
    </div>
  );
}

export default App;
