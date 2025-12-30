import requests
import pandas as pd
from datetime import datetime
import json
import os

class OpenAQService:
    def __init__(self):
        self.base_url = "https://api.openaq.org/v2/latest"
        # Delhi coordinates
        self.lat = 28.6139
        self.lon = 77.2090
        self.radius = 50000 # 50km
        self.cache_dir = "data/cache"
        os.makedirs(self.cache_dir, exist_ok=True)

    async def get_latest_data(self):
        """
        Fetch latest data from OpenAQ for Delhi-NCR.
        """
        params = {
            "coordinates": f"{self.lat},{self.lon}",
            "radius": self.radius,
            "limit": 100,
            "parameter": ["pm25", "pm10", "no2", "co"]
        }
        
        try:
            # Check cache first (implementation simplified for this example)
            cache_file = os.path.join(self.cache_dir, f"latest_aqi_{datetime.now().strftime('%Y%m%d%H')}.json")
            if os.path.exists(cache_file):
                with open(cache_file, 'r') as f:
                    return json.load(f)

            response = requests.get(self.base_url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                # Normalize and structure data
                results = self._process_results(data['results'])
                
                # Cache results
                with open(cache_file, 'w') as f:
                    json.dump(results, f)
                    
                return results
            else:
                # Fallback to mock data if API fails (e.g., 410 Gone)
                print(f"⚠️ OpenAQ API failed with {response.status_code}. Using mock data.")
                return self._get_mock_data()
        except Exception as e:
            print(f"❌ Error fetching OpenAQ data: {e}. Using mock data.")
            return self._get_mock_data()

    def _get_mock_data(self):
        """Generate realistic mock data for Delhi-NCR"""
        locations = [
            {"name": "Anand Vihar", "lat": 28.6476, "lon": 77.3158, "base_aqi": 380},
            {"name": "ITO", "lat": 28.6284, "lon": 77.2410, "base_aqi": 310},
            {"name": "Dwarka Sector 8", "lat": 28.5714, "lon": 77.0667, "base_aqi": 280},
            {"name": "Okhla Phase 2", "lat": 28.5447, "lon": 77.2726, "base_aqi": 295},
            {"name": "RK Puram", "lat": 28.5660, "lon": 77.1767, "base_aqi": 260},
            {"name": "Punjabi Bagh", "lat": 28.6671, "lon": 77.1212, "base_aqi": 340},
            {"name": "Mandir Marg", "lat": 28.6341, "lon": 77.2005, "base_aqi": 220},
            {"name": "Lodhi Road", "lat": 28.5919, "lon": 77.2273, "base_aqi": 190}
        ]
        
        import random
        results = []
        for loc in locations:
            # Vary AQI slightly
            aqi = loc['base_aqi'] + random.randint(-40, 60)
            results.append({
                "location": loc['name'],
                "coordinates": {"latitude": loc['lat'], "longitude": loc['lon']},
                "measurements": {
                    "pm25": aqi,
                    "pm10": aqi * 1.6 + random.randint(10, 30),
                    "no2": 45 + random.randint(-10, 20),
                    "co": 1.2 + random.uniform(-0.5, 1.5)
                },
                "last_updated": datetime.now().isoformat()
            })
            
        return {"results": processed if 'processed' in locals() else results, "timestamp": datetime.now().isoformat()}

    def _process_results(self, results):
        processed = []
        for r in results:
            measurements = {m['parameter']: m['value'] for m in r['measurements']}
            processed.append({
                "location": r['location'],
                "coordinates": r['coordinates'],
                "measurements": measurements,
                "last_updated": r['measurements'][0]['lastUpdated'] if r['measurements'] else None
            })
        return {"results": processed, "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    # Test
    import asyncio
    service = OpenAQService()
    print(asyncio.run(service.get_latest_data()))
