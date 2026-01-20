import Tooltip from "./Tooltip"

export default function InputField({
	label,
	value,
	onChange,
	placeholder,
	tooltip,
	error
}) {
	return (
		<div className="flex flex-col gap-1">
			<label className="text-sm text-gray-300">
				{label}
				{tooltip && <Tooltip text={tooltip} />}
			</label>

			<input
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className={`px-3 py-2 rounded bg-gray-900 border text-white focus:outline-none ${
					error ? "border-red-500" : "border-gray-700 focus:border-blue-500"
				}`}
			/>

			{error && (
				<span className="text-xs text-red-400">
					{error}
				</span>
			)}
		</div>
	)
}
