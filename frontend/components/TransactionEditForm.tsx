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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";

import { Input } from "@ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Modal from "@mui/material/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

// interface stockProps {
//   hsn_code: string;
//   stock_name: string;
//   total_quantity: number;
//   ho_quantity: number;
//   godown_quantity: number;
// }

interface editProps {
  invoice_number: string;
  date: string;
  status: string;
  destination: string;
  supply: string;
  quantity: number;
  hsn_referer: string;
  // stock: stockProps;
}

const formSchema = z.object({
  invoice_number: z.string().min(3, {
    message: "Invoice Number must be at least 3 characters.",
  }),
  date: z.string().min(3, {
    message: "Date must be at least 3 characters.",
  }),
  hsn_referer: z.string().min(3, {
    message: "HSN Referer must be at least 3 characters.",
  }),
  destination: z.string().min(2, {
    message: "Destination must be at least 3 characters.",
  }),
  supply: z.string().min(2, {
    message: "Supply must be at least 3 characters.",
  }),
  // Status is dropdown
  status: z.string(),
  quantity: z.coerce.number().min(0, {
    message: "Quantity must greater than or equal to 0.",
  }),
});

export function TransactionEditForm({ id }: { id: number }) {
  // console.log(id);
  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const api = async (endpoint: string) => {
      const data = await fetch(endpoint, {
        method: "PUT",
      });
      const jsonData = data.json();
      console.log(jsonData);
    };
    api("http://localhost:3000/api/transactions/id/");
  }

  const [currentTransactionID, setCurrentTransactionID] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  // const s_id0: stockProps = {
  //   hsn_code: "HSN1A2B3C4D",
  //   stock_name: "Stock Name 1",
  //   total_quantity: 10,
  //   ho_quantity: 7,
  //   godown_quantity: 3,
  // };

  const id0: editProps = {
    invoice_number: "INV1A2B3C4D",
    date: "01/01/2000",
    status: "Transfer",
    destination: "HO",
    supply: "Godown",
    quantity: 11,
    hsn_referer: "HSN1A2B3C4D",
    // stock: s_id0,
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
        console.log("handlePrefillForm: ");
        console.log(jsonGetData);
        return jsonGetData;
      };
      getData(`http://localhost:3000/api/transactions/${id}`);
    } else {
      setEdit(id0);
      console.log("handlePrefillForm - using default id: ");
      console.log(id0);
      return id0;
    }
  }

  useEffect(() => {
    console.log("useEffect: ");
    console.log(id);
    handlePrefillForm(id);
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_number: edit.invoice_number,
      date: edit.date,
      status: edit.status,
      destination: edit.destination,
      supply: edit.supply,
      quantity: edit.quantity,
      hsn_referer: edit.hsn_referer,
    },
  });

  useEffect(() => {
    if (edit) {
      const {
        invoice_number,
        date,
        status,
        destination,
        supply,
        quantity,
        hsn_referer,
      } = edit;

      form.setValue("invoice_number", invoice_number);
      form.setValue("date", date);
      form.setValue("status", status);
      form.setValue("destination", destination);
      form.setValue("supply", supply);
      form.setValue("quantity", quantity);
      form.setValue("hsn_referer", hsn_referer);
    }
  }, [edit]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-5 px-5">
            <FormField
              control={form.control}
              name="invoice_number"
              render={() => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input
                      // defaultValue={edit.invoice_number}
                      value={form.getValues("invoice_number")}
                      placeholder={edit.invoice_number}
                      onChange={(e) => {
                        form.setValue("invoice_number", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the Invoice number for the transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={() => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input
                      // defaultValue={edit.destination}
                      value={form.getValues("destination")}
                      placeholder={edit.destination}
                      onChange={(e) => {
                        form.setValue("destination", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The Destination of the transaction shipment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={() => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      // defaultValue={edit.date}
                      value={form.getValues("date")}
                      placeholder={edit.date}
                      onChange={(e) => {
                        form.setValue("date", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The Date for the transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-4 gap-5 px-5">
            <FormField
              control={form.control}
              name="hsn_referer"
              render={() => (
                <FormItem>
                  <FormLabel>HSN Referer</FormLabel>
                  <FormControl>
                    <Input
                      // defaultValue={edit.hsn_referer}
                      value={form.getValues("hsn_referer")}
                      placeholder={edit.hsn_referer}
                      onChange={(e) => {
                        form.setValue("hsn_referer", e.target.value);
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
              name="quantity"
              render={() => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      // defaultValue={edit.quantity.toString()}
                      value={form.getValues("quantity")}
                      placeholder={edit.quantity.toString()}
                      onChange={(e) => {
                        form.setValue("quantity", parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The Quantity of the stock (greater than or equal to 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supply"
              render={() => (
                <FormItem>
                  <FormLabel>Supply</FormLabel>
                  <FormControl>
                    <Input
                      // defaultValue={edit.supply}
                      value={form.getValues("supply")}
                      placeholder={edit.supply}
                      onChange={(e) => {
                        form.setValue("supply", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The Quantity of the stock (greater than or equal to 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          // defaultValue={edit.invoice_number}
                          placeholder={edit.invoice_number}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Incoming">Incoming</SelectItem>
                      <SelectItem value="Outgoing">Outgoing</SelectItem>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The status of the stock being transacted.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-5 p-5">
            <Button
              onSubmit={() => {
                router.push("/transactions");
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                setCurrentTransactionID(id);
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
                console.log("deleting: ", currentTransactionID);
                fetch(
                  `http://localhost:3000/api/transactions/${currentTransactionID}`,
                  {
                    method: "DELETE",
                  }
                );
                handleCloseDelete();
                // router.push("/transactions");
              }}
              variant={"destructive"}
            >
              <Link href="/transactions">Delete</Link>
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}
