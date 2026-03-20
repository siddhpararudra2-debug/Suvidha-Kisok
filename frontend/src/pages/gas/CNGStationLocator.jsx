import React, { useState, useEffect } from 'react';

const api = {
  get: async () => ({
    data: [
      { id: 1, name: 'MGL CNG Station', address: 'Athwa Lines', distance: 2.5, isOpen: true, hours: '24x7', cngPrice: 76, facilities: ['Air', 'Washroom'], lat: 21.17, lng: 72.83 },
      { id: 2, name: 'HP CNG Pump', address: 'Piplod', distance: 4.1, isOpen: true, hours: '6 AM - 11 PM', cngPrice: 76, facilities: ['Air'], lat: 21.16, lng: 72.77 }
    ]
  })
};

const CNGStationLocator = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    distance: 10, // km
    open24x7: false,
    hasQueue: false
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyStations();
    }
  }, [userLocation, filters]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Please enable location access');
          // Mock location for demo
          setUserLocation({ lat: 19.2288, lng: 72.8569 }); 
        }
      );
    }
  };

  const fetchNearbyStations = async () => {
    const response = await api.get('/gas/cng-stations', {
      params: {
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: filters.distance,
        ...filters
      }
    });
    setStations(response.data);
  };

  const openDirections = (station) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    window.open(url, '_blank');
  };

  const StationCard = ({ station }) => (
    <div className="p-4 bg-white border rounded shadow-sm mb-4">
      <h3 className="text-xl font-bold">{station.name}</h3>
      <p className="text-gray-600">{station.address}</p>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <p><strong>Distance:</strong> {station.distance} km</p>
        <p><strong>Status:</strong> <span className={station.isOpen ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{station.isOpen ? 'Open' : 'Closed'}</span></p>
        <p><strong>Hours:</strong> {station.hours}</p>
        <p><strong>Price:</strong> ₹{station.cngPrice}/kg</p>
        <p><strong>Facilities:</strong> {station.facilities.join(', ')}</p>
      </div>
      <button 
        className="mt-4 bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 font-medium"
        onClick={() => openDirections(station)}
      >
        Get Directions
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">CNG Station Locator</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search areas..."
          className="flex-1 p-3 border rounded shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center gap-4 bg-white p-3 border rounded shadow-sm">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={filters.open24x7} 
              onChange={e => setFilters({...filters, open24x7: e.target.checked})} 
            />
            Open 24x7
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stations
          .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.address.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(station => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
};

export default CNGStationLocator;
