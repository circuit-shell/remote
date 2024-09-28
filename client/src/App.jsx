import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://192.168.3.102:8080"; // Replace with your actual local IP

function App() {
  const [lastAction, setLastAction] = useState("No action yet");
  const intervalRef = useRef(null);
  const [isMoving, setIsMoving] = useState(false);
  const [moveDirection, setMoveDirection] = useState(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startMoving = (direction) => {
    if (isMoving) return;
    setIsMoving(true);
    setMoveDirection(direction);
    moveMouseHandler(direction);
    intervalRef.current = setInterval(() => moveMouseHandler(direction), 5); // Adjust interval as needed
  };

  const stopMoving = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsMoving(false);
    setMoveDirection(null);
  };

  const moveMouseHandler = async (direction) => {
    let x = 0,
      y = 0;
    const distance = 20; // Adjust this value to change movement distance

    switch (direction) {
      case "up":
        y = -distance;
        break;
      case "down":
        y = distance;
        break;
      case "left":
        x = -distance;
        break;
      case "right":
        x = distance;
        break;
    }

    try {
      await axios.get(`${API_URL}/move`, { params: { x, y } });
      setLastAction(`Moving mouse ${direction}`);
    } catch (error) {
      console.error("Error moving mouse:", error);
      setLastAction(`Error moving mouse ${direction}`);
    }
  };

  const clickHandler = async (button) => {
    try {
      await axios.get(`${API_URL}/click`, { params: { button } });
      setLastAction(`Clicked ${button} button`);
    } catch (error) {
      console.error("Error clicking:", error);
      setLastAction(`Error clicking ${button} button`);
    }
  };

  const scrollHandler = async (direction) => {
    const amount = direction === "up" ? 5 : -5; // Adjust this value to change scroll amount
    try {
      await axios.get(`${API_URL}/scroll`, { params: { amount } });
      setLastAction(`Scrolled ${direction}`);
    } catch (error) {
      console.error("Error scrolling:", error);
      setLastAction(`Error scrolling ${direction}`);
    }
  };

  return (
    <div className="App">
      <h1>Mouse Control</h1>
      <div className="control-panel">
        <div className="d-pad">
          <button
            className={`d-pad-up ${moveDirection === "up" ? "active" : ""}`}
            onMouseDown={() => startMoving("up")}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
            onTouchStart={() => startMoving("up")}
            onTouchEnd={stopMoving}
          >
            ▲
          </button>
          <button
            className={`d-pad-left ${moveDirection === "left" ? "active" : ""}`}
            onMouseDown={() => startMoving("left")}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
            onTouchStart={() => startMoving("left")}
            onTouchEnd={stopMoving}
          >
            ◀
          </button>
          <button
            className={`d-pad-right ${moveDirection === "right" ? "active" : ""}`}
            onMouseDown={() => startMoving("right")}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
            onTouchStart={() => startMoving("right")}
            onTouchEnd={stopMoving}
          >
            ▶
          </button>
          <button
            className={`d-pad-down ${moveDirection === "down" ? "active" : ""}`}
            onMouseDown={() => startMoving("down")}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
            onTouchStart={() => startMoving("down")}
            onTouchEnd={stopMoving}
          >
            ▼
          </button>
        </div>
        <div className="action-buttons">
          <button onClick={() => clickHandler("left")}>Left Click</button>
          <button onClick={() => clickHandler("right")}>Right Click</button>
          <button onClick={() => scrollHandler("up")}>Scroll Up</button>
          <button onClick={() => scrollHandler("down")}>Scroll Down</button>
        </div>
      </div>
      <p>Last action: {lastAction}</p>
    </div>
  );
}

export default App;
