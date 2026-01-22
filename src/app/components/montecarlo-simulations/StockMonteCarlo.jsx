"use client";

import { useState } from "react";
import { runMonteCarlo } from "./monteCarloEngine";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export default function StockMonteCarloExplorer() {
	const [ticker, setTicker] = useState("");
	const [investment, setInvestment] = useState(1000);
	const [lookback, setLookback] = useState(252);
	const [horizon, setHorizon] = useState(30);
	const [iterations, setIterations] = useState(1000);
	const [mode, setMode] = useState("random");
	const [seed, setSeed] = useState(12345);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [logReturns, setLogReturns] = useState([]);
	const [simulationResult, setSimulationResult] = useState(null);
	const [sliderHorizon, setSliderHorizon] = useState(30);

	const MAX_LOOKBACK = 1260;

	async function fetchHistory() {
		if (!ticker) return setError("Ticker cannot be empty");
		setLoading(true);
		setError(null);
		setLogReturns([]);
		setSimulationResult(null);

		const days = Math.min(lookback, MAX_LOOKBACK);

		try {
			const res = await fetch(`/api/stock/history?symbol=${ticker}&lookbackDays=${days}`);
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			if (!data.closes || data.closes.length < 2) throw new Error("Not enough historical data");

			const returns = [];
			const closes = data.closes;
			for (let i = 1; i < closes.length; i++) {
				returns.push(Math.log(closes[i] / closes[i - 1]));
			}
			setLogReturns(returns);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	function runSimulation() {
		if (!logReturns || logReturns.length === 0) return;

		const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
		const variance = logReturns.reduce((a, b) => a + (b - mean) ** 2, 0) / (logReturns.length - 1);
		const std = Math.sqrt(variance);

		const result = runMonteCarlo({
			meanDailyReturn: mean,
			dailyVolatility: std,
			horizonDays: horizon,
			iterations,
			initialValue: investment,
			seed: mode === "deterministic" ? seed : null
		});

		setSimulationResult(result);
		setSliderHorizon(horizon);
	}

	return (
		<div className="p-6 max-w-3xl mx-auto space-y-6 bg-gray-900 text-white rounded-lg">
			<h2 className="text-2xl font-bold">Monte Carlo Stock Explorer</h2>

			{/* Input Form */}
			<div className="space-y-3">
				<div>
					<label className="block mb-1">Ticker (e.g., AAPL)</label>
					<input className="border p-1 w-full bg-gray-800 text-white" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} />
				</div>
				<div>
					<label className="block mb-1">Lookback Days (for historical daily returns)</label>
					<input className="border p-1 w-full bg-gray-800 text-white" type="number" value={lookback} onChange={e => setLookback(Number(e.target.value))} />
				</div>
				<div>
					<label className="block mb-1">Total Investment ($)</label>
					<input className="border p-1 w-full bg-gray-800 text-white" type="number" value={investment} onChange={e => setInvestment(Number(e.target.value))} />
				</div>
				<div>
					<label className="block mb-1">Horizon Days (simulate into future)</label>
					<input className="border p-1 w-full bg-gray-800 text-white" type="number" value={horizon} onChange={e => setHorizon(Number(e.target.value))} />
				</div>
				<div>
					<label className="block mb-1">Iterations (number of paths)</label>
					<input className="border p-1 w-full bg-gray-800 text-white" type="number" value={iterations} onChange={e => setIterations(Number(e.target.value))} />
				</div>
				<div>
					<label className="block mb-1">Mode</label>
					<select className="border p-1 w-full bg-gray-800 text-white" value={mode} onChange={e => setMode(e.target.value)}>
						<option value="random">Random</option>
						<option value="deterministic">Deterministic (seeded)</option>
					</select>
					{mode === "deterministic" && (
						<input className="border p-1 w-full mt-1 bg-gray-800 text-white" type="number" placeholder="Seed" value={seed} onChange={e => setSeed(Number(e.target.value))} />
					)}
				</div>

				<div className="flex space-x-2">
					<button className="bg-blue-500 text-white px-3 py-1 flex-1" onClick={fetchHistory} disabled={loading}>Fetch History</button>
					<button className="bg-green-500 text-white px-3 py-1 flex-1" onClick={runSimulation} disabled={loading || logReturns.length === 0}>Run Simulation</button>
				</div>
			</div>

			{loading && <p>Loading historical data...</p>}
			{error && <p className="text-red-500">{error}</p>}

			{/* Simulation Summary */}
			{simulationResult && (
				<div className="space-y-2 border-t pt-2">
					<h3 className="font-semibold text-lg">Simulation Summary</h3>
					<p>Median final value: {simulationResult.summary.median.toFixed(2)}</p>
					<p>5th percentile: {simulationResult.summary.p5.toFixed(2)}</p>
					<p>95th percentile: {simulationResult.summary.p95.toFixed(2)}</p>
					<p>Probability of loss: {(simulationResult.summary.probLoss * 100).toFixed(1)}%</p>
					<p>Probability of gain: {(simulationResult.summary.probGain * 100).toFixed(1)}%</p>
				</div>
			)}

			{/* Interactive Chart */}
			{simulationResult && simulationResult.dailyPercentiles && (
				<div className="border-t pt-2">
					<h3 className="font-semibold text-lg">Simulation Explorer</h3>
					<input
						type="range"
						min="1"
						max={horizon}
						value={sliderHorizon}
						onChange={e => setSliderHorizon(Number(e.target.value))}
						className="w-full"
					/>
					<p>Horizon: {sliderHorizon} days</p>
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart data={simulationResult.dailyPercentiles.slice(0, sliderHorizon)}>
							<XAxis dataKey="day" label={{ value: "Day", position: "insideBottom", fill: 'white' }} tick={{ fill: 'white', fontSize: 10 }} />
							<YAxis label={{ value: "Portfolio Value ($)", angle: -90, position: "insideLeft", fill: 'white' }} tick={{ fill: 'white', fontSize: 10 }} />
							<Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: 'white' }} />
							<Area type="monotone" dataKey="p95" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />
							<Area type="monotone" dataKey="p5" stroke="#dc2626" fill="#dc2626" fillOpacity={0.2} />
							<Line type="monotone" dataKey="median" stroke="#facc15" dot={false} strokeWidth={2} />
						</AreaChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
}
