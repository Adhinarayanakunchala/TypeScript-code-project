import React from "react";
import { Circles } from "react-loader-spinner";
import LoadClasses from "./loader.module.scss";

function Loader() {
  return (
    <div className={LoadClasses["Loader-wrapper"]}>
      <div className={LoadClasses["loader"]}>
        <Circles color="#ed334d" height={80} width={80} />
      </div>
    </div>
  );
}

export default Loader;
