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
  // .parse((val: string) => parseInt(val))
  // .refine((val) => !isNaN(val as unknown as number)),
  ho_quantity: z.coerce.number().min(0, {
    message: "HO Quantity must greater than or equal to 0.",
  }),
  godown_quantity: z.coerce.number().min(0, {
    message: "Godown Quantity must greater than or equal to 0.",
  }),
});

export function StockForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // values.total_quantity = parseInt(values.total_quantity)
    // values.ho_quantity = parseInt(values.ho_quantity)
    // values.godown_quantity = parseInt(values.godown_quantity)
    console.log(values);

    const api = async (endpoint: string) => {
      const data = await fetch(endpoint, {
        method: "POST",
      });
      const jsonData = data.json();
      console.log(jsonData);
    };
    api("http://localhost:3000/api/stocks");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <FormField
          control={form.control}
          name="total_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Quantity</FormLabel>
              <FormControl>
                <Input placeholder="5" {...field} />
              </FormControl>
              <FormDescription>
                The Total Quantity of the stock (greater than or equal to 0).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ho_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HO Quantity</FormLabel>
              <FormControl>
                <Input placeholder="2" {...field} />
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
                <Input placeholder="3" {...field} />
              </FormControl>
              <FormDescription>
                The Godown Quantity of the stock (greater than or equal to 0).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
