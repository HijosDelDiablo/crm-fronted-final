
import React, { useEffect, useRef, useState } from 'react';
import { createSwapy } from 'swapy';
import Graphic from './Graphic';
import InsightCard from './InsightCard';
import { 
    getSalesReport, 
    getTopProducts, 
    getTopSellers, 
    getSellerWithMoreActivity 
} from '../../api/statistics.api';
import './Dashboard.css'; // We will create this next

const Dashboard = () => {
    const swapyRef = useRef(null);
    const [dashboardData, setDashboardData] = useState({
        totalSales: 0,
        salesData: [],
        topProduct: null,
        topSeller: null,
        mostActiveSeller: null,
        loading: true
    });

    useEffect(() => {
        const fetchData = async () => {
            const today = new Date();
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const formattedStart = lastMonth.toISOString().split('T')[0];
            const formattedEnd = today.toISOString().split('T')[0];

            try {
                const [salesReport, topProducts, topSellers, activeSeller] = await Promise.all([
                    getSalesReport(formattedStart, formattedEnd),
                    getTopProducts(),
                    getTopSellers(),
                    getSellerWithMoreActivity()
                ]);

                // Process sales data for chart
                const chartData = salesReport?.salesByDate?.map(item => ({
                    time: item.date,
                    value: item.sales
                })) || [];

                // Sort chart data by date just in case
                chartData.sort((a, b) => new Date(a.time) - new Date(b.time));

                setDashboardData({
                    totalSales: salesReport?.totalSales || 0,
                    salesData: chartData,
                    topProduct: topProducts?.[0], // Assuming array
                    topSeller: topSellers?.[0],   // Assuming array
                    mostActiveSeller: activeSeller,
                    loading: false
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setDashboardData(prev => ({ ...prev, loading: false }));
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (swapyRef.current) {
            const swapy = createSwapy(swapyRef.current, {
                animation: 'dynamic'
            });
            
            swapy.onSwap((event) => {
                // Optional: save layout to local storage
                // console.log('New layout:', event.data.object);
            });

            return () => {
                swapy.destroy();
            };
        }
    }, [dashboardData.loading]); // Re-init swapy when loading finishes and DOM is ready

    if (dashboardData.loading) {
        return <div className="dashboard-loading">Loading Dashboard...</div>;
    }

    return (
        <div className="dashboard-container" ref={swapyRef}>
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Overview of your sales and performance</p>
            </div>

            <div className="dashboard-grid">
                {/* Slot 1: Total Sales Card */}
                <div className="dashboard-slot slot-small" data-swapy-slot="slot-1">
                    <div className="dashboard-item" data-swapy-item="item-1">
                        <InsightCard 
                            title="Total Sales" 
                            value={`$${dashboardData.totalSales.toLocaleString()}`} 
                            icon="💰"
                            trend="up"
                            trendValue="12%"
                            color="#00E396"
                        />
                    </div>
                </div>

                {/* Slot 2: Top Seller */}
                <div className="dashboard-slot slot-small" data-swapy-slot="slot-2">
                    <div className="dashboard-item" data-swapy-item="item-2">
                        <InsightCard 
                            title="Top Seller" 
                            value={dashboardData.topSeller?.sellerName || 'N/A'} 
                            icon="🏆"
                            color="#FEB019"
                        />
                    </div>
                </div>

                {/* Slot 3: Most Active */}
                <div className="dashboard-slot slot-small" data-swapy-slot="slot-3">
                    <div className="dashboard-item" data-swapy-item="item-3">
                        <InsightCard 
                            title="Most Active" 
                            value={dashboardData.mostActiveSeller?.sellerName || 'N/A'} 
                            icon="⚡"
                            color="#FF4560"
                        />
                    </div>
                </div>

                {/* Slot 4: Top Product */}
                <div className="dashboard-slot slot-small" data-swapy-slot="slot-4">
                    <div className="dashboard-item" data-swapy-item="item-4">
                        <InsightCard 
                            title="Top Product" 
                            value={dashboardData.topProduct?.productName || 'N/A'} 
                            icon="📦"
                            color="#775DD0"
                        />
                    </div>
                </div>

                {/* Slot 5: Main Chart (Large) */}
                <div className="dashboard-slot slot-large" data-swapy-slot="slot-5">
                    <div className="dashboard-item" data-swapy-item="item-5">
                        <div className="chart-card">
                            <h3>Sales Overview</h3>
                            <div className="chart-container">
                                <Graphic data={dashboardData.salesData} />
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Slot 6: Secondary Chart (Medium) - Placeholder for now or another metric */}
                 <div className="dashboard-slot slot-medium" data-swapy-slot="slot-6">
                    <div className="dashboard-item" data-swapy-item="item-6">
                         <div className="chart-card">
                            <h3>Activity Trend</h3>
                            {/* Reusing Graphic with dummy data or different data if available */}
                            <div className="chart-container">
                                <Graphic 
                                    data={[
                                        { time: '2023-01-01', value: 10 },
                                        { time: '2023-02-01', value: 15 },
                                        { time: '2023-03-01', value: 12 },
                                        { time: '2023-04-01', value: 20 },
                                        { time: '2023-05-01', value: 25 },
                                    ]} 
                                    colors={{ lineColor: '#FF4560', areaTopColor: '#FF4560', areaBottomColor: 'rgba(255, 69, 96, 0.28)' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
