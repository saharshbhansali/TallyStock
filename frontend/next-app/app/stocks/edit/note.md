https://www.phind.com/search?cache=wmumjg02e28tta2urmjkk1th

how to pass props to link react shadcn ui

the main page has some data (info)
when clicking the edit button on the main page, I am taken to the page at /stock/edit             

In that page, I need to pass the data from the main page (info) to the props (editProps) in StockEditForm

Code:
Main page:
<Link href="/stocks/edit">Edit</Link>

/stock/edit:
<StockEditForm props={editProps} />

I am using the `Link` component from shadcn ui
The mentioned `state` property doesn't exist there
Please suggest an appropriate solution