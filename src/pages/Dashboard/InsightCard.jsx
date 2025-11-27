import React from 'react';

const InsightCard = ({ title, value, icon, trend, trendValue, color = 'var(--primary)' }) => {
    return (
        <div className="insight-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{title}</h3>
                {icon && <span style={{ fontSize: '20px', color: color }}>{icon}</span>}
            </div>
            
            <div className="insight-value">
                {value}
            </div>

            {trend && (
                <div className="insight-trend" style={{ color: trend === 'up' ? '#00E396' : '#FF4560' }}>
                    <span style={{ marginRight: '5px' }}>
                        {trend === 'up' ? '▲' : '▼'}
                    </span>
                    <span>{trendValue}</span>
                    <span style={{ marginLeft: '5px', color: 'rgba(156, 163, 175, 0.95)' }}>vs last month</span>
                </div>
            )}
        </div>
    );
};

export default InsightCard;
