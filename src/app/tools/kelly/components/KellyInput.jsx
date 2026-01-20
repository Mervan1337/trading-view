export default function KellyInput({ label, value, onChange, step }) {
	return (
		<div>
			<label className="block text-sm font-medium">
				{label}
			</label>
			<input
				type="number"
				step={step}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full mt-1 px-3 py-2 border rounded"
			/>
		</div>
	)
}
