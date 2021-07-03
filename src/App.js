import React from "react";
import "./style.css";
import "antd/dist/antd.css";

import EthLayer from "./components/EthLayer";

export default function App() {
  return (
    <div>
      <h2>Ethereum Trading - Ant Design Widgets</h2>
      <EthLayer />
      {/* <p>Start editing to see some magic happen :)</p> */}
    </div>
  );
}
