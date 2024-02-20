import React from "react";
import "./style.css";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-images">
        <div
          className="footer-block"
          onClick={() => {
            window.open("https://www.google.com", "_");
          }}
        >
         
        </div>
      </div>
      <p className="rights">All Rights Reserved By BTCC</p>
    </div>
  );
};

export default Footer;
