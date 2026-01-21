"use client"

import { useState, useEffect } from "react"
import InputField from "../ui/InputField"
import StockCard from "./StockCard"

export default function StockSearch() {
    const [symbol, setSymbol] = useState("")
    const [suggestions, setSuggestions] = useState([]) // List of autocomplete results
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [stock, setStock] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // --- AUTOCOMPLETE LOGIC ---
    useEffect(() => {
        // Don't search if empty or too short
        if (symbol.length < 2) {
            setSuggestions([])
            return
        }

        // Debounce: Wait 300ms after user stops typing to fetch
        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await fetch(`/api/stock?query=${symbol}`)
                const data = await res.json()
                if (Array.isArray(data)) {
                    // Filter out dots (often non-US tickers) if you prefer cleaner results
                    setSuggestions(data.slice(0, 5))
                    setShowSuggestions(true)
                }
            } catch (err) {
                console.error("Autocomplete failed", err)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [symbol])

    // --- SEARCH SELECTION ---
    function selectSuggestion(item) {
        setSymbol(item.symbol) // Fill input with clicked symbol
        setSuggestions([])     // Clear list
        setShowSuggestions(false)
        handleSearch(item.symbol) // Trigger the main search immediately
    }

    async function handleSearch(overrideSymbol = null) {
        const searchTicker = overrideSymbol || symbol
        setError("")
        setStock(null)
        setSuggestions([]) // Hide suggestions when searching

        if (!searchTicker.trim()) {
            setError("Enter a stock ticker, e.g. AAPL")
            return
        }

        setLoading(true)

        try {
            const res = await fetch(`/api/stock?symbol=${searchTicker.toUpperCase()}`)
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error)
            }

            setStock(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4 relative"> {/* Added relative for positioning dropdown */}
            <div className="relative">
                <InputField
                    label="Stock ticker"
                    value={symbol}
                    onChange={(e) => {
                        setSymbol(e.target.value)
                        setShowSuggestions(true) // Show list again if typing
                    }}
                    placeholder="AAPL"
                    tooltip="Start typing to see examples (e.g. Apple, Tesla)"
                    error={error}
                    // Disable browser's default autocomplete to avoid clutter
                    autoComplete="off" 
                />
                
                {/* --- SUGGESTIONS DROPDOWN --- */}
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
                        {suggestions.map((item) => (
                            <li 
                                key={item.symbol}
                                onClick={() => selectSuggestion(item)}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200 flex justify-between items-center transition-colors"
                            >
                                <span className="font-bold text-blue-400">{item.symbol}</span>
                                <span className="text-sm text-gray-400 truncate max-w-[70%]">{item.description}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                onClick={() => handleSearch()}
                className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-500 transition-colors"
                disabled={loading}
            >
                {loading ? "Loading..." : "Search"}
            </button>

            {stock && <StockCard stock={stock} />}
        </div>
    )
}