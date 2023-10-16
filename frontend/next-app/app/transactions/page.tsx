"use client";

import { Button } from "@ui/button";
import Image from "next/image";
import Link from "next/link";
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
  console.log(param);
  return (
    <>
      <div className="grid grid-flow-rows gap-3 px-3 py-1">
        <div className="row-span-1 grid grid-cols-3">
          <div>
            <b>HSN Code</b>: {param.hsn_code}
          </div>
          <div>
            <b>Stock Name</b>: {param.stock_name}
          </div>
        </div>
        <div className="row-span-3 grid grid-cols-3">
          <div>
            <b>Total Quantity</b>: {param.total_quantity}
          </div>
          <div>
            <b>HO Quantity</b>: {param.ho_quantity}
          </div>
          <div>
            <b>Godown Quantity</b>: {param.godown_quantity}
          </div>
        </div>
      </div>
    </>
  );
}

function formatTransaction(value: resultProps) {
  return (
    <div key={value.id} className="p-3 justify-evenly">
      <div className="grid grid-cols-3 gap-3 pt-5 px-5 bg-slate-900 rounded-t-xl">
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
      </div>
      <div className="w-full p-3 bg-slate-900 rounded-b-xl">
        <h3 className="px-2 pb-2">Stock details:</h3>
        {formatStock(value.stock)}
      </div>
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
      <div className="grid grid-cols-2 gap-5 px-3 pt-5 pb-35">
        <Button asChild variant={"secondary"}>
          <Link href="/transactions/new">Create New Transaction</Link>
        </Button>
        <Button asChild variant={"secondary"}>
          <Link href="/transactions/edit">Edit Transaction</Link>
        </Button>
      </div>
      <div>{result.map((value: resultProps) => formatTransaction(value))}</div>
    </>
  );
}
