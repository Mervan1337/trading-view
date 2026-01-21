import { NextResponse } from "next/server"

const API_KEY = process.env.FINNHUB_API_KEY

export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const symbol = searchParams.get("symbol")

	if (!symbol) {
		return NextResponse.json({ error: "Missing symbol" }, { status: 400 })
	}

	try {
		// Parallel requests
		const [quoteRes, profileRes, metricsRes, targetRes] = await Promise.all([
			fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`),
			fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`),
			fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${API_KEY}`),
			fetch(`https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${API_KEY}`)
		])

		const quote = await quoteRes.json()
		const profile = await profileRes.json()
		const metrics = await metricsRes.json()
		const target = await targetRes.json()

		if (!quote || quote.c === 0) {
			return NextResponse.json({ error: "Invalid symbol" }, { status: 404 })
		}

		return NextResponse.json({
			symbol,
			name: profile.name || symbol,
			exchange: profile.exchange || "Unknown",
			industry: profile.finnhubIndustry || "Unknown",
			website: profile.weburl || "N/A",
			ceo: profile.ceo || "N/A",
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
			priceTarget: target.targetMean || null
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
	}
}
