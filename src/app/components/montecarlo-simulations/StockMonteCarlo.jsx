"use client";
import { useState } from 'react';
import { runMonteCarlo } from './monteCarloEngine';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function StockMonteCarlo() {
	const [ticker, setTicker] = useState('');
	const [investment, setInvestment] = useState(1000);
	const [lookback, setLookback] = useState(252);
	const [horizon, setHorizon] = useState(30);
	const [iterations, setIterations] = useState(1000);
	const [mode, setMode] = useState('random');
	const [seed, setSeed] = useState(12345);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [logReturns, setLogReturns] = useState([]);
	const [result, setResult] = useState(null);

	const MAX_LOOKBACK = 1260;

	async function handleFetchHistory() {
		if (!ticker) return setError("Ticker cannot be empty");
		setLoading(true);
		setError(null);
		setLogReturns([]);
		setResult(null);

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

	function handleRun() {
		if (!logReturns || logReturns.length === 0) return;

		const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
		const variance = logReturns.reduce((a, b) => a + (b - mean) ** 2, 0) / (logReturns.length - 1);
		const std = Math.sqrt(variance);

		const engineResult = runMonteCarlo({
			meanDailyReturn: mean,
			dailyVolatility: std,
			horizonDays: horizon,
			iterations,
			initialValue: investment,
			seed: mode === 'deterministic' ? seed : null
		});

		setResult(engineResult);
	}

	return (
		<div className="p-4 max-w-3xl mx-auto space-y-4 bg-gray-900 text-white rounded-lg border border-gray-700">
			<h2 className="text-xl font-bold">Monte Carlo Stock Simulator</h2>

			<div className="space-y-2">
				<label>Ticker (e.g., AAPL)</label>
				<input className="border border-gray-600 bg-gray-800 text-white p-1 w-full rounded" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} />
				<label>Lookback Days (historical trading days for daily returns)</label>
				<input className="border border-gray-600 bg-gray-800 text-white p-1 w-full rounded" type="number" value={lookback} onChange={e => setLookback(Number(e.target.value))} />
				<label>Total Investment ($)</label>
				<input className="border border-gray-600 bg-gray-800 text-white p-1 w-full rounded" type="number" value={investment} onChange={e => setInvestment(Number(e.target.value))} />
				<label>Horizon Days (days to simulate into future)</label>
				<input className="border border-gray-600 bg-gray-800 text-white p-1 w-full rounded" type="number" value={horizon} onChange={e => setHorizon(Number(e.target.value))} />
				<label>Iterations (number of paths)</label>
				<input className="border border-gray-600 bg-gray-800 text-white p-1 w-full rounded" type="number" value={iterations} onChange={e => setIterations(Number(e.target.value))} />
				<label>Mode</label>
				<select className="border border-gray-600 bg-gray-800 text-white p-1 w-full rounded" value={mode} onChange={e => setMode(e.target.value)}>
					<option value="random">Random</option>
					<option value="deterministic">Deterministic (seeded)</option>
				</select>
				{mode === 'deterministic' && <input className="border border-gray-600 bg-gray-800 text-white p-1 w-full rounded" type="number" placeholder="Seed" value={seed} onChange={e => setSeed(Number(e.target.value))} />}
				<div className="flex space-x-2 mt-2">
					<button className="bg-blue-500 text-white px-2 py-1 flex-1 rounded" onClick={handleFetchHistory} disabled={loading}>Fetch Historical Data</button>
					<button className="bg-green-500 text-white px-2 py-1 flex-1 rounded" onClick={handleRun} disabled={loading || logReturns.length === 0}>Run Simulation</button>
				</div>
			</div>

			{loading && <p>Loading historical data...</p>}
			{error && <p className="text-red-500">{error}</p>}

			{result && (
				<div className="space-y-2 border-t border-gray-700 pt-2">
					<h3 className="font-semibold text-lg">Simulation Summary</h3>
					<p>Median final value: {result.summary.median.toFixed(2)}</p>
					<p>5th percentile: {result.summary.p5.toFixed(2)}</p>
					<p>95th percentile: {result.summary.p95.toFixed(2)}</p>
					<p>Probability of loss: {(result.summary.probLoss*100).toFixed(1)}%</p>
					<p>Probability of gain: {(result.summary.probGain*100).toFixed(1)}%</p>
				</div>
			)}

			{result && result.dailyPercentiles && (
				<div className="border-t border-gray-700 pt-2">
					<h3 className="font-semibold text-lg">Simulation Paths with 5–95% Band</h3>
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart data={result.dailyPercentiles}>
							<XAxis dataKey="day" tick={{ fill: 'white', fontSize: 12 }} />
							<YAxis tick={{ fill: 'white', fontSize: 12 }} />
							<Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: 'white' }} />
							<Area type="monotone" dataKey="p95" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
							<Area type="monotone" dataKey="p5" stroke="#3b82f6" fill="#1f2937" fillOpacity={0.4} />
							<Line type="monotone" dataKey="median" stroke="#facc15" dot={false} />
						</AreaChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
}
