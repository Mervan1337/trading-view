"use client"

import { useState } from "react"

export default function Tooltip({ text }) {
	const [open, setOpen] = useState(false)

	return (
		<div className="relative inline-block">
			<button
				type="button"
				onMouseEnter={() => setOpen(true)}
				onMouseLeave={() => setOpen(false)}
				className="ml-2 text-xs font-semibold text-gray-400 hover:text-white"
			>
				?
			</button>

			{open && (
				<div className="absolute z-10 w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg top-6 left-1/2 -translate-x-1/2">
					{text}
				</div>
			)}
		</div>
	)
}
