# make a cli frontend to make CRUD requests to the backend
import Transactions
import Stocks

def main():
    '''
    Main function
    '''
    while True:
        choose_item = input("Choose an item to perform CRUD operations on:\n1. Transaction\n2. Stock\n")
        if choose_item == '1':
            Transactions.transactionCRUD()
        elif choose_item == '2':
            Stocks.stockCRUD()
        else:
            print("Invalid choice")
            break

main()