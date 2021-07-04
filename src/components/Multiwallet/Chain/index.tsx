import React, { useState } from "react";

const ChainData = () => {
  return (
    <>
      <hr />

      <div id="network">
        <p>
          <strong>Connected blockchain:</strong> <span>{networkName}</span>
        </p>

        <p>
          <strong>Selected account:</strong> <span>{selectedAcc}</span>
        </p>
      </div>

      <hr />

      <h3>All account balances</h3>

      <table className="table table-listing">
        <thead>
          <th>Address</th>
          <th>ETH balance</th>
        </thead>

        <tbody id="accounts"></tbody>
      </table>

      <p>
        Please try to switch between different accounts in your wallet if your
        wallet supports this functonality.
      </p>
    </>
  );
};

export default ChainData;
