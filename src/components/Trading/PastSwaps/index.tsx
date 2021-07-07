import React from "react";
import { useQuery, gql } from "@apollo/client";
import Charts from "../Charts";

let query = gql`
  query Swaps($pair: String) {
    swaps(orderBy: timestamp, orderDirection: desc, where: { pair: $pair }) {
      pair {
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
  }
`;

const PastSwaps = () => {
  const { loading, error, data } = useQuery(query, {
    variables: { pair: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11" }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const data2 = data.swaps.map((swap, index) => {
    return {
      index: index + 1,
      amountUSD: Math.floor(swap.amountUSD)
    };
  });

  console.log(data2);

  return <Charts xField={"index"} yField={"amountUSD"} data={data2} />;
};

export default PastSwaps;
