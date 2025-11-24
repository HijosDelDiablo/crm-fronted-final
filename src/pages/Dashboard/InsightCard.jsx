import React from 'react';

const InsightCard = ({ title, value, icon, trend, trendValue, color = '#2962FF' }) => {
    return (
        <div style={{
            backgroundColor: '#1e222d',
            borderRadius: '8px',
            padding: '20px',
            color: '#D9D9D9',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            borderLeft: `4px solid ${color}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '14px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
                {icon && <span style={{ fontSize: '20px', color: color }}>{icon}</span>}
            </div>
            
            <div style={{ marginTop: '15px' }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff' }}>{value}</span>
            </div>

            {trend && (
                <div style={{ 
                    marginTop: '10px', 
                    fontSize: '12px', 
                    display: 'flex', 
                    alignItems: 'center',
                    color: trend === 'up' ? '#00E396' : '#FF4560'
                }}>
                    <span style={{ marginRight: '5px' }}>
                        {trend === 'up' ? '▲' : '▼'}
                    </span>
                    <span>{trendValue}</span>
                    <span style={{ marginLeft: '5px', color: '#8b949e' }}>vs last month</span>
                </div>
            )}
        </div>
    );
};

export default InsightCard;
