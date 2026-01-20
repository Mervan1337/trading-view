"use client"

import { useState } from "react"
import InputField from "../../../components/ui/InputField"

export default function KellyCalculator() {
	const [probability, setProbability] = useState("")
	const [odds, setOdds] = useState("")
	const [kellyType, setKellyType] = useState("full")
	const [result, setResult] = useState(null)
	const [error, setError] = useState(null)

	function normalizeNumber(value) {
		return Number(value.replace(",", "."))
	}

	function getKellyMultiplier() {
		if (kellyType === "half") return 0.5
		if (kellyType === "quarter") return 0.25
		return 1
	}

	function calculateKelly() {
		setError(null)
		setResult(null)

		const pInput = normalizeNumber(probability)
		const o = normalizeNumber(odds)

		if (isNaN(pInput) || isNaN(o)) {
			setError("Please enter numeric values")
			return
		}

		const p = pInput > 1 ? pInput / 100 : pInput

		if (p <= 0 || p >= 1) {
			setError("Probability must be between 0 and 1 or 0 and 100")
			return
		}

		if (o <= 1) {
			setError("Decimal odds must be greater than 1.0")
			return
		}

		const b = o - 1
		const q = 1 - p
		const kelly = (b * p - q) / b

		if (kelly <= 0) {
			setError("Negative Kelly value. No bet recommended")
			return
		}

		const adjustedKelly = kelly * getKellyMultiplier()

		setResult((adjustedKelly * 100).toFixed(2))
	}

	return (
		<div className="max-w-md p-6 bg-gray-800 rounded-xl shadow-lg">
			<h2 className="text-xl font-semibold text-white mb-4">
				Kelly Criterion Calculator
			</h2>

			<div className="flex flex-col gap-4">
				<InputField
					label="Win probability"
					value={probability}
					onChange={(e) => setProbability(e.target.value)}
					placeholder="0.84 or 84"
					tooltip="Probability of winning. Enter a decimal or a percentage."
				/>

				<InputField
					label="Decimal odds"
					value={odds}
					onChange={(e) => setOdds(e.target.value)}
					placeholder="1.25"
					tooltip="Decimal odds including stake. Must be greater than 1.0."
				/>

				<div className="flex flex-col gap-1">
					<span className="text-sm text-gray-300">
						Kelly strategy
					</span>

					<div className="flex gap-2">
						<button
							onClick={() => setKellyType("full")}
							className={`px-3 py-2 rounded text-sm ${
								kellyType === "full"
									? "bg-blue-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							Full
						</button>

						<button
							onClick={() => setKellyType("half")}
							className={`px-3 py-2 rounded text-sm ${
								kellyType === "half"
									? "bg-blue-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							Half
						</button>

						<button
							onClick={() => setKellyType("quarter")}
							className={`px-3 py-2 rounded text-sm ${
								kellyType === "quarter"
									? "bg-blue-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							Quarter
						</button>
					</div>
				</div>

				<button
					onClick={calculateKelly}
					className="mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
				>
					Calculate
				</button>

				{result && (
					<div className="text-green-400 text-sm">
						Recommended stake ({kellyType} Kelly):{" "}
						<strong>{result}%</strong> of bankroll
					</div>
				)}

				{error && (
					<div className="text-red-400 text-sm">
						{error}
					</div>
				)}
			</div>
		</div>
	)
}
