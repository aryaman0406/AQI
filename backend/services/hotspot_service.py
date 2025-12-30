from services.prediction_service import PredictionService
import numpy as np

class HotspotService:
    def __init__(self):
        self.prediction_service = PredictionService()

    async def get_hotspots(self):
        """
        Identify high pollution clusters (hotspots).
        """
        grid_data_res = await self.prediction_service.get_full_grid()
        grid = grid_data_res['grid']
        
        # Filter for high AQI (> 250)
        high_aqi_cells = [cell for cell in grid if cell['aqi'] > 200]
        
        # Simple clustering: if cells are very close, they form a hotspot
        # For this prototype, we'll return the top 5 distinct high-AQI clusters
        # In a real app, use DBSCAN or similar
        
        hotspots = []
        if high_aqi_cells:
            # Sort by AQI descending
            sorted_cells = sorted(high_aqi_cells, key=lambda x: x['aqi'], reverse=True)
            
            # Simple greedy clustering
            added = []
            for cell in sorted_cells:
                if len(hotspots) >= 5:
                    break
                    
                is_near = False
                for existing in added:
                    dist = (cell['lat'] - existing['lat'])**2 + (cell['lon'] - existing['lon'])**2
                    if dist < 0.01: # ~1km
                        is_near = True
                        break
                
                if not is_near:
                    hotspots.append({
                        "id": f"hotspot_{len(hotspots)+1}",
                        "lat": cell['lat'],
                        "lon": cell['lon'],
                        "aqi": cell['aqi'],
                        "type": "Hotspot",
                        "radius": 500 # meters
                    })
                    added.append(cell)

        # Mock Corridors (Road stretches)
        corridors = [
            {
                "name": "Delhi-Gurgaon Expressway",
                "start": {"lat": 28.52, "lon": 77.10},
                "end": {"lat": 28.45, "lon": 77.05},
                "avg_aqi": 210
            },
            {
                "name": "Outer Ring Road (North)",
                "start": {"lat": 28.70, "lon": 77.15},
                "end": {"lat": 28.72, "lon": 77.25},
                "avg_aqi": 195
            }
        ]

        return {
            "hotspots": hotspots,
            "corridors": corridors
        }
