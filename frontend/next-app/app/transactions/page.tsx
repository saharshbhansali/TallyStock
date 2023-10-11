"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Stock {
  id: number;
  hsn_code: string;
  stock_name: string;
  total_quantity: number;
  ho_quantity: number;
  godown_quantity: number;
}

interface resultProps {
  id: number;
  invoice_number: string;
  date: string;
  destination: string;
  status: string;
  hsn_referer: string;
  stock: Stock;
  supply: string;
  quantity: number;
}

function formatStock(param: Stock) {
  return (
    <div className="flex flex-row bg-slate-800 gap-5">
      <div>
        <b>HSN Code</b>: {param.hsn_code}
      </div>
      <div>
        <b>Stock Name</b>: {param.stock_name}
      </div>
      {/* <div>
        <b>Total Quantity</b>: 
        {param.total_quantity}
      </div>
      <div>
        <b>HO Quantity</b>: {param.ho_quantity}
      </div>
      <div>
        <b>Godown Quantity</b>: {param.godown_quantity}
      </div> */}
    </div>
  );
}

export default function Home() {
  const [result, setResult] = useState([]);

  useEffect(() => {
    const api = async (endpoint: string) => {
      const data = await fetch(endpoint, {
        method: "GET",
      });
      const jsonData = await data.json();
      console.log(jsonData);
      setResult(jsonData);
    };

    api("http://localhost:3000/api/transactions");
    // api("https://jsonplaceholder.typicode.com/posts");
  }, []);

  return (
    <>
      <div>
        {result.map((value: resultProps) => {
          return (
            <div key={value.id}>
              <div>
                <b>Invoice Number</b>: {value.invoice_number}
              </div>
              <div>
                <b>Date</b>: {value.date}
              </div>
              <div>
                <b>Status</b>: {value.status}
              </div>
              <div>
                <b>Destination</b>: {value.destination}
              </div>
              <div>
                <b>Supply</b>: {value.supply}
              </div>
              <div>
                <b>Quantity</b>: {value.quantity}
              </div>
              {/* <div>
                <b>HSN Referer</b>: {value.hsn_referer}
              </div> */}
              <div>
                <h3>Stock details:</h3>
                {formatStock(value.stock)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
