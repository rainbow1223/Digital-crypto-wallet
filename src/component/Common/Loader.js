import * as React from "react";

const Loader = () => {
  return (
    <div className="spinner">
      <lottie-player
        src="https://assets4.lottiefiles.com/private_files/lf30_MK1ZRw.json"
        background="transparent"
        speed="1"
        style={{ width: "300px", height: "200px" }}
        loop
        autoplay
      ></lottie-player>
    </div>
  );
};

export default Loader;
