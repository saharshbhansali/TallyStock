import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function fetchStocks() {
      const response = await fetch("http://localhost:3000/api/transactions");
      const data = await response.json();
      console.log(data);
      setStocks(data);
    }

    fetchStocks();
  }, []);

  return (
    <>
      <div>{stocks}</div>
    </>
  );
}
