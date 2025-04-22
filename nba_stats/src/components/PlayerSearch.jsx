import { useState, useEffect } from 'react';

export default function PlayerSearch({ onPlayerSelect }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSelect = (player) => {
        setQuery(player.full_name);
        setSuggestions([]);
        onPlayerSelect(player)
        setShowSuggestions(false);
    }; 

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            fetch(`http://localhost:8000/search-players?q=${encodeURIComponent(query)}`)
                .then((res) => res.json())
                .then((data) => setSuggestions(data));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="relative max-w-md mx-auto">
            <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                placeholder="Buscar jugador..."
                className="w-full border border-gray-300 rounded px-4 py-2 shadow-sm focus:ring focus:outline-none"
            />

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded mt-1 shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((player) => (
                        <li
                            key={player.id}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => handleSelect(player)}
                        >
                            {player.full_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
