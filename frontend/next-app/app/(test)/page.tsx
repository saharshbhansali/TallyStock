"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface resultProps {
  id: number;
  userID: number;
  title: string;
  body: string;
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

    api("https://jsonplaceholder.typicode.com/posts");
  }, []);

  return (
    <>
      <div>
        {result.map((value: resultProps) => {
          return (
            <div key={value.id}>
              <div>
                <b>UserID</b>: {value.userID}
              </div>
              <div>
                <b>Title</b>: {value.title}
              </div>
              <div>
                <b>Body</b>: {value.body}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
