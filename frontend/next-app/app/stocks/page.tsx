"use client";

import { Button } from "@ui/button";
import Modal from "@mui/material/Modal";
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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [currentStockID, setCurrentStockID] = useState(0);

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
      <div className="grid grid-cols-1 gap-5 px-3 pt-5 pb-3">
        <Button asChild variant={"secondary"}>
          <Link href="/stocks/new">Create New Stock</Link>
        </Button>
      </div>

      <div className="grid grid-cols-7 justify-evenly px-5">
        <div>
          <b>HSN Code</b>
        </div>
        <div>
          <b>Stock Name</b>
        </div>
        <div>
          <b>Total</b>
        </div>
        <div>
          <b>HO </b>
        </div>
        <div>
          <b>Godown </b>
        </div>
        {/* <div>
          <b>Edit</b>
        </div>
        <div>
          <b>Delete</b>
        </div> */}
      </div>
      <div className="px-5">
        {stocks.map((stock: stockResult) => {
          return (
            <>
              <div
                key={stock.id}
                className="grid grid-cols-7 justify-evenly gap-5 py-1"
              >
                <div>{stock.hsn_code}</div>
                <div>{stock.stock_name}</div>
                <div>{stock.total_quantity}</div>
                <div>{stock.ho_quantity}</div>
                <div>{stock.godown_quantity}</div>
                <div>
                  <Link href="/stocks/edit">Edit</Link>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setCurrentStockID(stock.id);
                      handleOpen();
                    }}
                    variant={"outline"}
                  >
                    Delete
                  </Button>
                </div>
              </div> 
            </>
          );
        })}
      </div>
      <Modal
        className="flex items-center justify-center bg-transparent"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex items-center justify-center bg-slate-900/90 w-1/6 h-1/6 rounded-md">
          <Button onClick={() => {
            console.log("deleting: ", currentStockID)
            fetch(`http://localhost:3000/api/stocks/${currentStockID}`, {
              method: "DELETE"
            })
            handleClose();
            window.location.reload()
          }} variant={"destructive"}>Delete</Button>
        </div>
      </Modal>
    </>
  );
}
