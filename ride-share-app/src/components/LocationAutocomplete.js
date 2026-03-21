import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const LocationAutocomplete = ({ placeholder, value, onChange, onSelect, className }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
            const data = await res.json();
            setSuggestions(data.features || []);
        } catch (error) {
            console.error("Photon API Error:", error);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        onChange(val);
        setIsOpen(true);
        // Debounce simple implementation
        setTimeout(() => fetchSuggestions(val), 300);
    };

    const handleSelect = (feature) => {
        const name = [feature.properties.name, feature.properties.city, feature.properties.state, feature.properties.country]
            .filter(Boolean)
            .join(', ');
        const lat = feature.geometry.coordinates[1];
        const lon = feature.geometry.coordinates[0];

        onChange(name);
        if (onSelect) {
            onSelect({ name, lat, lon });
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className={`flex items-center w-full focus-within:ring-2 focus-within:ring-indigo-500 bg-white ${className || 'px-4 py-3 border border-gray-200 rounded-xl'}`}>
                {!className && <Search size={16} className="text-gray-400 mr-2" />}
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => { if (value && value.length >= 3) setIsOpen(true); }}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent dark:text-gray-900 outline-none w-full"
                    required
                />
            </div>
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                        <li
                            key={i}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input blur
                                handleSelect(s);
                            }}
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
                        >
                            <span className="font-semibold">{s.properties.name}</span>
                            <span className="text-gray-500 text-xs ml-2">
                                {[s.properties.city, s.properties.state, s.properties.country].filter(Boolean).join(', ')}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationAutocomplete;
