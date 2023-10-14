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
      <Button asChild variant={"secondary"}>
          <Link href="/stocks/new">Create New</Link>
        </Button>
      <div className="flex flex-row justify-evenly gap-5">
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
      <div className="">
        {stocks.map((stock: stockResult) => {
          return (
            <>
              <div
                key={stock.id}
                className="flex flex-row justify-evenly gap-5"
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
