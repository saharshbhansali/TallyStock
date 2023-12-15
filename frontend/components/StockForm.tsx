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
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export function StockForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // console.log(typeof values);

    const api = async (endpoint: string) => {
      const data = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const jsonData = await data.json();
      console.log(jsonData);
    };
    api("http://localhost:9999/api/stocks/");
  }

  const [ho_quantity, setHOQuantity] = useState(0);
  const [godown_quantity, setGodownQuantity] = useState(0);

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

  return (
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
                  <Input placeholder="HSN103AF39" {...field} />
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
                  <Input placeholder="Stock 1" {...field} />
                </FormControl>
                <FormDescription>The Stock Name for a product.</FormDescription>
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
                    placeholder="2"
                    onInput={() => {
                      setHOQuantity(form.getValues("ho_quantity"));
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
                    type="number"
                    placeholder="3"
                    onInput={() => {
                      setGodownQuantity(form.getValues("godown_quantity"));
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
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The Godown Quantity of the stock (greater than or equal to 0).
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
                    placeholder="5"
                    type="number"
                    readOnly
                    value={handleTotalQuantity(
                      form.getValues("ho_quantity"),
                      form.getValues("godown_quantity"),
                      ho_quantity,
                      godown_quantity
                    )}
                  />
                </FormControl>
                <FormDescription>
                  The Total Quantity of the stock (greater than or equal to 0).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="gap-5 p-5">
          <Button
            onSubmit={() => {
              router.push("/stocks");
            }}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
