"use client"

import Tooltip from "@/app/components/ui/Tooltip"

export default function PositionRow({ index, position, onChange, onRemove }) {
	function handleChange(field, value) {
		onChange(index, {
			...position,
			[field]: value
		})
	}

	return (
		<div className="grid grid-cols-5 gap-3 items-end">
			<div className="flex flex-col">
				<label className="text-xs text-gray-300">
					Ticker
					<Tooltip text="Optional. Used only for identification." />
				</label>
				<input
					value={position.ticker}
					onChange={(e) => handleChange("ticker", e.target.value)}
					className="p-2 rounded bg-gray-700 text-white"
				/>
			</div>

			<div className="flex flex-col">
				<label className="text-xs text-gray-300">
					Entry
					<Tooltip text="Price where you enter the trade." />
				</label>
				<input
					value={position.entry}
					onChange={(e) => handleChange("entry", e.target.value)}
					className="p-2 rounded bg-gray-700 text-white"
				/>
			</div>

			<div className="flex flex-col">
				<label className="text-xs text-gray-300">
					Stop
					<Tooltip text="Exit price to limit loss. Must be below entry for long positions." />
				</label>
				<input
					value={position.stop}
					onChange={(e) => handleChange("stop", e.target.value)}
					className="p-2 rounded bg-gray-700 text-white"
				/>
			</div>

			<div className="flex flex-col">
				<label className="text-xs text-gray-300">
					Shares
					<Tooltip text="Number of shares. Combined with stop loss distance this determines risk." />
				</label>
				<input
					value={position.shares}
					onChange={(e) => handleChange("shares", e.target.value)}
					className="p-2 rounded bg-gray-700 text-white"
				/>
			</div>

			<button
				onClick={() => onRemove(index)}
				className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
			>
				Remove
			</button>
		</div>
	)
}
