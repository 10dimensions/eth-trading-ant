import { Tabs } from "antd";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import PastSwaps from "./PastSwaps";
import DailyData from "./DailyData";

import "./style.less";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  cache: new InMemoryCache()
});

const { TabPane } = Tabs;

const TradingData = () => (
  <ApolloProvider client={client}>
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
          <br />
          <br />
          <DailyData />
        </TabPane>
        <TabPane tab="Past Swaps" key="3">
          {"Last 100 Swaps (USD volume)"}
          <br />
          <br />
          <PastSwaps />
        </TabPane>
      </Tabs>
    </div>
  </ApolloProvider>
);

export default TradingData;
