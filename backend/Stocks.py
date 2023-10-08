import json 
import requests

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
    
    print("Server:",res.status_code, res.reason)
    if res.status_code == 200:
        res = json.loads(res.text)
        return res
    else:
        print(res)
        print(res.text)
        return None
def stockJSON(hsn_code, stock_name, total_quantity, ho_quantity, godown_quantity):
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

def stockPrintServer(S):
    print(f'''
    Stock:
        id: {S['id']}
        hsn_code: {S['hsn_code']}
        stock_name: {S['stock_name']}
        total_quantity: {S['total_quantity']}
        ho_quantity: {S['ho_quantity']}
        godown_quantity: {S['godown_quantity']}
        updated_at: {S['updated_at']}
          ''')

def stockPrintClient(S):
    print(f'''
    Stock:
        hsn_code: {S['hsn_code']}
        stock_name: {S['stock_name']}
        total_quantity: {S['total_quantity']}
        ho_quantity: {S['ho_quantity']}
        godown_quantity: {S['godown_quantity']}
          ''')

def stockCRUD():
    choose_operation = int(input("Choose an operation to perform:\n1. Create\n2. Read\n3. Update\n4. Delete\n"))
    url = "http://localhost:3000/api/stocks"

    if choose_operation == 1:
        # Create a stock
        hsn_code = input("Enter the hsn_code of the stock: ")
        stock_name = input("Enter the stock_name of the stock: ")
        total_quantity = int(input("Enter the total_quantity of the stock: "))
        ho_quantity = int(input("Enter the ho_quantity of the stock: "))
        godown_quantity = int(input("Enter the godown_quantity of the stock: "))
        new_stock = stockJSON(hsn_code, stock_name, total_quantity, ho_quantity, godown_quantity)
        # create the stock
        res = makeRequest('POST', url, json.dumps(new_stock))
        if res != None:
                print("Stock created successfully")
        else:
            print("Stock not created")
            return

    elif choose_operation == 3:
        id = int(input("Enter the id of the stock to update: "))
        flag = True
        old_stock = makeRequest('GET', url+f'/{id}') # get the old stock
        stockPrintServer(old_stock)
        updated_stock = stockJSON(old_stock['hsn_code'], old_stock['stock_name'], old_stock['total_quantity'], old_stock['ho_quantity'], old_stock['godown_quantity'])
        while flag:
            item = int(input("Choose the fields to update:\n1. HSN Code\n2. Stock Name\n3. Total Quantity\n4. HO Quantity\n5. Godown Quantity\n0. Exit and update\n"))
            if item == 1:
                hsn_code = input("Enter the new hsn_code: ")
                updated_stock['hsn_code'] = hsn_code
            elif item == 2:
                stock_name = input("Enter the new stock_name: ")
                updated_stock['stock_name'] = stock_name
            elif item == 3:
                total_quantity = int(input("Enter the new total_quantity: "))
                updated_stock['total_quantity'] = total_quantity
            elif item == 4:
                ho_quantity = int(input("Enter the new ho_quantity: "))
                updated_stock['ho_quantity'] = ho_quantity
            elif item == 5:
                godown_quantity = int(input("Enter the new godown_quantity: "))
                updated_stock['godown_quantity'] = godown_quantity
            elif item == 0:
                flag = False
            print("Modified:\n")
            stockPrintClient(updated_stock)
        confirm = input("Are you sure you want to update this stock? (y/n): ")
        if confirm == 'y':
            # update the stock
            res = makeRequest('PUT', url+f'/{id}', json.dumps(updated_stock))
            if res != None:
                print("Stock updated successfully")
            else:
                print("Stock not updated")
                return
        
    elif choose_operation == 4:
        id = int(input("Enter the id of the stock to delete: "))
        stock = makeRequest('GET', url+f'/{id}') # get the stock
        print("Deleting:")
        stockPrintServer(stock)
        delete = input("Are you sure you want to delete this stock? (y/n): ")
        if delete == 'y':
            # delete the stock
            res = makeRequest('DELETE', url+f'/{id}')
            if res != None:
                print("Stock deleted successfully")
                return
            else:
                print("Stock not deleted")
                return
        else:
            print("Stock not deleted")

    elif choose_operation == 2:
        id = input("Enter the id of the stock to read (leave empty for all stocks): ")
        if id == '':
            # Read all stocks
            stocks = makeRequest('GET', url)
            for stock in stocks:
                stockPrintServer(stock)
            print("Response from server:")
            print('All stocks read successfully')
            return
        else:
            id = int(id)
            # Read a stock
            res = makeRequest('GET', url+f'/{id}')
    
    print("Response from server:")
    stockPrintServer(res)
