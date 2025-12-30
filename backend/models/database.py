from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
import json
import os

# Simple file-based storage (can be upgraded to SQLite/PostgreSQL)
DATA_DIR = "data/cache"
os.makedirs(DATA_DIR, exist_ok=True)

class AQIReading(BaseModel):
    timestamp: datetime
    lat: float
    lon: float
    aqi: float
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    o3: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None

class FavoriteLocation(BaseModel):
    id: str
    name: str
    lat: float
    lon: float
    added_at: datetime

class HistoricalDatabase:
    def __init__(self):
        self.readings_file = os.path.join(DATA_DIR, "historical_readings.jsonl")
        self.favorites_file = os.path.join(DATA_DIR, "favorites.json")
    
    def save_reading(self, reading: AQIReading):
        """Append reading to historical data"""
        with open(self.readings_file, "a") as f:
            f.write(reading.model_dump_json() + "\n")
    
    def get_readings(
        self, 
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        radius_km: float = 1.0,
        limit: int = 1000
    ) -> List[AQIReading]:
        """Query historical readings with filters"""
        if not os.path.exists(self.readings_file):
            return []
        
        readings = []
        with open(self.readings_file, "r") as f:
            for line in f:
                if not line.strip():
                    continue
                data = json.loads(line)
                reading = AQIReading(**data)
                
                # Apply filters
                if start_time and reading.timestamp < start_time:
                    continue
                if end_time and reading.timestamp > end_time:
                    continue
                
                if lat is not None and lon is not None:
                    # Simple distance calculation
                    distance = ((reading.lat - lat)**2 + (reading.lon - lon)**2)**0.5 * 111  # km
                    if distance > radius_km:
                        continue
                
                readings.append(reading)
                
                if len(readings) >= limit:
                    break
        
        return readings[-limit:]  # Return most recent
    
    def save_favorite(self, favorite: FavoriteLocation):
        """Save a favorite location"""
        favorites = self.get_favorites()
        # Remove existing if updating
        favorites = [f for f in favorites if f.id != favorite.id]
        favorites.append(favorite)
        
        with open(self.favorites_file, "w") as f:
            json.dump([f.model_dump(mode="json") for f in favorites], f, indent=2, default=str)
    
    def get_favorites(self) -> List[FavoriteLocation]:
        """Get all favorite locations"""
        if not os.path.exists(self.favorites_file):
            return []
        
        with open(self.favorites_file, "r") as f:
            data = json.load(f)
            return [FavoriteLocation(**item) for item in data]
    
    def delete_favorite(self, favorite_id: str):
        """Delete a favorite location"""
        favorites = self.get_favorites()
        favorites = [f for f in favorites if f.id != favorite_id]
        
        with open(self.favorites_file, "w") as f:
            json.dump([f.model_dump(mode="json") for f in favorites], f, indent=2, default=str)
