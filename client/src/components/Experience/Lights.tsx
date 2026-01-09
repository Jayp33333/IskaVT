const Lights = () => (
  <>
    <ambientLight intensity={0.3} />
    <directionalLight position={[10, 20, 10]} intensity={1.8} color="#fff1e0" castShadow />
    <directionalLight position={[-15, 10, -10]} intensity={2.4} color="#e6f0ff" />
    <hemisphereLight intensity={0.5} groundColor="#b0c4de" />
  </>
);

export default Lights;
