import { NextResponse } from "next/server"

const API_KEY = process.env.TWELVEDATA_API_KEY

export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const symbol = searchParams.get("symbol")
	const interval = searchParams.get("interval") || "1day"

	if (!symbol) {
		return NextResponse.json({ error: "Missing symbol" }, { status: 400 })
	}

	try {
		const res = await fetch(
			`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&apikey=${API_KEY}&format=JSON`
		)
		const data = await res.json()

		if (data.status === "error") {
			return NextResponse.json({ error: data.message || "Chart fetch failed" }, { status: 500 })
		}

		return NextResponse.json(data)
	} catch (err) {
		return NextResponse.json({ error: "Failed to fetch chart" }, { status: 500 })
	}
}
