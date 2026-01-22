import { NextResponse } from "next/server"

const API_KEY = process.env.FINNHUB_API_KEY

async function safeFetch(url) {
	const res = await fetch(url)
	if (!res.ok) {
		// Try to get JSON error if available, otherwise fallback to status text
		let text
		try {
			text = await res.text()
			const data = JSON.parse(text)
			throw new Error(data.error || text)
		} catch {
			throw new Error(res.statusText || "Unknown fetch error")
		}
	}
	return res.json()
}

export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const symbol = searchParams.get("symbol")
	const query = searchParams.get("query")

	if (query) {
		try {
			const data = await safeFetch(
				`https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`
			)
			return NextResponse.json(data.result ? data.result.slice(0, 10) : [])
		} catch (err) {
			return NextResponse.json({ error: "Search failed: " + err.message }, { status: 500 })
		}
	}

	if (!symbol) {
		return NextResponse.json({ error: "Missing symbol or query" }, { status: 400 })
	}

	try {
		const [quote, profile, metrics, target] = await Promise.all([
			safeFetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`),
			safeFetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`),
			safeFetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${API_KEY}`),
			safeFetch(`https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${API_KEY}`)
		])

		if (!quote || quote.c === 0) {
			return NextResponse.json({ error: "Invalid symbol or no quote data" }, { status: 404 })
		}

		return NextResponse.json({
			symbol,
			name: profile.name || symbol,
			exchange: profile.exchange || "Unknown",
			industry: profile.finnhubIndustry || "Unknown",
			website: profile.weburl || "N/A",
			country: profile.country || "N/A",
			logo: profile.logo || "",
			price: quote.c,
			changePercent: quote.dp,
			open: quote.o,
			high: quote.h,
			low: quote.l,
			prevClose: quote.pc,
			volume: quote.v,
			week52High: metrics.metric?.["52WeekHigh"] || null,
			week52Low: metrics.metric?.["52WeekLow"] || null,
			marketCap: metrics.metric?.marketCapitalization || null,
			peRatio: metrics.metric?.peNormalizedAnnual || null,
			eps: metrics.metric?.epsNormalizedAnnual || null,
			dividendYield: metrics.metric?.dividendYieldIndicatedAnnual || null,
			beta: metrics.metric?.beta || null,
		})
	} catch (err) {
		console.error("Stock fetch failed:", err)
		return NextResponse.json({ error: "Failed to fetch stock data: " + err.message }, { status: 500 })
	}
}
