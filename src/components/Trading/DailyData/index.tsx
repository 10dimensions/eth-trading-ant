import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import Charts from "../Charts";

let query = gql`
  query PairDayDatas($pair: String, $date_gt: Int) {
    pairDayDatas(
      first: 100
      orderBy: date
      orderDirection: asc
      where: { pairAddress: $pair, date_gt: $date_gt }
    ) {
      date
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolumeUSD
      reserveUSD
    }
  }
`;

const getUnixTime = () => {
  var d: Date = new Date();
  d.setDate(d.getDate() - 100);

  return Math.round(+d / 1000);
};

const DailyData = () => {
  const [skip, setSkip] = useState(false);

  const [date_gt, setDate_gt] = useState(getUnixTime());
  let pair = "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11";
  console.log(date_gt);
  const { loading, error, data } = useQuery(query, {
    variables: {
      pair,
      date_gt
    },
    skip: skip
  });

  // useEffect(() => {
  //   // check whether data exists
  //   if (!loading && !!data) {
  //   setSkip(true);
  //   }
  // }, [loading, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  const data2 = data.pairDayDatas.map((dayData, index) => {
    return {
      index: index + 1,
      dailyVolumeUSD: Math.floor(dayData.dailyVolumeUSD)
    };
  });

  console.log(data2);

  if (data) {
    return <Charts xField={"index"} yField={"dailyVolumeUSD"} data={data2} />;
  } else {
    return null;
  }
};

export default DailyData;
