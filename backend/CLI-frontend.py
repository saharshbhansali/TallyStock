# make a cli frontend to make CRUD requests to the backend
import json
import requests

def transacion(date, invoice_number, destination, status, hsn_referer, stock, supply, quantity):
    '''
    Return a JSON object for the transaction
    '''
    T = {
        'date': date,
        'invoice_number': invoice_number,
        'destination': destination,
        'status': status,
        'hsn_referer': hsn_referer,
        'supply': supply,
        'quantity': quantity,
    }
    return T

def stock(hsn_code, stock_name, total_quantity, ho_quantity, godown_quantity):
    '''
    Return a JSON object for the stock
    '''
    S = {
        'hsn_code': hsn_code,
        'stock_name': stock_name,
        'total_quantity': total_quantity,
        'ho_quantity': ho_quantity,
        'godown_quantity': godown_quantity,
    }
    return S

def makeRequest(method, url, data=None):
    '''
    Make a request to the backend
    '''
    if method == 'GET':
        res = requests.get(url)
    elif method == 'POST':
        res = requests.post(url, data)
    elif method == 'PUT':
        res = requests.put(url, data)
    elif method == 'DELETE':
        res = requests.delete(url)
    return res

def transactionCRUD():
    choose_operation = int(input("Choose an operation to perform:\n1. Create\n2. Read\n3. Update\n4. Delete\n"))
    url = "http://localhost:3000/api/transactions"
    res = 'Error'
    if choose_operation == 1:
        # Create a transaction
        date = input("Enter the date of the transaction: ")
        invoice_number = input("Enter the invoice number of the transaction: ")
        destination = input("Enter the destination of the transaction: ")
        status = input("Enter the status of the transaction: ")
        hsn_referer = input("Enter the hsn_referer of the transaction: ")
        stock = input("Enter the stock of the transaction: ")
        supply = input("Enter the supply of the transaction: ")
        quantity = int(input("Enter the quantity of the transaction: "))
        T = transacion(date, invoice_number, destination, status, hsn_referer, supply, quantity)
        # create the transaction
        res = makeRequest('POST', url, T)

    elif choose_operation == 3:
        id = int(input("Enter the id of the transaction to update: "))
        flag = True
        old_transaction = makeRequest('GET', url+f'/{id}') # get the old transaction
        print("Old transaction:\n", old_transaction)
        T = eval(old_transaction)
        while flag:
            item = int(input("Choose the fields to update:\n1. Date\n2. Invoice Number\n3. Destination\n4. Status\n5. HSN Referer\n6. Supply\n7. Quantity\n0. Exit and update\n"))
            if item == 1:
                date = input("Enter the new date: ")
                T['date'] = date
            elif item == 2:
                invoice_number = input("Enter the new invoice number: ")
                T['invoice_number'] = invoice_number
            elif item == 3:
                destination = input("Enter the new destination: ")
                T['destination'] = destination
            elif item == 4:
                status = input("Enter the new status: ")
                T['status'] = status
            elif item == 5:
                hsn_referer = input("Enter the new hsn_referer: ")
                T['hsn_referer'] = hsn_referer
            elif item == 6:
                supply = input("Enter the new supply: ")
                T['supply'] = supply
            elif item == 7:
                quantity = int(input("Enter the new quantity: "))
                T['quantity'] = quantity
            elif item == 0:
                flag = False
            print("Modified transaction:\n", T)
        confirm = input("Are you sure you want to update this transaction? (y/n): ")
        if confirm == 'y':
            # update the transaction
            res = makeRequest('PUT', url+f'/{id}', T)
        
    elif choose_operation == 4:
        id = int(input("Enter the id of the transaction to delete: "))
        transacion = requests.get() # get the transaction
        print("Transaction to be deleted:\n", transaction)
        delete = input("Are you sure you want to delete this transaction? (y/n): ")
        if delete == 'y':
            # delete the transaction
            res = makeRequest('DELETE', url+f'/{id}')
        else:
            print("Transaction not deleted")

    elif choose_operation == 2:
        id = int(input("Enter the id of the transaction to read, 0 for all transactions: "))
        if id == 0:
            # Read all transactions
            transactions = makeRequest('GET', url)
            for transaction in transactions:
                print("Transaction:\n", transaction)
            res = 'All transactions read successfully'
        else:
            # Read a transaction
            res = makeRequest('GET', url+f'/{id}')
    
    print("Response from server:\n")
    print(res)

def stockCRUD():
    choose_operation = int(input("Choose an operation to perform:\n1. Create\n2. Read\n3. Update\n4. Delete\n"))
    url = "http://localhost:3000/api/stocks"
    res = 'Error'
    if choose_operation == 1:
        # Create a stock
        hsn_code = input("Enter the hsn_code of the stock: ")
        stock_name = input("Enter the stock_name of the stock: ")
        total_quantity = int(input("Enter the total_quantity of the stock: "))
        ho_quantity = int(input("Enter the ho_quantity of the stock: "))
        godown_quantity = int(input("Enter the godown_quantity of the stock: "))
        S = stock(hsn_code, stock_name, total_quantity, ho_quantity, godown_quantity)
        # create the stock
        res = makeRequest('POST', url, S)
        print("Stock created successfully", res)

    elif choose_operation == 3:
        id = int(input("Enter the id of the stock to update: "))
        flag = True
        old_stock = makeRequest('GET', url+f'/{id}') # get the old stock
        print("Old stock:\n", old_stock)
        S = eval(old_stock)
        while flag:
            item = int(input("Choose the fields to update:\n1. HSN Code\n2. Stock Name\n3. Total Quantity\n4. HO Quantity\n5. Godown Quantity\n0. Exit and update\n"))
            if item == 1:
                hsn_code = input("Enter the new hsn_code: ")
                S['hsn_code'] = hsn_code
            elif item == 2:
                stock_name = input("Enter the new stock_name: ")
                S['stock_name'] = stock_name
            elif item == 3:
                total_quantity = int(input("Enter the new total_quantity: "))
                S['total_quantity'] = total_quantity
            elif item == 4:
                ho_quantity = int(input("Enter the new ho_quantity: "))
                S['ho_quantity'] = ho_quantity
            elif item == 5:
                godown_quantity = int(input("Enter the new godown_quantity: "))
                S['godown_quantity'] = godown_quantity
            elif item == 0:
                flag = False
            print("Modified stock:\n", S)
        confirm = input("Are you sure you want to update this stock? (y/n): ")
        if confirm == 'y':
            # update the stock
            res = makeRequest('PUT', url+f'/{id}', S)
        
    elif choose_operation == 4:
        id = int(input("Enter the id of the stock to delete: "))
        stock = makeRequest('GET', url+f'/{id}') # get the stock
        print("Stock to be deleted:\n", stock)
        delete = input("Are you sure you want to delete this stock? (y/n): ")
        if delete == 'y':
            # delete the stock
            res = makeRequest('DELETE', url+f'/{id}')
        else:
            print("Stock not deleted")

    elif choose_operation == 2:
        id = int(input("Enter the id of the stock to read, 0 for all stocks: "))
        if id == 0:
            # Read all stocks
            stocks = requests.get()
            for stock in stocks:
                print("Stock:\n", stock)
            res = 'All stocks read successfully'
        else:
            # Read a stock
            res = makeRequest('GET', url+f'/{id}')
    
    print("Response from server:\n")
    print(res)

def main():
    '''
    Main function
    '''

    choose_item = int(input("Choose an item to perform CRUD operations on:\n1. Transaction\n2. Stock\n"))
    if choose_item == 1:
        transactionCRUD()
    elif choose_item == 2:
        stockCRUD()
