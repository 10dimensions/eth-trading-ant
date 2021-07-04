import { Tabs } from "antd";
import "./style.less";

const { TabPane } = Tabs;

const TradingData = () => (
  <div className="tabs-pane">
    <Tabs
      style={{
        backgroundColor: "black",
        color: "pink",
        borderRadius: 10,
        height: "70%",
        width: 500,
        fontSize: 20
      }}
      defaultActiveKey="1"
      centered
    >
      <TabPane tab="Pair Overview" key="1">
        {"ETH<>DAI"}
      </TabPane>
      <TabPane tab="Daily Data" key="2">
        {"Trends"}
      </TabPane>
      <TabPane tab="Past Swaps" key="3">
        {"Last 100"}
      </TabPane>
    </Tabs>
  </div>
);

export default TradingData;
