import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const symbol = searchParams.get('symbol');
	let lookbackDays = Number(searchParams.get('lookbackDays') || 252);

	if (!symbol) {
		return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
	}

	const MAX_LOOKBACK = 1260; // ~5 years
	lookbackDays = Math.min(lookbackDays, MAX_LOOKBACK);

	const to = new Date();
	const from = new Date();
	from.setDate(to.getDate() - lookbackDays * 1.5); // buffer for non-trading days

	const yf = new YahooFinance();

	try {
		const result = await yf.historical(symbol, { period1: from, period2: to, interval: '1d' });

		if (!result || result.length === 0) {
			return NextResponse.json({ error: "No historical data found" }, { status: 404 });
		}

		// Only closing prices, most recent last
		const closes = result.map(item => item.close).filter(c => c != null);

		return NextResponse.json({ symbol, closes });
	} catch (err) {
		console.error("Yahoo Finance error:", err.message);
		return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 });
	}
}
