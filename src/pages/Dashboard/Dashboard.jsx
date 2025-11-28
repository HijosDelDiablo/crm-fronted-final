
import  { useEffect, useRef, useState } from 'react';
import { createSwapy } from 'swapy';
import Graphic from './Graphic';
import InsightCard from './InsightCard';
import InsightCardSubtitle from './InsightCardSubtitle';
import InsightCardImage from './InsightCardImage';
import { 
    getSalesReport, 
    getTopProducts, 
    getTopSellers, 
    getSellerWithMoreActivity 
} from '../../api/statistics.api';
import './Dashboard.css'; 
import NavTop from '../../components/layout/Navbar'
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const navigate = useNavigate();
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
            const lastThreeMonths = new Date(today.getFullYear(), today.getMonth() - 3, 1);
            const formattedStart = lastThreeMonths.toISOString().split('T')[0];
            const formattedEnd = today.toISOString().split('T')[0];

            try {
                const [salesReport, topProducts, topSellers, activeSeller] = await Promise.all([
                    getSalesReport(formattedStart, formattedEnd, navigate),
                    getTopProducts(navigate),
                    getTopSellers(navigate),
                    getSellerWithMoreActivity(navigate)
                ]);

                // Process sales data for chart
                const chartData = salesReport?.salesByDate?.map(item => ({
                    time: item.date,
                    value: item.sales
                })) || [];

                // Sort chart data by date just in case
                chartData.sort((a, b) => new Date(a.time) - new Date(b.time));

                setDashboardData({
                    totalSales: salesReport || 0,
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
        <>
            <NavTop />
        <div className="dashboard-container" ref={swapyRef}>
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Overview of your sales and performance</p>
            </div>

            <div className="dashboard-grid">
                {/* Slot 1: Total Sales Card */}
                <div className="dashboard-slot slot-small" data-swapy-slot="slot-1">
                    <div className="dashboard-item" data-swapy-item="item-1">
                        <InsightCardSubtitle
                            title="Total Sales" 
                            value={dashboardData.totalSales.totalCotizaciones || 'N/A'} 
                            value2={"$"+dashboardData.totalSales.montoTotal.toFixed(2) || 'N/A'} 
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
                        <InsightCardImage 
                        imageUrl={dashboardData.topSeller?.fotoPerfil || 'N/A'}
                            title="Top Seller" 
                            value={dashboardData.topSeller?.nombre || 'N/A'} 
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
                            value={dashboardData.mostActiveSeller?.nombre || 'N/A'} 
                            icon="⚡"
                            color="#FF4560"
                        />
                    </div>
                </div>

                {/* Slot 4: Top Product */}
                <div className="dashboard-slot slot-small" data-swapy-slot="slot-4">
                    <div className="dashboard-item" data-swapy-item="item-4">
                        <InsightCardImage 
                            imageUrl={dashboardData.topProduct?.imagenUrl }
                            title="Top Product" 
                            value={dashboardData.topProduct?.nombre || 'N/A'} 
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
                            <div 
                                className="chart-container"
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                            >
                                <Graphic 
                                    data={dashboardData.salesData} 
                                    colors={{
                                        backgroundColor: 'transparent',
                                        lineColor: '#007aff',
                                        textColor: 'rgba(209, 213, 219, 0.92)',
                                        areaTopColor: '#007aff',
                                        areaBottomColor: 'rgba(0, 122, 255, 0.28)',
                                    }}
                                />
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
                            <div 
                                className="chart-container"
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                            >
                                <Graphic 
                                    data={[
                                        { time: '2023-01-01', value: 10 },
                                        { time: '2023-02-01', value: 15 },
                                        { time: '2023-03-01', value: 12 },
                                        { time: '2023-04-01', value: 20 },
                                        { time: '2023-05-01', value: 25 },
                                    ]} 
                                    colors={{
                                        backgroundColor: 'transparent',
                                        lineColor: '#6366f1',
                                        textColor: 'rgba(209, 213, 219, 0.92)',
                                        areaTopColor: '#6366f1',
                                        areaBottomColor: 'rgba(99, 102, 241, 0.28)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Dashboard;
