import { Html } from "@react-three/drei";

export type DialogOption = {
  label: string;
  onClick: () => void;
};

type NPCDialogProps = {
  open: boolean;
  title: string;
  message: string;
  options?: DialogOption[];
  onClose: () => void;
  position?: [number, number, number];
};

export const NPCDialog = ({
  open,
  title,
  message,
  options,
  onClose,
  position = [0, 2, 0],
}: NPCDialogProps) => {
  if (!open) return null;

  return (
    <Html position={position} center>
      <div
        style={{
          background: "rgba(20,20,30,0.95)",
          color: "#fff",
          padding: "12px 18px",
          borderRadius: "15px",
          width: "320px",
          maxWidth: "90vw",
          textAlign: "left",
          fontFamily: "sans-serif",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>{title}</h3>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5" }}>{message}</p>

        {options && options.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {options.map((opt, i) => (
              <button
                key={i}
                style={{
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "0.2s",
                }}
                onClick={opt.onClick}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#eee")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{
                background: "#fff",
                color: "#000",
                border: "none",
                padding: "5px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Html>
  );
};
