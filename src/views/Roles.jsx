import React, { useState, useEffect } from "react";

export default function Roles() {
  return (
    <div className="container-fluid">
      <div className="container h-100 p-0">
        <h1 className="mt-3">Roles</h1>

        <div
          style={{
            borderRadius: "5px",
            background: "#F0F0F0",
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
            gap: "10px",
            padding: "10px",
            width: "100%",
            height: "700px",
          }}
        >

        </div>
      </div>
    </div>
  );
}
