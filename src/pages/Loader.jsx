import loader from "../assets/loader.gif";

function Loader() {
  return (
    <div style={{ minBlockSize: "100vh", position: "relative" }}>
      <img
        src={loader}
        alt=""
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
export default Loader;
