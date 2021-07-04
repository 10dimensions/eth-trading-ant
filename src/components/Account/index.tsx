import React from "react";
import { Card } from "antd";
import "./style.less";

import logo from "../../assets/map";

type PropTypes = {
  account: AccountType;
};

export default function Account({ account }: PropTypes) {
  return (
    <>
      <Card
        title={"Account Card"}
        extra={<a href="#">More</a>}
        headStyle={{ color: "pink" }}
        style={{
          width: 300,
          backgroundColor: "black",
          color: "pink",
          borderRadius: 10,
          height: "70%"
        }}
      >
        <div className="account">
          <div className="address">
            <label>Address </label>
            <span>{account.address}</span>
          </div>
          <div className="balance">
            <img className="token-logo-img" src={logo["ETH"]} alt="" />
            <div className="balance-value">
              {account.balance.substring(0, 7)}
            </div>
            <div className="token-logo">{", ETH"}</div>
          </div>
          <div className="tokens">
            {account.tokens.map((token) => {
              return (
                <div className="token" key={token.token}>
                  <div className="balance">
                    <img
                      className="token-logo-img"
                      src={logo[token.token]}
                      alt=""
                    />
                    <div className="balance-value">
                      {token.balance.substring(0, 7)}
                    </div>
                    <div className="token-logo">{", " + token.token}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </>
  );
}
