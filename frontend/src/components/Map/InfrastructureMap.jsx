// File: /frontend/src/components/Map/InfrastructureMap.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import LocationSearch from './LocationSearch';
import 'leaflet/dist/leaflet.css';

// Fix leafet default icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const ItemDetailsPanel = ({ item, onClose }) => {
  return (
    <div className="item-details-panel">
      <button className="close-btn" onClick={onClose}>×</button>
      <h3>Details</h3>
      <div className="details-content">
        <p><strong>Name:</strong> {item.name}</p>
        <p><strong>Status:</strong> {item.status}</p>
        <p><strong>Capacity:</strong> {item.capacity}</p>
        {/* Render more based on item type... */}
      </div>
      <style>{`
        .item-details-panel {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 300px;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          z-index: 1000;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

const InfrastructureMap = () => {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [zoom, setZoom] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [infrastructureData, setInfrastructureData] = useState({
    substations: [],
    cngStations: [],
    waterTanks: [],
    outages: []
  });
  const [visibleLayers, setVisibleLayers] = useState({
    electricity: true,
    gas: true,
    water: true,
    outages: true
  });
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadInfrastructureData();
  }, []);

  const loadInfrastructureData = async () => {
    setIsLoading(true);
    try {
      // Mocked fetching logic. Replace with actual calls.
      const electricity = { data: [] };
      const gas = { data: [] };
      const water = { data: [] };
      const outages = { data: [] };

      setInfrastructureData({
        substations: electricity.data,
        cngStations: gas.data,
        waterTanks: water.data,
        outages: outages.data
      });
    } catch (error) {
      console.error('Failed to load map data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = useCallback((location) => {
    setMapCenter([location.lat, location.lng]);
    setZoom(14);
  }, []);

  const MapController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo(center, zoom, { duration: 1.5 });
    }, [center, zoom, map]);
    return null;
  };

  const getMarkerIcon = (type, status) => {
    const colors = {
      substation: status === 'operational' ? '#FFA500' : '#FF0000',
      cngStation: '#FF6B6B',
      waterTank: '#4ECDC4',
      outage: '#FF0000'
    };

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background: ${colors[type]};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const visibleMarkers = useMemo(() => {
    const markers = [];
    
    if (visibleLayers.electricity) {
      infrastructureData.substations.forEach(item => {
        markers.push({
          ...item,
          type: 'substation',
          icon: getMarkerIcon('substation', item.status)
        });
      });
    }
    
    if (visibleLayers.gas) {
      infrastructureData.cngStations.forEach(item => {
        markers.push({
          ...item,
          type: 'cngStation',
          icon: getMarkerIcon('cngStation', 'operational')
        });
      });
    }
    
    if (visibleLayers.water) {
      infrastructureData.waterTanks.forEach(item => {
        markers.push({
          ...item,
          type: 'waterTank',
          icon: getMarkerIcon('waterTank', item.status)
        });
      });
    }

    if (visibleLayers.outages) {
      infrastructureData.outages.forEach(item => {
        markers.push({
          ...item,
          type: 'outage',
          icon: getMarkerIcon('outage', 'active')
        });
      });
    }

    return markers;
  }, [infrastructureData, visibleLayers]);

  return (
    <div className="infrastructure-map-container">
      <div className="map-header">
        <h2>Infrastructure Map</h2>
        <p>Explore electricity, gas, and water infrastructure in your area</p>
      </div>

      <div className="map-content">
        <div className="map-sidebar">
          <LocationSearch 
            onLocationSelect={handleLocationSelect}
            placeholder="Search location..."
          />

          <button 
            className="search-location-btn"
            onClick={() => {
              navigator.geolocation.getCurrentPosition((pos) => {
                handleLocationSelect({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude
                });
              });
            }}
          >
            📍 Use My Location
          </button>

          <div className="layer-controls">
            <h3>Layers</h3>
            
            <label className="layer-checkbox">
              <input
                type="checkbox"
                checked={visibleLayers.electricity}
                onChange={(e) => setVisibleLayers(prev => ({
                  ...prev,
                  electricity: e.target.checked
                }))}
              />
              ⚡ Electricity Network
              <span className="count">{infrastructureData.substations.length}</span>
            </label>

            <label className="layer-checkbox">
              <input
                type="checkbox"
                checked={visibleLayers.gas}
                onChange={(e) => setVisibleLayers(prev => ({
                  ...prev,
                  gas: e.target.checked
                }))}
              />
              🔥 Gas Network
              <span className="count">{infrastructureData.cngStations.length}</span>
            </label>

            <label className="layer-checkbox">
              <input
                type="checkbox"
                checked={visibleLayers.water}
                onChange={(e) => setVisibleLayers(prev => ({
                  ...prev,
                  water: e.target.checked
                }))}
              />
              💧 Water Network
              <span className="count">{infrastructureData.waterTanks.length}</span>
            </label>

            <label className="layer-checkbox outage-layer">
              <input
                type="checkbox"
                checked={visibleLayers.outages}
                onChange={(e) => setVisibleLayers(prev => ({
                  ...prev,
                  outages: e.target.checked
                }))}
              />
              ⚠️ Show Outages
              <span className="count alert">{infrastructureData.outages.length}</span>
            </label>
          </div>

          <div className="map-legend">
            <h3>Legend</h3>
            <div className="legend-item">
              <span className="legend-marker" style={{ background: '#FFA500' }}></span>
              Substation
            </div>
            <div className="legend-item">
              <span className="legend-marker" style={{ background: '#FF6B6B' }}></span>
              CNG Station
            </div>
            <div className="legend-item">
              <span className="legend-marker" style={{ background: '#4ECDC4' }}></span>
              Water Tank/WTP
            </div>
            <div className="legend-item">
              <span className="legend-marker" style={{ background: '#FF0000' }}></span>
              Active Outage
            </div>
          </div>
        </div>

        <div className="map-wrapper" style={{ flex: 1, position: 'relative' }}>
          {isLoading && (
            <div className="map-loading-overlay">
              <p>Loading infrastructure data...</p>
            </div>
          )}

          <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: '600px', width: '100%', borderRadius: '12px' }}
            whenReady={() => setIsLoading(false)}
          >
            <MapController center={mapCenter} zoom={zoom} />
            
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            <MarkerClusterGroup chunkedLoading>
              {visibleMarkers.map((marker, index) => (
                <Marker
                  key={`${marker.type}-${marker.id || index}`}
                  position={[marker.lat, marker.lng]}
                  icon={marker.icon}
                  eventHandlers={{
                    click: () => setSelectedItem(marker)
                  }}
                >
                  <Popup>
                    <MarkerPopupContent item={marker} />
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>

      {selectedItem && (
        <ItemDetailsPanel 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)}
        />
      )}

      <style>{`
        .infrastructure-map-container {
          padding: 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .map-header {
          margin-bottom: 20px;
        }
        .map-content {
          display: flex;
          gap: 20px;
          height: 600px;
        }
        .map-sidebar {
          width: 300px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: #f8f9fa;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .search-location-btn {
          padding: 10px;
          background: #1A73E8;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        .layer-controls {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .layer-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .count {
          margin-left: auto;
          background: #e9ecef;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        .count.alert {
          background: #ffe3e3;
          color: #c92a2a;
        }
        .map-legend {
          margin-top: auto;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .legend-marker {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: inline-block;
        }
        .map-loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

const MarkerPopupContent = ({ item }) => {
  switch (item.type) {
    case 'substation':
      return (
        <div className="popup-content">
          <h4>{item.name}</h4>
          <p><strong>Type:</strong> {item.substationType}</p>
          <p><strong>Capacity:</strong> {item.capacity}</p>
          <p><strong>Current Load:</strong> {item.currentLoad}%</p>
          <p><strong>Status:</strong> {item.status}</p>
        </div>
      );
    case 'cngStation':
      return (
        <div className="popup-content">
          <h4>{item.name}</h4>
          <p><strong>Address:</strong> {item.address}</p>
          <p><strong>Price:</strong> ₹{item.price}/kg</p>
          <p><strong>Hours:</strong> {item.operatingHours}</p>
        </div>
      );
    case 'waterTank':
      return (
        <div className="popup-content">
          <h4>{item.name}</h4>
          <p><strong>Type:</strong> {item.tankType}</p>
          <p><strong>Capacity:</strong> {item.capacity} ML</p>
          <p><strong>Status:</strong> {item.status}</p>
        </div>
      );
    default:
      return null;
  }
};

export default InfrastructureMap;
