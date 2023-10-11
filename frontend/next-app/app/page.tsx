"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Stock {
  id: number;
  hsn_code: string;
  name: string;
  total_quantity: number;
}

const Stock = (stock: Stock) => {
  return (
    <>
      <div>
        <ul>
          <li>
            <b>HSN Code</b>: {stock.hsn_code}{" "}
          </li>
          <li>
            <b>Name</b>: {stock.name}{" "}
          </li>
          <li>
            <b>Total Quantity</b>: {stock.total_quantity}{" "}
          </li>
        </ul>
      </div>
    </>
  );
};

export default function Home() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function fetchStocks() {
      const response = await fetch(
        // "https://jsonplaceholder.typicode.com/posts"
        "http://localhost:3000/api/stocks"
      );
      const data = await response.json();
      console.log(data);
      setStocks(data);
    }

    fetchStocks();
  }, []);

  return (
    <>
      <div>{stocks.map((stock:Stock) => (
        <Stock key={stock.id} {...stock}/>
      ))}</div>
    </>
  );
}
