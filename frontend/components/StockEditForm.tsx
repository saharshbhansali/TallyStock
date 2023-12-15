"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Modal from "@mui/material/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface editProps {
  hsn_code: string;
  stock_name: string;
  total_quantity: number;
  ho_quantity: number;
  godown_quantity: number;
}

const formSchema = z.object({
  hsn_code: z.string().min(3, {
    message: "HSN Code must be at least 3 characters.",
  }),
  stock_name: z.string().min(3, {
    message: "Stock Name must be at least 3 characters.",
  }),
  total_quantity: z.coerce.number().min(0, {
    message: "Total Quantity must greater than or equal to 0.",
  }),
  ho_quantity: z.coerce.number().min(0, {
    message: "HO Quantity must greater than or equal to 0.",
  }),
  godown_quantity: z.coerce.number().min(0, {
    message: "Godown Quantity must greater than or equal to 0.",
  }),
});

export function StockEditForm({ id }: { id: number }) {
  // console.log(id);
  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    const api = async (endpoint: string) => {
      const data = await fetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const jsonData = await data.json();
      console.log("onSubmit: ");
      console.log(jsonData);
    };
    api(`http://localhost:9999/api/stocks/${id}`);
  }

  const [currentStockID, setCurrentStockID] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const id0: editProps = {
    hsn_code: "HSN1A2B3C4D",
    stock_name: "Stock Name 1",
    total_quantity: 10,
    ho_quantity: 7,
    godown_quantity: 3,
  };

  const [ho_quantity, setHOQuantity] = useState(id0.ho_quantity);
  const [godown_quantity, setGodownQuantity] = useState(id0.godown_quantity);

  const handleTotalQuantity = (
    form_ho: number,
    form_godown: number,
    ho: number,
    godown: number
  ) => {
    if (form_ho && form_godown) {
      return Number(form_ho) + Number(form_godown);
    } else if (form_godown) {
      return Number(ho) + Number(form_godown);
    } else if (form_ho) {
      return Number(form_ho) + Number(godown);
    } else {
      return Number(ho) + Number(godown);
    }
  };

  const [edit, setEdit] = useState<editProps>(id0);

  function handlePrefillForm(id: number) {
    console.log(id);
    if (id > 0) {
      const getData = async (endpoint: string): Promise<editProps> => {
        const data = await fetch(endpoint, {
          method: "GET",
        });
        const jsonGetData = await data.json();
        setEdit(jsonGetData);
        setHOQuantity(edit.ho_quantity);
        setGodownQuantity(edit.godown_quantity);
        console.log("handlePrefillForm: ");
        console.log(jsonGetData);
        return jsonGetData;
      };
      getData(`http://localhost:9999/api/stocks/${id}`);
    } else {
      setEdit(id0);
      setHOQuantity(edit.ho_quantity);
      setGodownQuantity(edit.godown_quantity);
      console.log("handlePrefillForm - using default id: ");
      console.log(id0);
      return id0;
    }
  }

  useEffect(() => {
    handlePrefillForm(id);
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hsn_code: edit.hsn_code,
      stock_name: edit.stock_name,
      total_quantity: handleTotalQuantity(-1, -1, ho_quantity, godown_quantity),
      ho_quantity: edit.ho_quantity,
      godown_quantity: edit.godown_quantity,
    },
  });

  useEffect(() => {
    if (edit) {
      const {
        hsn_code,
        stock_name,
        total_quantity,
        ho_quantity,
        godown_quantity,
      } = edit;
      form.setValue("hsn_code", hsn_code);
      form.setValue("stock_name", stock_name);
      form.setValue("total_quantity", total_quantity);
      form.setValue("ho_quantity", ho_quantity);
      form.setValue("godown_quantity", godown_quantity);
    }
  }, [edit]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-5 px-5">
            <FormField
              control={form.control}
              name="hsn_code"
              render={() => (
                <FormItem>
                  <FormLabel>HSN Code</FormLabel>
                  <FormControl>
                    <Input
                      // defaultValue={edit.hsn_code}
                      value={form.getValues("hsn_code")}
                      placeholder={edit.hsn_code}
                      onChange={(e) => {
                        form.setValue("hsn_code", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the Unique HSN Code for the stock.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock_name"
              render={() => (
                <FormItem>
                  <FormLabel>Stock Name</FormLabel>
                  <FormControl>
                    <Input
                      // defaultValue={edit.stock_name}
                      value={form.getValues("stock_name")}
                      placeholder={edit.stock_name}
                      onChange={(e) => {
                        form.setValue("stock_name", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The Stock Name for a product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-5 px-5">
            <FormField
              control={form.control}
              name="ho_quantity"
              render={() => (
                <FormItem>
                  <FormLabel>HO Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      // defaultValue={edit.ho_quantity}
                      value={form.getValues("ho_quantity")}
                      placeholder={edit.ho_quantity.toString()}
                      onChange={(e) => {
                        form.setValue("ho_quantity", parseInt(e.target.value));
                        if (e.target.value) {
                          setHOQuantity(parseInt(e.target.value));
                        } else {
                          setHOQuantity(0);
                        }
                        form.setValue(
                          "total_quantity",
                          handleTotalQuantity(
                            form.getValues("ho_quantity"),
                            form.getValues("godown_quantity"),
                            ho_quantity,
                            godown_quantity
                          )
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The HO Quantity of the stock (greater than or equal to 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="godown_quantity"
              render={() => (
                <FormItem>
                  <FormLabel>Godown Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      // defaultValue={edit.godown_quantity}
                      value={form.getValues("godown_quantity")}
                      placeholder={edit.godown_quantity.toString()}
                      onChange={(e) => {
                        form.setValue(
                          "godown_quantity",
                          parseInt(e.target.value)
                        );
                        if (e.target.value) {
                          setGodownQuantity(parseInt(e.target.value));
                        } else {
                          setGodownQuantity(0);
                        }
                        form.setValue(
                          "total_quantity",
                          handleTotalQuantity(
                            form.getValues("ho_quantity"),
                            form.getValues("godown_quantity"),
                            ho_quantity,
                            godown_quantity
                          )
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The Godown Quantity of the stock (greater than or equal to
                    0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_quantity"
              render={() => (
                <FormItem>
                  <FormLabel>Total Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      readOnly
                      // defaultValue={handleTotalQuantity(
                      //   form.getValues("ho_quantity"),
                      //   form.getValues("godown_quantity"),
                      //   ho_quantity,
                      //   godown_quantity
                      // )}
                      value={handleTotalQuantity(
                        form.getValues("ho_quantity"),
                        form.getValues("godown_quantity"),
                        ho_quantity,
                        godown_quantity
                      )}
                      placeholder={edit.total_quantity.toString()}
                    />
                  </FormControl>
                  <FormDescription>
                    The Total Quantity of the stock (greater than or equal to
                    0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-5 p-5">
            <Button
              onSubmit={() => {
                router.push("/stocks");
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                setCurrentStockID(id);
                handleOpenDelete();
              }}
            >
              Delete
            </Button>
          </div>
        </form>
      </Form>
      <div>
        <Modal
          className="flex items-center justify-center bg-transparent"
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="flex items-center justify-center bg-slate-900/90 w-1/6 h-1/6 rounded-md">
            <Button
              type="submit"
              onClick={() => {
                console.log("deleting: ", currentStockID);
                fetch(`http://localhost:9999/api/stocks/${currentStockID}`, {
                  method: "DELETE",
                });
                handleCloseDelete();
                // router.push("/stocks");
              }}
              variant={"destructive"}
            >
              <Link href="/stocks">Delete</Link>
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}
