export default function SidebarItem({ label, active, onClick }) {
	return (
		<button
			onClick={onClick}
			className={`w-full text-left px-4 py-2 rounded ${
				active
					? "bg-orange-500 text-white"
					: "hover:bg-gray-800 text-gray-300"
			}`}
		>
			{label}
		</button>
	)
}
