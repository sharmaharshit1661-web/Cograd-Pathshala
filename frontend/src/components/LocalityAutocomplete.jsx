import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export default function LocalityAutocomplete({ value, onChange, placeholder = "Search your locality/address..." }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locateLoading, setLocateLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Sync state if value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with a debounce when query changes
  useEffect(() => {
    if (query.trim().length < 3 || query === value) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("OSM Geocoding error:", err);
      } finally {
        setLoading(false);
      }
    }, 450); // 450ms debounce

    return () => clearTimeout(timer);
  }, [query, value]);

  const handleSelect = (item) => {
    const displayName = item.display_name;
    setQuery(displayName);
    setShowDropdown(false);

    const address = item.address || {};
    const parsedLocation = {
      display_name: displayName,
      locality: address.suburb || address.neighbourhood || address.road || address.village || address.subdistrict || '',
      city: address.city || address.town || address.state_district || address.county || '',
      state: address.state || '',
      pincode: address.postcode || '',
      latitude: item.lat,
      longitude: item.lon,
    };

    onChange(parsedLocation);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocateLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          if (data && data.display_name) {
            handleSelect(data);
          } else {
            alert("Unable to resolve coordinates to an address.");
          }
        } catch (err) {
          console.error("OSM Reverse Geocoding error:", err);
          alert("Error resolving your location address.");
        } finally {
          setLocateLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocateLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location permission denied. Please allow location access in your browser settings.");
        } else {
          alert("Unable to retrieve your current location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="form-input pr-16"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          ) : (
            <MapPin className="w-4 h-4 text-slate-400" />
          )}

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={locateLoading}
            title="Use current location"
            className="p-1 rounded-md hover:bg-slate-100 transition-colors text-blue-600 border-0 bg-transparent flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {locateLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100 p-0 text-left">
          {suggestions.map((item) => (
            <li key={item.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer border-0 bg-transparent text-sm text-slate-700"
              >
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">
                    {item.address.suburb || item.address.neighbourhood || item.address.road || item.address.village || item.address.city || "Unknown Locality"}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-normal">
                    {item.display_name}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
