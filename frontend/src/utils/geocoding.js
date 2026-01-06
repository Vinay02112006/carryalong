import axios from 'axios';

/**
 * Geocode a city name to coordinates using Nominatim (OpenStreetMap)
 * @param {string} city - The name of the city
 * @returns {Promise<{lat: number, lng: number}|null>} - Coordinates or null
 */
export const geocodeCity = async (city) => {
    if (!city) return null;

    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
        );

        if (response.data && response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};
