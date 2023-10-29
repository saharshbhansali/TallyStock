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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const api = async (endpoint: string) => {
      const data = await fetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const jsonData = await data.json();
      console.log(jsonData);
    };
    api(`http://localhost:3000/api/stocks/${id}`);
  }

  const id0: editProps = {
    hsn_code: "HSN1234",
    stock_name: "StockName1",
    total_quantity: 5,
    ho_quantity: 2,
    godown_quantity: 3,
  };
  const [edit, setEdit] = useState<editProps>(id0);

  const editData = async (endpoint: string): Promise<editProps> => {
    const data = await fetch(endpoint, {
      method: "GET",
    });
    const jsonEditData = await data.json();
    // setEdit(jsonEditData);
    console.log(jsonEditData);
    return jsonEditData;
  };

  useEffect(() => {
    async () => {
      if (id !== 0) {
        const editDataResponse = await editData(
          `http://localhost:3000/api/stocks/${id}`
        );
        console.log(editDataResponse);
        setEdit(editDataResponse);
        // return editDataResponse;
      }
    };
  }, [id]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-5 px-5">
            <FormField
              control={form.control}
              name="hsn_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HSN Code</FormLabel>
                  <FormControl>
                    <Input placeholder={edit?.hsn_code} {...field} />
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Name</FormLabel>
                  <FormControl>
                    <Input placeholder={edit?.stock_name} {...field} />
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HO Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={edit?.ho_quantity.toString()}
                      {...field}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Godown Quantity</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={edit?.godown_quantity.toString()}
                      {...field}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Quantity</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={edit?.total_quantity.toString()}
                      {...field}
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
            <Button type="submit">Edit</Button>
            <Button
              onClick={() => {
                const api = async (endpoint: string) => {
                  const data = await fetch(endpoint, {
                    method: "PUT",
                  });
                  const jsonData = data.json();
                  console.log(jsonData);
                };
                api("http://localhost:3000/api/stocks/id/");
              }}
            >
              Delete
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
