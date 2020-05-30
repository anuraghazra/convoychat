import React from "react";

const ConvoyLogo = ({ ...props }) => {
  return (
    <div {...props}>
      <h2 style={{ fontWeight: 600 }}>
        Convoy<span className="textcolor--primary">Chat</span>
      </h2>
      <small>Lets take over the world</small>
    </div>
  );
};

export default ConvoyLogo;
