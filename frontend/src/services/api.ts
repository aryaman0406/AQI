import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ForecastData {
    timestamp: string;
    hour: string;
    aqi: number;
    category: string;
}

export interface HealthRecommendation {
    aqi: number;
    category: string;
    health_impact: string;
    outdoor_activities: string;
    indoor_activities: string;
    mask_required: boolean;
    detailed_recommendations: string[];
    sensitive_groups_advice?: string;
}

export interface FavoriteLocation {
    id: string;
    name: string;
    lat: number;
    lon: number;
    current_aqi?: number;
}

export const getLiveAQI = async () => {
    const response = await api.get('/aqi/live');
    return response.data;
};

export const getAQIGrid = async () => {
    const response = await api.get('/aqi/grid');
    return response.data;
};

export const getHotspots = async () => {
    const response = await api.get('/aqi/hotspots');
    return response.data;
};

export const getAlerts = async (lat: number, lon: number) => {
    const response = await api.get('/alerts', {
        params: { lat, lon },
    });
    return response.data;
};

// New API calls
export const getHealthRecommendations = async (aqi: number, sensitiveGroup: boolean = false) => {
    const response = await api.get('/health/recommendations', {
        params: { aqi, sensitive_group: sensitiveGroup }
    });
    return response.data;
};

export const getForecast = async (lat: number, lon: number) => {
    const response = await api.get('/forecast', {
        params: { lat, lon }
    });
    return response.data;
};

export const getRegionalForecast = async () => {
    const response = await api.get('/forecast/regional');
    return response.data;
};

export const geocodeLocation = async (address: string) => {
    const response = await api.get('/locations/geocode', {
        params: { address }
    });
    return response.data;
};

export const getLocationAQI = async (lat: number, lon: number) => {
    const response = await api.get('/aqi/location', {
        params: { lat, lon }
    });
    return response.data;
};

export const getHistoricalData = async (params: {
    start_time?: string;
    end_time?: string;
    lat?: number;
    lon?: number;
    radius_km?: number;
    limit?: number;
}) => {
    const response = await api.get('/historical', { params });
    return response.data;
};

export const addFavorite = async (name: string, lat: number, lon: number) => {
    const response = await api.post('/favorites', { name, lat, lon });
    return response.data;
};

export const getFavorites = async () => {
    const response = await api.get('/favorites');
    return response.data;
};

export const deleteFavorite = async (id: string) => {
    const response = await api.delete(`/favorites/${id}`);
    return response.data;
};

export const getAnalyticsSummary = async (days: number = 7) => {
    const response = await api.get('/analytics/summary', {
        params: { days }
    });
    return response.data;
};

export const exportData = async (format: 'csv' | 'json' | 'geojson', params?: {
    start_time?: string;
    end_time?: string;
}) => {
    const response = await api.get(`/export/${format}`, {
        params,
        responseType: 'blob'
    });
    
    // Trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `aqi_data_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

// WebSocket connection for real-time updates
export class AQIWebSocket {
    private ws: WebSocket | null = null;
    private reconnectInterval: number = 5000;
    private reconnectTimer: NodeJS.Timeout | null = null;

    constructor(
        private onMessage: (data: any) => void,
        private onConnect?: () => void,
        private onDisconnect?: () => void
    ) {}

    connect() {
        try {
            this.ws = new WebSocket('ws://localhost:8000/ws');
            
            this.ws.onopen = () => {
                console.log('WebSocket connected');
                if (this.onConnect) this.onConnect();
                if (this.reconnectTimer) {
                    clearTimeout(this.reconnectTimer);
                    this.reconnectTimer = null;
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.onMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                if (this.onDisconnect) this.onDisconnect();
                this.scheduleReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Error creating WebSocket:', error);
            this.scheduleReconnect();
        }
    }

    private scheduleReconnect() {
        if (!this.reconnectTimer) {
            this.reconnectTimer = setTimeout(() => {
                console.log('Attempting to reconnect WebSocket...');
                this.connect();
            }, this.reconnectInterval);
        }
    }

    disconnect() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    send(data: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
}

export default api;
