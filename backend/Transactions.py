import json 
import requests

def makeRequest(method, url, data=None):
    '''
    Make a request to the backend
    '''
    if method == 'GET':
        res = requests.get(url)
    elif method == 'POST':
        res = requests.post(url, str(data))
    elif method == 'PUT':
        res = requests.put(url, data=data)
    elif method == 'DELETE':
        res = requests.delete(url)
    
    print("Server:",res.status_code, res.reason)
    if res.status_code == 200:
        res = json.loads(res.text)
        return res
    else:
        print(res.raw)
        print(res.url, res.content)
        print(res.text)
        return None

def transactionJSON(date, invoice_number, destination, status, hsn_referer, supply, quantity):
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

def transactionPrintServer(T):
    print(f'''
    Transaction:
        id: {T['id']}
        date: {T['date']}
        invoice_number: {T['invoice_number']}
        destination: {T['destination']}
        status: {T['status']}
        hsn_referer: {T['hsn_referer']}
        supply: {T['supply']}
        quantity: {T['quantity']}
        updated_at: {T['updated_at']}
          ''')

def transactionPrintClient(T):
    print(f'''
    Transaction:
        date: {T['date']}
        invoice_number: {T['invoice_number']}
        destination: {T['destination']}
        status: {T['status']}
        hsn_referer: {T['hsn_referer']}
        supply: {T['supply']}
        quantity: {T['quantity']}
          ''')

def CreateTransactionData(date, invoice_number, destination, status):
    new_transactions = []
    date = input("Enter the date of the transaction: ")
    invoice_number = input("Enter the invoice number of the transaction: ")
    destination = input("Enter the destination of the transaction: ")
    status = input("Enter the status of the transaction: ")
    entries = int(input("Enter the number of entries in this transaction to create: "))
    for i in range(entries):
        hsn_referer = input("Enter the hsn_referer of the transaction: ")
        supply = input("Enter the supply of the transaction: ")
        quantity = int(input("Enter the quantity of the transaction: "))
        new_transaction = transactionJSON(date, invoice_number, destination, status, hsn_referer, supply, quantity)
        new_transactions.append(new_transaction)
    return new_transactions

def CreateTransactionRequests(url, new_transaction=[]):
        transactionPrintClient(new_transaction)
        res = makeRequest('POST', url, json.dumps(new_transaction))
        if res != None:
            print("Transaction created successfully")
        else:
            print("Transaction not created")
            return

def UpdateTransactionData(old_transaction):
    updated_transaction = transactionJSON(old_transaction['date'], old_transaction['invoice_number'], old_transaction['destination'], old_transaction['status'], old_transaction['hsn_referer'], old_transaction['supply'], old_transaction['quantity'])
    flag = True
    while flag:
        item = int(input("Choose the fields to update:\n1. Date\n2. Invoice Number\n3. Destination\n4. Status\n5. HSN Referer\n6. Supply\n7. Quantity\n0. Exit and update\n"))
        if item == 1:
            date = input("Enter the new date: ")
            updated_transaction['date'] = date
        elif item == 2:
            invoice_number = input("Enter the new invoice number: ")
            updated_transaction['invoice_number'] = invoice_number
        elif item == 3:
            destination = input("Enter the new destination: ")
            updated_transaction['destination'] = destination
        elif item == 4:
            status = input("Enter the new status: ")
            updated_transaction['status'] = status
        elif item == 5:
            hsn_referer = input("Enter the new hsn_referer: ")
            updated_transaction['hsn_referer'] = hsn_referer
        elif item == 6:
            supply = input("Enter the new supply: ")
            updated_transaction['supply'] = supply
        elif item == 7:
            quantity = int(input("Enter the new quantity: "))
            updated_transaction['quantity'] = quantity
        elif item == 0:
            flag = False
        print("Modified:\n")
        transactionPrintClient(updated_transaction)
    return updated_transaction

def UpdateTransactionRequests(url, updated_transaction, id):
    confirm = input("Are you sure you want to update this transaction? (y/n): ")
    if confirm == 'y':
        # update the transaction
        res = makeRequest('PUT', url+f'/{id}', json.dumps(updated_transaction))
        if res != None:
            print("Transaction updated successfully")
        else:
            print("Transaction not updated")
            return
        
def transactionCRUD():
    choose_operation = int(input("Choose an operation to perform:\n1. Create\n2. Read\n3. Update\n4. Delete\n"))
    ## Debugging
    choose_operation = 1
    url = "http://localhost:3000/api/transactions"

    if choose_operation == 1:
        # Create a transaction
        new_transactions = CreateTransactionData()
        for new_transaction in new_transactions:
            CreateTransactionRequests(url, new_transaction)
        # CreateTransactionRequests(url, [transactionJSON('2021-05-01', '123', 'Delhi', 'Pending', '123', 'Supply', 1000)])

    elif choose_operation == 3:
        id = int(input("Enter the id of the transaction to update: "))
        old_transaction = makeRequest('GET', url+f'/{id}') # get the old transaction
        transactionPrintServer(old_transaction)
        updated_transaction = UpdateTransactionData(old_transaction)
        UpdateTransactionRequests(url, updated_transaction, id)
        
    elif choose_operation == 4:
        id = int(input("Enter the id of the transaction to delete: "))
        transaction = makeRequest('GET', url+f'/{id}') # get the transaction
        print("Deleting:\n")
        transactionPrintServer(transaction)
        delete = input("Are you sure you want to delete this transaction? (y/n): ")
        if delete == 'y':
            # delete the transaction
            res = makeRequest('DELETE', url+f'/{id}')
            if res != None:
                print("Transaction deleted successfully")
            else:
                print("Transaction not deleted")
                return
        else:
            print("Transaction not deleted")

    elif choose_operation == 2:
        id = input("Enter the id of the transaction to read (leave empty for all transactions): ")
        if id == '':
            # Read all transactions
            transactions = makeRequest('GET', url)
            for transaction in transactions:
                transactionPrintServer(transaction)
            print("Response from server:")
            print('All transactions read successfully')
            return
        else:
            id = int(id)
            # Read a transaction
            res = makeRequest('GET', url+f'/{id}')
    
    print("Response from server:")
    transactionPrintServer(res)

transactionCRUD()