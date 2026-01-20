import "./globals.css"

export const metadata = {
	title: "Trading View",
	description: "Trading tools and calculators"
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="bg-gray-100 text-gray-900">
				{children}
			</body>
		</html>
	)
}
