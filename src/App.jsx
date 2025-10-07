// src/App.jsx
import React, { useEffect, useState } from "react";
import socket from "./socket.js";  // 🔥 fontos a .js kiterjesztés

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // ha érkezik üzenet a szervertől
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // cleanup, hogy ne duplikálódjon a listener
    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      socket.emit("chat message", input); // küldés a szervernek
      setInput(""); // input törlése
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>💬 Chat teszt</h2>

      <div
        style={{
          border: "1px solid #555",
          borderRadius: "5px",
          padding: "10px",
          height: "250px",
          overflowY: "auto",
          marginBottom: "10px",
          background: "#f9f9f9",
        }}
      >
        {messages.length === 0 && <p style={{ color: "#777" }}>Nincs üzenet...</p>}
        {messages.map((m, i) => (
          <p key={i} style={{ margin: "5px 0" }}>
            {m}
          </p>
        ))}
      </div>

      <input
        style={{
          padding: "8px",
          width: "70%",
          marginRight: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Írj üzenetet..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        style={{
          padding: "8px 15px",
          background: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={sendMessage}
      >
        Küldés
      </button>
    </div>
  );
}

export default App;
