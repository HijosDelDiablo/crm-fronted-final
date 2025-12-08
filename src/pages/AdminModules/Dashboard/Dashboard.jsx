import { useEffect, useRef, useState } from "react";
import { createSwapy } from "swapy";
import Graphic from "./Graphic";
import InsightCard from "./InsightCard";
import InsightCardSubtitle from "./InsightCardSubtitle";
import InsightCardImage from "./InsightCardImage";
import {
  getSalesReport,
  getTopProducts,
  getTopSellers,
  getSellerWithMoreActivity,
  getTopSalesByPeriod,
  getDashboardStats,
} from "../../../api/statistics.api";
import "./Dashboard.css";

// CORREGIDO: importar Sidebar correctamente
import Sidebar from "../../../components/layout/Sidebar";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const swapyRef = useRef(null);
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    salesData: [],
    topProduct: null,
    topSeller: null,
    mostActiveSeller: null,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const lastThreeMonths = new Date(
        today.getFullYear(),
        today.getMonth() - 3,
        1
      );
      const formattedStart = lastThreeMonths.toISOString().split("T")[0];
      const formattedEnd = today.toISOString().split("T")[0];

      try {
        const [
          salesByPeriod,
          salesReport,
          topProducts,
          topSellers,
          activeSeller,
          dashboardStats,
        ] = await Promise.all([
          getTopSalesByPeriod(navigate),
          getSalesReport(formattedStart, formattedEnd, navigate),
          getTopProducts(navigate),
          getTopSellers(navigate),
          getSellerWithMoreActivity(navigate),
          getDashboardStats(navigate),
        ]);

        const chartData =
          salesByPeriod.map((item) => {
            let fecha = new Date(item.createdAt);
            let formatedDate = fecha.toISOString().split("T")[0];
            return {
              time: formatedDate,
              value: parseInt(item.cotizacion.totalPagado.toFixed(2)),
            };
          }) || [];

        chartData.sort((a, b) => new Date(a.time) - new Date(b.time));

        setDashboardData({
          totalSales: salesReport || 0,
          salesData: chartData,
          topProduct: topProducts?.[0],
          topSeller: topSellers?.[0],
          mostActiveSeller: activeSeller,
          stats: dashboardStats,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (swapyRef.current) {
      const swapy = createSwapy(swapyRef.current, {
        animation: "dynamic",
      });

      return () => {
        swapy.destroy();
      };
    }
  }, [dashboardData.loading]);

  if (dashboardData.loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR CORRECTO */}
      <Sidebar />

      <div className="dashboard-container" ref={swapyRef}>
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Overview of your sales and performance</p>
        </div>

        <div className="dashboard-grid">
          {/* Slot 1 */}
          <div className="dashboard-slot slot-small" data-swapy-slot="slot-1">
            <div className="dashboard-item" data-swapy-item="item-1">
              <InsightCardSubtitle
                title="Total Sales"
                value={dashboardData.totalSales?.totalCotizaciones || "0"}
                value2={
                  "$" + (dashboardData.totalSales?.montoTotal?.toFixed(2) || "0.00")
                }
                icon="💰"
                trend="up"
                trendValue="12%"
                color="#00E396"
              />
            </div>
          </div>

          {/* Slot 2 */}
          <div className="dashboard-slot slot-small" data-swapy-slot="slot-2">
            <div className="dashboard-item" data-swapy-item="item-2">
              <InsightCardImage
                imageUrl={dashboardData.topSeller?.fotoPerfil || "N/A"}
                title="Top Seller"
                value={dashboardData.topSeller?.nombre || "N/A"}
                icon="🏆"
                color="#FEB019"
              />
            </div>
          </div>

          {/* Slot 3 */}
          <div className="dashboard-slot slot-small" data-swapy-slot="slot-3">
            <div className="dashboard-item" data-swapy-item="item-3">
              <InsightCardImage
                imageUrl={dashboardData.mostActiveSeller?.fotoPerfil || "N/A"}
                title="Most Active"
                value={dashboardData.mostActiveSeller?.nombre || "N/A"}
                icon="⚡"
                color="#FF4560"
              />
            </div>
          </div>

          {/* Slot 4 */}
          <div className="dashboard-slot slot-small" data-swapy-slot="slot-4">
            <div className="dashboard-item" data-swapy-item="item-4">
              <InsightCardImage
                imageUrl={dashboardData.topProduct?.imagenUrl}
                title="Top Product"
                value={dashboardData.topProduct?.nombre || "N/A"}
                icon="📦"
                color="#775DD0"
              />
            </div>
          </div>

          {/* Slot 5 */}
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
                      backgroundColor: "transparent",
                      lineColor: "#007aff",
                      textColor: "rgba(209, 213, 219, 0.92)",
                      areaTopColor: "#007aff",
                      areaBottomColor: "rgba(0, 122, 255, 0.28)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Slot 6 */}
          <div className="dashboard-slot slot-medium" data-swapy-slot="slot-6">
            <div className="dashboard-item" data-swapy-item="item-6">
              <div className="chart-card">
                <h3>Activity Trend</h3>
                <div
                  className="chart-container"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <Graphic
                    data={[
                      { time: "2023-01-01", value: 10 },
                      { time: "2023-02-01", value: 15 },
                      { time: "2023-03-01", value: 12 },
                      { time: "2023-04-01", value: 20 },
                      { time: "2023-05-01", value: 25 },
                    ]}
                    colors={{
                      backgroundColor: "transparent",
                      lineColor: "#6366f1",
                      textColor: "rgba(209, 213, 219, 0.92)",
                      areaTopColor: "#6366f1",
                      areaBottomColor: "rgba(99, 102, 241, 0.28)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
