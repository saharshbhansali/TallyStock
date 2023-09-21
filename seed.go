package main

import (
	"fmt"
	"testing"

	"github.com/saharshbhansali/TallyStock/database"
	"github.com/saharshbhansali/TallyStock/models"
)

func newStock(hsn_code, stock_name string, ho_quantity, godown_quantity float32) *models.Stock {
	return &models.Stock{
		HSNCode:        hsn_code,
		StockName:      stock_name,
		HOQuantity:     ho_quantity,
		GodownQuantity: godown_quantity,
	}
}

func newTransaction(hsn_code, date, invoice_number, destination, status, supply string, quantity float32) *models.Transaction {
	return &models.Transaction{
		HSNReferer:    hsn_code,
		Date:          date,
		InvoiceNumber: invoice_number,
		Destination:   destination,
		Status:        status,
		Supply:        supply,
		Quantity:      quantity,
	}
}

func SeedStock(t *testing.T, hsn_code, stock_name string, ho_quantity, godown_quantity float32) {

	stock := newStock(hsn_code, stock_name, ho_quantity, godown_quantity)
	stock.CalculateTotalQuantity()
	if err := stock.Validate(); err != nil {
		fmt.Println("Error validating stock")
		t.Errorf("Error validating stock: %v", err)
	}
	err := database.Database.Db.Create(stock).Error
	if err != nil {
		fmt.Println("Error seeding stock")
		t.Errorf("Error seeding stock: %v", err)
	}

}

// func findStockByHSN(hsn_code string) *models.Stock {
// 	var s models.Stock
// 	database.Database.Db.Find(&s, "hsn_code = ?", hsn_code)
// 	if s.ID == 0 {
// 		fmt.Println("Stock does not exist")
// 		return nil
// 	}
// 	return &s
// }

func SeedTransaction(t *testing.T, hsn_code, date, invoice_number, destination, status, supply string, quantity float32) {
	transaction := newTransaction(hsn_code, date, invoice_number, destination, status, supply, quantity)
	// stock := findStockByHSN(transaction.HSNReferer)
	// stock := &transaction.Stock
	if err := transaction.Validate(); err != nil {
		fmt.Println("Error validating transaction")
		t.Errorf("Error validating transaction: %v", err)
	}

	if err := transaction.BusinessLogic(); err != nil {
		fmt.Println("Error in transaction business logic")
		t.Errorf("Error in transaction business logic: %v", err)
	}

	if err := transaction.Validate(); err != nil {
		fmt.Println("Error validating transaction after business logic")
		t.Errorf("Error validating transaction after business logic: %v", err)
	}

	err := database.Database.Db.Create(transaction).Error
	if err != nil {
		t.Errorf("Error seeding transaction: %v", err)
	}

}

func seedStocks(t *testing.T) {
	SeedStock(t, "1234", "Stock 1", 100, 100)
	SeedStock(t, "1235", "Stock 2", 100, 100)
	SeedStock(t, "1236", "Stock 3", 100, 100)
}

func seedTransactions(t *testing.T) {
	SeedTransaction(t, "1234", "2021-01-01", "1234", "HO", "In", "Wholesaler", 100)
	SeedTransaction(t, "1234", "2021-01-01", "1234", "Godown", "In", "Factory", 100)
	SeedTransaction(t, "1234", "2021-01-01", "1234", "HO", "Transfer", "Godown", 50)
	SeedTransaction(t, "1234", "2021-01-01", "1234", "HO", "Out", "Customer", 50)
	SeedTransaction(t, "1234", "2021-01-01", "1234", "Godown", "Transfer", "HO", 50)
}

func SeedMain() {
	// connect to database
	// database.ConnectDB()
	t := &testing.T{}
	seedTransactions(t)
	seedStocks(t)
}
