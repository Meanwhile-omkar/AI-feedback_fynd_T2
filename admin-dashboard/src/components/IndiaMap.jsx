import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const INDIA_TOPO_JSON = "/india_cities.json";

const CITY_COORDS = {
  "Mumbai": [72.8777, 19.0760],
  "Delhi": [77.1025, 28.7041],
  "Bangalore": [77.5946, 12.9716],
  "Hyderabad": [78.4867, 17.3850],
  "Ahmedabad": [72.5714, 23.0225],
  "Chennai": [80.2707, 13.0827],
  "Kolkata": [88.3639, 22.5726],  //assam , faridabad , nerul, ratnagiri,
  "Surat": [72.8311, 21.1702],
  "Pune": [73.8567, 18.5204],
  "Jaipur": [75.7873, 26.9124],
  "Lucknow": [80.9462, 26.8467],
  "Kanpur": [80.3319, 26.4499],
  "Nagpur": [79.0882, 21.1458],
  "Indore": [75.8577, 22.7196],
  "Thane": [72.9781, 19.2183],
    "Assam": [91.7362, 26.1445],        // Guwahati
  "Faridabad": [77.3178, 28.4089],
  "Nerul": [73.0169, 19.0330],        // Navi Mumbai
  "Ratnagiri": [73.3120, 16.9902],
    "Coimbatore": [76.9560, 11.0168],      // Tamil Nadu
  "Mysore": [76.6394, 12.2958],          // Karnataka
  "Visakhapatnam": [83.2185, 17.6868],   // Andhra Pradesh
  "Vijayawada": [80.6380, 16.5062],      // Andhra Pradesh
  "Trivandrum": [76.9366, 8.5241],       // Kerala
  "Kochi": [76.2673, 9.9312],            // Kerala
  "Madurai": [78.1198, 9.9252]           // Tamil Nadu

};

export default function IndiaMap({ reviews = [] }) {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 h-[500px] flex flex-col border-white/5 overflow-hidden">
      <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">India Geo-Sentiment</h3>
      <div className="flex-1 w-full h-full">
        <ComposableMap 
          projection="geoMercator" 
          /* Scale reduced to 750 and center adjusted to prevent clipping */
          projectionConfig={{ scale: 1000, center: [82, 21] }} 
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={INDIA_TOPO_JSON}> 
            {({ geographies }) => 
              geographies && Array.isArray(geographies) && geographies.map(geo => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill="rgba(255,255,255,0.02)" 
                  stroke="rgba(255,255,255,0.1)" 
                  style={{ default: { outline: "none" } }}
                />
              ))
            }
          </Geographies>
          {reviews.filter(r => r.city && CITY_COORDS[r.city]).map((r) => {
            const coords = CITY_COORDS[r.city];
            const color = r.rating <= 2 ? "#ef4444" : r.rating === 3 ? "#f59e0b" : "#10b981";
            return (
              <Marker key={r.id} coordinates={[coords[0] + (Math.random()-0.5)*0.8, coords[1] + (Math.random()-0.5)*0.8]}>
                <circle r={6} fill={color} className="animate-pulse" />
              </Marker>
            );
          })}
        </ComposableMap>
      </div>
    </div>
  );
}