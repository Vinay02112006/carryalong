import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Recenter = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], map.getZoom());
    }, [lat, lng]);
    return null;
};

const MapComponent = ({ pickup, drop, height = '300px' }) => {
    // Default to center of India if no coords
    const defaultCenter = [20.5937, 78.9629];
    const center = pickup ? [pickup.lat, pickup.lng] : defaultCenter;
    const zoom = pickup && drop ? 5 : 4;

    return (
        <div className="w-full rounded-lg overflow-hidden shadow-md my-4" style={{ height }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {pickup && (
                    <>
                        <Marker position={[pickup.lat, pickup.lng]}>
                            <Popup>Pickup Location</Popup>
                        </Marker>
                        <Recenter lat={pickup.lat} lng={pickup.lng} />
                    </>
                )}

                {drop && (
                    <Marker position={[drop.lat, drop.lng]}>
                        <Popup>Drop Location</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
