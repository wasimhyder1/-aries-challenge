/*
Design & Develop By!
WasimHyder (Full Stack Developer)
+971 56 9395634
wasimhyder.com
*/

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

const OptionsGraph = () => {
  const [options, setOptions] = useState([
    { type: 'call', strike: '', premium: '', quantity: 1 }
  ]);
  const [graphData, setGraphData] = useState({ prices: [], payoffs: [] });
  const [summary, setSummary] = useState({ maxProfit: null, maxLoss: null, breakEvenPoints: [] });

  const handleChange = (index, field, value) => {
    const updatedOptions = options.map((option, i) => (i === index ? { ...option, [field]: value } : option));
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, { type: 'call', strike: 100, premium: 10, quantity: 1 }]);
    }
  };

  const calculatePayoff = (price) => {
    return options.reduce((total, option) => {
      const { type, strike, premium, quantity } = option;
      const intrinsicValue = type === 'call' ? Math.max(0, price - strike) : Math.max(0, strike - price);
      return total + quantity * (intrinsicValue - premium);
    }, 0);
  };

  const calculateData = () => {
    const prices = [];
    const payoffs = [];
    for (let i = 0; i <= 200; i += 1) {
      prices.push(i);
      payoffs.push(calculatePayoff(i));
    }
    return { prices, payoffs };
  };

  const calculateSummary = (payoffs) => {
    const maxProfit = Math.max(...payoffs);
    const maxLoss = Math.min(...payoffs);
    const breakEvenPoints = [];

    for (let i = 1; i < payoffs.length; i++) {
      if ((payoffs[i - 1] < 0 && payoffs[i] >= 0) || (payoffs[i - 1] >= 0 && payoffs[i] < 0)) {
        breakEvenPoints.push(i);
      }
    }

    return { maxProfit, maxLoss, breakEvenPoints };
  };

  useEffect(() => {
    const { prices, payoffs } = calculateData();
    setGraphData({ prices, payoffs });
    setSummary(calculateSummary(payoffs));
  }, [options]);

  const data = {
    labels: graphData.prices,
    datasets: [
      {
        label: 'Risk & Reward Graph',
        data: graphData.payoffs,
        borderColor: 'rgba(255, 0, 0, 1)',
        fill: false,
      },
    ],
  };

  const optionsConfig = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Stock Price at Expiration',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Profit/Loss',
        },
      },
    },
  };

  return (
    <div>
      <h2>Options Strategy Risk & Reward Graph</h2>
      {options.map((option, index) => (
        <div key={index}>
          <label>Type:</label>
          <select value={option.type} onChange={(e) => handleChange(index, 'type', e.target.value)}>
            <option value="call">Call</option>
            <option value="put">Put</option>
          </select>
          <label>Strike Price:</label>
          <input
            type="number"
            value={option.strike}
            onChange={(e) => handleChange(index, 'strike', Number(e.target.value))}
          />
          <label>Premium:</label>
          <input
            type="number"
            value={option.premium}
            onChange={(e) => handleChange(index, 'premium', Number(e.target.value))}
          />
          <label>Quantity:</label>
          <input
            type="number"
            value={option.quantity}
            onChange={(e) => handleChange(index, 'quantity', Number(e.target.value))}
          />
        </div>
      ))}
      <button onClick={addOption}>Add Option</button>
      <Line data={data} options={optionsConfig} />
      <div>
        <h3>Summary</h3>
        <p>Max Profit: {summary.maxProfit}</p>
        <p>Max Loss: {summary.maxLoss}</p>
        <p>Break Even Points: {summary.breakEvenPoints.join(', ')}</p>
      </div>
    </div>
  );
};

export default OptionsGraph;
