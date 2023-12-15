"use client";

import { Button } from "@ui/button";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Stock {
  id: number;
  hsn_code: string;
  stock_name: string;
  total_quantity: number;
  ho_quantity: number;
  godown_quantity: number;
}

interface transactionProps {
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

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const [currentTransactionID, setCurrentTransactionID] = useState(0);

  const searchParams = useSearchParams()!;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams);
  //     params.set(name, value);

  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  const createParams = (name: string, value: string) => {
    return `${name}=${value}`;
  };

  useEffect(() => {
    const api = async (endpoint: string) => {
      const data = await fetch(endpoint, {
        method: "GET",
      });
      const jsonData = await data.json();
      console.log(jsonData);
      setTransactions(jsonData);
    };

    api("http://localhost:9999/api/transactions");
    // api("https://jsonplaceholder.typicode.com/posts");
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 px-3 pt-5 pb-3">
        <Button asChild variant={"secondary"}>
          <Link href="/transactions/new">Create New Transaction</Link>
        </Button>
      </div>
      <div>
        {transactions.map((transaction: transactionProps) => {
          return (
            <>
              <div key={transaction.id} className="p-3 justify-evenly">
                <div className="grid grid-cols-3 gap-3 pt-5 px-5 bg-slate-900 rounded-t-xl">
                  <div>
                    <b>Invoice Number</b>: {transaction.invoice_number}
                  </div>
                  <div>
                    <b>Date</b>: {transaction.date}
                  </div>
                  <div>
                    <b>Status</b>: {transaction.status}
                  </div>
                  <div>
                    <b>Destination</b>: {transaction.destination}
                  </div>
                  <div>
                    <b>Supply</b>: {transaction.supply}
                  </div>
                  <div>
                    <b>Quantity</b>: {transaction.quantity}
                  </div>
                  {/* <div>
                    <b>HSN Referer</b>: {transaction.hsn_referer}
                  </div> */}
                </div>
                <div className="w-full p-5 bg-slate-900 ">Stock details:</div>
                <div className="grid grid-rows-2 w-full px-3 pb-3 bg-slate-900 rounded-b-xl">
                  <div className="grid grid-cols-1 px-2">
                    {formatStock(transaction.stock)}
                  </div>
                  <div className="grid grid-cols-2 gap-5 items-center justify-center px-5 pb-2">
                    <Button
                      asChild
                      onClick={() => {
                        setCurrentTransactionID(transaction.id);
                        handleOpenEdit();
                      }}
                      variant={"outline"}
                    >
                      <Link
                        href={
                          "/transactions/edit?" +
                          createParams("id", transaction.id.toString())
                        }
                      >
                        Edit
                      </Link>
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentTransactionID(transaction.id);
                        handleOpenDelete();
                      }}
                      variant={"outline"}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
              <Modal
                className="flex items-center justify-center bg-transparent"
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <div className="flex items-center justify-center bg-slate-900/90 w-1/6 h-1/6 rounded-md">
                  <Button
                    onClick={() => {
                      console.log("deleting: ", currentTransactionID);
                      fetch(
                        `http://localhost:9999/api/transactions/${currentTransactionID}`,
                        {
                          method: "DELETE",
                        }
                      );
                      handleCloseDelete();
                      window.location.reload();
                    }}
                    variant={"destructive"}
                  >
                    Delete
                  </Button>
                </div>
              </Modal>
            </>
          );
        })}
      </div>
    </>
  );
}
