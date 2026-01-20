import { NextResponse } from "next/server";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const symbol = searchParams.get("symbol");

	if (!symbol) {
		return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
	}

	try {
		const res = await fetch(
			`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
		);

		if (!res.ok) {
			throw new Error("API error");
		}

		const data = await res.json();
		return NextResponse.json(data);
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
