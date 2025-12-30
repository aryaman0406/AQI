import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { getHealthRecommendations, type HealthRecommendation } from '../services/api';

interface HealthAdviceProps {
    aqi: number;
}

const HealthAdvice: React.FC<HealthAdviceProps> = ({ aqi }) => {
    const [recommendations, setRecommendations] = useState<HealthRecommendation | null>(null);
    const [sensitiveGroup, setSensitiveGroup] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecommendations();
    }, [aqi, sensitiveGroup]);

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            const data = await getHealthRecommendations(aqi, sensitiveGroup);
            setRecommendations(data);
        } catch (error) {
            console.error('Failed to load health recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !recommendations) {
        return (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
                <p>Loading health recommendations...</p>
            </div>
        );
    }

    const getCategoryColor = () => {
        if (aqi <= 50) return '#10b981';
        if (aqi <= 100) return '#f59e0b';
        if (aqi <= 150) return '#fb923c';
        if (aqi <= 200) return '#ef4444';
        if (aqi <= 300) return '#dc2626';
        return '#7c3aed';
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={20} style={{ color: getCategoryColor() }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Health Recommendations</h3>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={sensitiveGroup}
                        onChange={(e) => setSensitiveGroup(e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                    />
                    Sensitive Group
                </label>
            </div>

            {/* AQI Category Badge */}
            <div
                style={{
                    padding: '1rem',
                    background: `${getCategoryColor()}20`,
                    border: `2px solid ${getCategoryColor()}`,
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                }}
            >
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Current Category
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: getCategoryColor() }}>
                    {recommendations.category}
                </p>
            </div>

            {/* Mask Requirement */}
            <div
                style={{
                    padding: '1rem',
                    background: recommendations.mask_required 
                        ? 'rgba(239, 68, 68, 0.1)' 
                        : 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}
            >
                {recommendations.mask_required ? (
                    <AlertTriangle size={24} style={{ color: '#ef4444' }} />
                ) : (
                    <CheckCircle size={24} style={{ color: '#10b981' }} />
                )}
                <div>
                    <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                        {recommendations.mask_required ? 'Mask Required' : 'Mask Optional'}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {recommendations.mask_required 
                            ? 'N95 or equivalent mask recommended for outdoor activities' 
                            : 'No mask necessary for regular outdoor activities'}
                    </p>
                </div>
            </div>

            {/* Health Impact */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={16} />
                    Health Impact
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {recommendations.health_impact}
                </p>
            </div>

            {/* Activities */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#60a5fa' }}>
                        Outdoor Activities
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {recommendations.outdoor_activities}
                    </p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#10b981' }}>
                        Indoor Activities
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {recommendations.indoor_activities}
                    </p>
                </div>
            </div>

            {/* Detailed Recommendations */}
            <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Detailed Recommendations
                </h4>
                <ul style={{ display: 'grid', gap: '0.5rem', paddingLeft: '1.25rem' }}>
                    {recommendations.detailed_recommendations.map((rec, idx) => (
                        <li
                            key={idx}
                            style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-muted)',
                                lineHeight: 1.5
                            }}
                        >
                            {rec}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Sensitive Groups Advice */}
            {sensitiveGroup && recommendations.sensitive_groups_advice && (
                <div
                    style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: 'rgba(251, 146, 60, 0.1)',
                        borderRadius: '0.5rem',
                        borderLeft: '3px solid #fb923c'
                    }}
                >
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        ⚠️ Advice for Sensitive Groups
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {recommendations.sensitive_groups_advice}
                    </p>
                </div>
            )}
        </div>
    );
};

export default HealthAdvice;
