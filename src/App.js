import React, { useState, useEffect } from "react";
import SalesLog from "./Pages/SalesLog";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("https://backend-opal-rho.vercel.app/tasks");
        setData(response.data); // Ensure the response data matches your expectations
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <SalesLog data={data} />
    </div>
  );
}

export default App;
