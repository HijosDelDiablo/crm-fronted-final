import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 9999,
                padding: "10px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "var(--shadow-strong)",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
            }}
            aria-label="Toggle Theme"
        >
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    );
}
