import SidebarItem from "./SidebarItem"

export default function Sidebar({ activeTool, onSelect }) {
	return (
		<aside className="w-64 bg-gray-900 text-white flex flex-col">
			<div className="p-6 text-xl font-bold border-b border-gray-700">
				Trading View
			</div>

			<nav className="flex-1 p-4 space-y-2">
				<SidebarItem
					label="Kelly Criterion Calculator"
					active={activeTool === "kelly"}
					onClick={() => onSelect("kelly")}
				/>
				<SidebarItem
					label= "Dutching Calculator"
					active={activeTool === "dutching"}
					onClick={() => onSelect("dutching")}
				/>

				<SidebarItem
					label= "Portfolio Exposure Calculator"
					active={activeTool === "exposure"}
					onClick={() => onSelect("exposure")}
				/>
			</nav>
		</aside>
	)
}
