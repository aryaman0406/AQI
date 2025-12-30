import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wind, AlertTriangle, TrendingUp, MapPin, Download, BarChart3 } from 'lucide-react';
import styles from './Dashboard.module.css';
import { getLiveAQI, getHotspots, exportData, AQIWebSocket } from '../services/api';
import MapView from '../components/MapView';
import Favorites from '../components/Favorites';
import Forecast from '../components/Forecast';
import HealthAdvice from '../components/HealthAdvice';

const data = [
    { time: '00:00', aqi: 120 },
    { time: '04:00', aqi: 140 },
    { time: '08:00', aqi: 280 },
    { time: '12:00', aqi: 210 },
    { time: '16:00', aqi: 190 },
    { time: '20:00', aqi: 250 },
    { time: '23:00', aqi: 230 },
];

const Dashboard: React.FC = () => {
    const [liveData, setLiveData] = useState<any>(null);
    const [hotspots, setHotspots] = useState<any[]>([]);
    const [currentAqi, setCurrentAqi] = useState<number>(184);
    const [wsConnected, setWsConnected] = useState(false);
    const [activeView, setActiveView] = useState<'overview' | 'forecast' | 'health' | 'favorites'>('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const live = await getLiveAQI();
                setLiveData(live);
                const hot = await getHotspots();
                setHotspots(hot);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();

        // Setup WebSocket for real-time updates
        const ws = new AQIWebSocket(
            (data) => {
                console.log('WebSocket update:', data);
                if (data.type === 'aqi_update') {
                    setLiveData(data.data);
                } else if (data.type === 'hotspot_update') {
                    setHotspots(data.data);
                }
            },
            () => setWsConnected(true),
            () => setWsConnected(false)
        );
        
        ws.connect();

        return () => {
            ws.disconnect();
        };
    }, []);

    const handleExport = async (format: 'csv' | 'json' | 'geojson') => {
        try {
            await exportData(format);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div>
                    <h1 className="gradient-text text-4xl mb-2" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Delhi-NCR Air Quality</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Hyperlocal real-time monitoring and predictions</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 1rem' }}>
                        <div 
                            className="status-dot" 
                            style={{ 
                                width: '12px', 
                                height: '12px', 
                                borderRadius: '50%', 
                                background: wsConnected ? 'var(--accent-green)' : '#ef4444' 
                            }}
                        ></div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            {wsConnected ? 'Live Updates Active' : 'Reconnecting...'}
                        </span>
                    </div>
                    <div className="glass-card" style={{ padding: '0.5rem' }}>
                        <button
                            onClick={() => handleExport('csv')}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                            title="Export data as CSV"
                        >
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setActiveView('overview')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        background: activeView === 'overview' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: activeView === 'overview' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveView('forecast')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        background: activeView === 'forecast' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: activeView === 'forecast' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    48h Forecast
                </button>
                <button
                    onClick={() => setActiveView('health')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        background: activeView === 'health' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: activeView === 'health' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Health Advice
                </button>
                <button
                    onClick={() => setActiveView('favorites')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        background: activeView === 'favorites' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: activeView === 'favorites' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Favorites
                </button>
            </div>

            {activeView === 'overview' && (
                <>
                    <section className={styles.statsGrid}>
                        <StatCard
                            label="Avg. PM2.5"
                            value={liveData?.results?.[0]?.measurements?.pm25?.toString() || "184"}
                            trend="+12%"
                            status="Poor"
                            icon={<Wind size={20} />}
                        />
                        <StatCard
                            label="Monitoring Stations"
                            value="38"
                            status="Online"
                            icon={<MapPin size={20} />}
                        />
                        <StatCard
                            label="Predicted Peak"
                            value="310"
                            trend="Next: 08:00"
                            status="Severe"
                            icon={<TrendingUp size={20} />}
                        />
                        <StatCard
                            label="Active Alerts"
                            value="5"
                            status="Critical"
                            icon={<AlertTriangle size={20} />}
                        />
                    </section>

                    <section className={`${styles.mainChart} glass-card`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Pollution Trend (24h)</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>PM2.5</button>
                                <button style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', background: 'none', color: 'var(--text-muted)', border: 'none' }}>PM10</button>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer>
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                    />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(8px)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="aqi"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAqi)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className={`${styles.hotspots} glass-card`}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Pollution Hotspots</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {hotspots.length > 0 ? (
                        hotspots.map((spot, idx) => (
                            <HotspotItem key={idx} name={spot.name} aqi={spot.aqi} status={spot.status} />
                        ))
                    ) : (
                        <>
                            <HotspotItem name="Anand Vihar" aqi={412} status="Severe" />
                            <HotspotItem name="ITO" aqi={385} status="Severe" />
                            <HotspotItem name="Dwarka Sector 8" aqi={342} status="Very Poor" />
                            <HotspotItem name="Okhla Phase 2" aqi={318} status="Very Poor" />
                        </>
                    )}
                </div>
            </section>

            <section className={`${styles.mapSection} glass-card`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Hyperlocal Air Quality Heatmap</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grid Resolution: 250m</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated: 2 mins ago</span>
                    </div>
                </div>
                <div style={{ height: 'calc(100% - 4rem)' }}>
                    <MapView />
                </div>
            </section>
                </>
            )}

            {activeView === 'forecast' && (
                <Forecast lat={28.6139} lon={77.2090} />
            )}

            {activeView === 'health' && (
                <HealthAdvice aqi={currentAqi} />
            )}

            {activeView === 'favorites' && (
                <Favorites />
            )}
        </div>
    );
};

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    status: string;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
    label, value, trend, status, icon
}) => (
    <div className={`${styles.statCard} glass-card`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)' }}>
                {icon}
            </div>
            {trend && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-red)' }}>{trend}</span>}
        </div>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>{value}</div>
        <div className={`status-badge ${status === 'Good' ? styles.statAqiGood : (status === 'Severe' || status === 'Critical' ? styles.statAqiPoor : styles.statAqiMod)}`}
            style={{ marginTop: '0.5rem', display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>
            {status}
        </div>
    </div>
);

const HotspotItem: React.FC<{ name: string; aqi: number; status: string }> = ({ name, aqi, status }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '0.75rem', transition: 'background 0.3s ease' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500 }}>{name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{status}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{aqi}</div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>PM2.5</div>
        </div>
    </div>
);

export default Dashboard;
