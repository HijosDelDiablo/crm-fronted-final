import React from "react";

const InsightCardImage = ({
  imageUrl,
  title,
  value,
  icon,
  trend,
  trendValue,
  color = "var(--primary)",
}) => {
  const showTrend = trend && trendValue;

  return (
    <div
      className="insight-card"
      style={{
        borderLeft: `4px solid ${color}`,
        padding: "0.9rem 1rem 1rem",
        borderRadius: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
      }}
    >
      {/* Imagen centrada */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: "55%",
            maxHeight: "120px",
            objectFit: "cover",
            display: "block",
            margin: "0 auto 0.6rem auto",
            borderRadius: "12px",
            boxShadow: "0 8px 22px rgba(15, 23, 42, 0.18)",
          }}
        />
      )}

      {/* Título + icono */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            margin: 0,
          }}
        >
          {title}
        </h3>

        {icon && (
          <span
            style={{
              fontSize: "1.1rem",
              color,
              lineHeight: 1,
            }}
          >
            {icon}
          </span>
        )}
      </div>

      {/* Valor principal */}
      <div
        className="insight-value"
        style={{
          fontSize: "1.05rem",
          fontWeight: 700,
          marginTop: "0.1rem",
        }}
      >
        {value}
      </div>

      {/* Tendencia (opcional) */}
      {showTrend && (
        <div
          className="insight-trend"
          style={{
            marginTop: "0.1rem",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            color: trend === "up" ? "#00E396" : "#FF4560",
          }}
        >
          <span style={{ marginRight: 4 }}>{trend === "up" ? "▲" : "▼"}</span>
          <span>{trendValue}</span>
          <span
            style={{
              marginLeft: 6,
              color: "rgba(156, 163, 175, 0.95)",
            }}
          >
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default InsightCardImage;
