import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  function onStart() {
    navigate("/experience");
  }
  return (
    <div
      style={{
        background: "#0e0e0e",
        color: "white",
        position: "absolute",
        inset: 0,
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          PUP Lopez Campus Virtual Tour
        </h1>

        <p style={{ maxWidth: "600px", fontSize: "1.2rem", opacity: 0.8 }}>
          Explore the school in a fully immersive 3D environment. Navigate
          through classrooms, offices, and facilities with a guided virtual
          experience.
        </p>

        <button
          onClick={onStart}
          style={{
            marginTop: "2rem",
            padding: "12px 32px",
            fontSize: "1.2rem",
            background: "#1e90ff",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Enter Experience
        </button>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Key Features
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Interactive 3D Navigation
            </h3>
            <p style={{ opacity: 0.8 }}>
              Walk through classrooms, hallways, and campus facilities with
              ease. Click on points of interest to learn more about each area.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Realistic Environment
            </h3>
            <p style={{ opacity: 0.8 }}>
              Experience realistic 3D models of the school, including textures,
              lighting, and objects that make you feel like you are actually
              there.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Information Points
            </h3>
            <p style={{ opacity: 0.8 }}>
              Click on classrooms, labs, or offices to get more information
              about courses, staff, and facilities. Ideal for new students or
              visitors.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        style={{
          background: "#1a1a1a",
          padding: "80px 20px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          About the Virtual Tour
        </h2>
        <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
          The Campus AR Virtual Tour was designed to give students, parents, and
          visitors a realistic view of the school from anywhere in the world. By
          using cutting-edge 3D technology, we provide an immersive experience
          where you can explore classrooms, offices, sports facilities, and
          common areas. The virtual tour helps you familiarize yourself with the
          campus, plan your visit, and make informed decisions without needing
          to be physically present.
        </p>
      </section>

      {/* Call-to-Action Section */}
      <section
        style={{
          padding: "80px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Ready to Explore?
        </h2>
        <p style={{ maxWidth: "600px", fontSize: "1.2rem", opacity: 0.8 }}>
          Dive into the fully interactive 3D environment and explore the campus
          like never before.
        </p>
        <button
          onClick={onStart}
          style={{
            marginTop: "2rem",
            padding: "12px 32px",
            fontSize: "1.2rem",
            background: "#1e90ff",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Enter Experience
        </button>
      </section>
    </div>
  );
}
