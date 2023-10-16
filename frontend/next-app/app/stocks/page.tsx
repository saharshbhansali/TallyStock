"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface stockResult {
  id: number;
  hsn_code: string;
  stock_name: string;
  total_quantity: number;
  ho_quantity: number;
  godown_quantity: number;
}

export default function Home() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const api = async (endpoint: string) => {
      const data = await fetch(endpoint, {
        method: "GET",
      });
      const jsonData = await data.json();
      // console.log(jsonData);
      setStocks(jsonData);
    };

    api("http://localhost:3000/api/stocks");
    // api("https://jsonplaceholder.typicode.com/posts");
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-5 px-3 pt-5 pb-3">
      <Button asChild variant={"secondary"}>
        <Link href="/stocks/new">Create New Stock</Link>
      </Button>
      <Button asChild variant={"secondary"}>
        <Link href="/stocks/edit">Edit Stock</Link>
      </Button>
      </div>

      <div className="grid grid-cols-5 justify-evenly px-5">
        <div>
          <b>HSN Code</b>
        </div>
        <div>
          <b>Stock Name</b>
        </div>
        <div>
          <b>Total Quantity</b>
        </div>
        <div>
          <b>HO Quantity</b>
        </div>
        <div>
          <b>Godown Quantity</b>
        </div>
      </div>
      <div className="px-5">
        {stocks.map((stock: stockResult) => {
          return (
            <>
              <div
                key={stock.id}
                className="grid grid-cols-5 justify-evenly gap-5 py-1"
              >
                <div>{stock.hsn_code}</div>
                <div>{stock.stock_name}</div>
                <div>{stock.total_quantity}</div>
                <div>{stock.ho_quantity}</div>
                <div>{stock.godown_quantity}</div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
