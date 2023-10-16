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
  destination: z.string().min(3, {
    message: "Destination must be at least 3 characters.",
  }),
  supply: z.string(),
  // Status is dropdown
  status: z.string(),
  quantity: z.coerce.number().min(0, {
    message: "Quantity must greater than or equal to 0.",
  }),
});

export function TransactionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const api = async (endpoint: string) => {
      const data = await fetch(endpoint, {
        method: "POST",
      });
      const jsonData = data.json();
      console.log(jsonData);
    };
    api("http://localhost:3000/api/transactions");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-5 px-5">
          <FormField
            control={form.control}
            name="invoice_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="INV432A23FDS" {...field} />
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="Heaven" {...field} />
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="Date" {...field} />
                </FormControl>
                <FormDescription>The Date for the transaction.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-4 gap-5 px-5">
          <FormField
            control={form.control}
            name="hsn_referer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HSN Referer</FormLabel>
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2" {...field} />
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supply</FormLabel>
                <FormControl>
                  <Input placeholder="Heaven" {...field} />
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
                      <SelectValue placeholder="Transaction Status" />
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
        <div className="gap-5 p-5">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
