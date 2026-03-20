// File: /frontend/src/components/Map/LocationSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

const LocationSearch = ({ onLocationSelect, placeholder = "Search location..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced search function
  const searchLocations = useRef(
    debounce(async (searchQuery) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Option 1: Use Nominatim (OpenStreetMap) - Free
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(searchQuery)}&` +
          `countrycodes=in&` + // Restrict to India
          `format=json&` +
          `addressdetails=1&` +
          `limit=8`
        );
        const data = await response.json();
        
        const formattedSuggestions = data.map(item => ({
          id: item.place_id,
          displayName: item.display_name,
          shortName: formatShortName(item),
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          type: item.type,
          address: item.address
        }));

        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error('Location search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;

  // Format short display name
  const formatShortName = (item) => {
    const parts = [];
    if (item.address?.suburb) parts.push(item.address.suburb);
    if (item.address?.city || item.address?.town) {
      parts.push(item.address.city || item.address.town);
    }
    if (item.address?.state) parts.push(item.address.state);
    return parts.join(', ') || item.display_name.split(',').slice(0, 2).join(',');
  };

  useEffect(() => {
    searchLocations(query);
    return () => searchLocations.cancel();
  }, [query, searchLocations]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion) => {
    setQuery(suggestion.shortName);
    setShowSuggestions(false);
    onLocationSelect({
      lat: suggestion.lat,
      lng: suggestion.lng,
      name: suggestion.shortName,
      fullAddress: suggestion.displayName
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocode to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?` +
              `lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            
            onLocationSelect({
              lat: latitude,
              lng: longitude,
              name: formatShortName(data),
              fullAddress: data.display_name
            });
            setQuery(formatShortName(data));
          } catch(e) {
            console.error('Reverse geocoding error', e);
          }
        },
        (error) => {
          console.error('Unable to get current location', error);
        }
      );
    }
  };

  return (
    <div className="location-search-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="location-search-input"
          aria-label="Search location"
          aria-autocomplete="list"
          aria-controls="location-suggestions"
        />
        {isLoading && <span className="loading-spinner">⌛</span>}
        <button 
          onClick={handleCurrentLocation}
          className="current-location-btn"
          title="Use current location"
          aria-label="Use current location"
        >
          <span>📍</span>
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul 
          ref={suggestionsRef}
          id="location-suggestions"
          className="suggestions-list"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="suggestion-item"
              role="option"
              aria-selected={false}
            >
              <span className="suggestion-icon">📍</span>
              <div className="suggestion-content">
                <span className="suggestion-name">{suggestion.shortName}</span>
                <span className="suggestion-detail">
                  {suggestion.displayName.substring(0, 60)}...
                </span>
              </div>
              <span className="suggestion-type">{suggestion.type}</span>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && query.length >= 2 && suggestions.length === 0 && !isLoading && (
        <div className="no-results">
          No locations found for "{query}"
        </div>
      )}
      
      <style>{`
        .location-search-container {
          position: relative;
          width: 100%;
          max-width: 400px;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 8px 16px;
          transition: border-color 0.2s;
        }

        .search-input-wrapper:focus-within {
          border-color: #1A73E8;
          box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
        }

        .location-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          padding: 8px;
        }

        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          margin-top: 8px;
          max-height: 300px;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          z-index: 1000;
          list-style: none;
          padding: 8px 0;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .suggestion-item:hover {
          background: #f5f5f5;
        }

        .suggestion-name {
          font-weight: 500;
          color: #202124;
        }

        .suggestion-detail {
          font-size: 12px;
          color: #5f6368;
        }

        .current-location-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .current-location-btn:hover {
          background: #e8f0fe;
        }
      `}</style>
    </div>
  );
};

export default LocationSearch;
