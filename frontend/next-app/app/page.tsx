"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface resultProps {
  id: number;
  hsn_code: string;
  stock_name: string;
  total_quantity: number;
  // userID: number;
  // title: string;
  // body: string;
}

export default function Home() {
  const [result, setResult] = useState([]);

  useEffect(() => {
    const api = async (endpoint: string) => {
      const data = await fetch(endpoint, {
        method: "GET",
      });
      const jsonData = await data.json();
      console.log(data);
      setResult(jsonData);
    };

    api("http://localhost:3000/api/stocks");
    // api("https://jsonplaceholder.typicode.com/posts");
  }, []);

  return (
    <>
      <div>
        {result.map((value: resultProps) => {
          return (
            <div key={value.id}>
              <div>
                <b>HSN Code</b>: {value.hsn_code}
              </div>
              <div>
                <b>Stock Name</b>: {value.stock_name}
              </div>
              <div>
                <b>Total Quantity</b>: {value.total_quantity}
              </div>
              {/* <div>
                <b>UserID</b>: {value.userID}
              </div>
              <div>
                <b>Title</b>: {value.title}
              </div>
              <div>
                <b>Body</b>: {value.body}
              </div> */}
            </div>
          );
        })}
      </div>
    </>
  );
}
