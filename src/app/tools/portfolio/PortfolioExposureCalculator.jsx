"use client"

import { useState } from "react"
import InputField from "@/app/components/ui/InputField"
import Tooltip from "@/app/components/ui/Tooltip"
import PositionRow from "./PositionRow"

export default function PortfolioExposureCalculator() {
	const [accountSize, setAccountSize] = useState("")
	const [positions, setPositions] = useState([
		{ ticker: "", entry: "", stop: "", shares: "" }
	])

	function normalizeNumber(value) {
		return Number(value.replace(",", "."))
	}

	function updatePosition(index, updated) {
		const copy = [...positions]
		copy[index] = updated
		setPositions(copy)
	}

	function removePosition(index) {
		setPositions(positions.filter((_, i) => i !== index))
	}

	function addPosition() {
		setPositions([
			...positions,
			{ ticker: "", entry: "", stop: "", shares: "" }
		])
	}

	function calculatePositionRisk(position) {
		const entry = normalizeNumber(position.entry)
		const stop = normalizeNumber(position.stop)
		const shares = normalizeNumber(position.shares)

		if (
			isNaN(entry) ||
			isNaN(stop) ||
			isNaN(shares) ||
			entry <= stop ||
			shares <= 0
		) {
			return 0
		}

		return (entry - stop) * shares
	}

	const account = normalizeNumber(accountSize)
	const risks = positions.map(calculatePositionRisk)
	const totalRisk = risks.reduce((a, b) => a + b, 0)
	const totalRiskPercent = account > 0 ? (totalRisk / account) * 100 : 0

	return (
		<div className="max-w-5xl p-6 bg-gray-800 rounded-xl shadow-lg">
			<h2 className="text-xl font-semibold text-white mb-2">
				Portfolio Exposure Calculator
			</h2>

			<p className="text-xs text-gray-400 mb-4">
				Risk is calculated using stop losses, not position size. Long positions only.
			</p>

			<InputField
				label="Account size"
				value={accountSize}
				onChange={(e) => setAccountSize(e.target.value)}
				placeholder="10000"
				tooltip="Your total trading capital. All risk is calculated relative to this value."
			/>

			<div className="flex flex-col gap-4 mt-6">
				{positions.map((position, index) => (
					<PositionRow
						key={index}
						index={index}
						position={position}
						onChange={updatePosition}
						onRemove={removePosition}
					/>
				))}
			</div>

			<button
				onClick={addPosition}
				className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
			>
				Add position
			</button>

			<div className="border-t border-gray-700 mt-6 pt-4">
				<div className="text-sm text-gray-300">
					Total risk
					<Tooltip text="Total amount you lose if all stop losses are hit." />:
					<strong className="text-white"> {totalRisk.toFixed(2)}</strong>
				</div>

				<div className="text-sm text-gray-300">
					Portfolio risk
					<Tooltip text="Total risk expressed as a percentage of your account size." />:
					<strong className="text-white"> {totalRiskPercent.toFixed(2)}%</strong>
				</div>

				{totalRiskPercent > 5 && (
					<div className="mt-2 text-red-400 text-sm">
						Warning: Total portfolio risk exceeds 5 percent
					</div>
				)}

				{risks.some(
					(risk) => account > 0 && (risk / account) * 100 > 2
				) && (
					<div className="mt-1 text-yellow-400 text-sm">
						Warning: One or more positions exceed 2 percent risk
					</div>
				)}
			</div>
		</div>
	)
}
