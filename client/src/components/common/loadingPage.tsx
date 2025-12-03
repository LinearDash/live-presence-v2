
type LoadingPageProps = {
    message?: string;
    subtitle?: string;
};


export default function LoadingPage({ message = "Loading…", subtitle }: LoadingPageProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                background: "linear-gradient(180deg,#ffffff,#f3f6fb)",
                color: "#0f172a",
                fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    background: "rgba(255,255,255,0.8)",
                    borderRadius: 12,
                    padding: "20px 24px",
                    boxShadow: "0 6px 18px rgba(12, 20, 40, 0.08)",
                    backdropFilter: "saturate(120%) blur(6px)",
                }}
            >
                <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <g fill="none" fillRule="evenodd" strokeWidth="4">
                        <circle cx="22" cy="22" r="18" stroke="#e6eef9" />
                        <path stroke="#2563eb" strokeLinecap="round" d="M40 22a18 18 0 00-18-18">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 22 22"
                                to="360 22 22"
                                dur="0.9s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                </svg>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{message}</div>
                    {subtitle ? (
                        <div style={{ marginTop: 4, fontSize: 13, color: "#64748b" }}>{subtitle}</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}