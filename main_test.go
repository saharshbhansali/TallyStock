// tests for the application

package main

import (
	"testing"

	"github.com/saharshbhansali/TallyStock/database"
	"github.com/saharshbhansali/TallyStock/models"
)

func seedStock(db *database.DBInstance, t *testing.T, hsn_code, stock_name string, ho_quantity, godown_quantity float32) {
	stock := models.Stock{HSNCode: hsn_code, StockName: stock_name, HOQuantity: ho_quantity, GodownQuantity: godown_quantity}
	stock.CalculateTotalQuantity()
	if err := stock.Validate(); err != nil {
		t.Errorf("Error validating stock: %v", err)
	}
	err := db.Db.Create(&stock).Error
	if err != nil {
		t.Errorf("Error seeding stock: %v", err)
	}

}

func seedTransaction(db *database.DBInstance, t *testing.T, hsn_code, date, invoice_number, destination, status, supply string, quantity float32) {
	transaction := models.Transaction{HSNCode: hsn_code, Date: date, InvoiceNumber: invoice_number, Destination: destination, Status: status, Supply: supply, Quantity: quantity}
	if err := transaction.Validate(); err != nil {
		t.Errorf("Error validating transaction: %v", err)
	}

	if err := transaction.BusinessLogic(&transaction.Stock); err != nil {
		t.Errorf("Error in transaction business logic: %v", err)
	}

	if err := transaction.Validate(); err != nil {
		t.Errorf("Error validating transaction after business logic: %v", err)
	}

	err := db.Db.Create(&transaction).Error
	if err != nil {
		t.Errorf("Error seeding transaction: %v", err)
	}

}

func seedStocks(db *database.DBInstance, t *testing.T) {
	seedStock(db, t, "1234", "Stock 1", 100, 100)
	seedStock(db, t, "1235", "Stock 2", 100, 100)
	seedStock(db, t, "1236", "Stock 3", 100, 100)
}

func seedTransactions(db *database.DBInstance, t *testing.T) {
	seedTransaction(db, t, "1234", "2021-01-01", "1234", "HO", "In", "Wholesaler", 100)
	seedTransaction(db, t, "1234", "2021-01-01", "1234", "Godown", "In", "Factory", 100)
	seedTransaction(db, t, "1234", "2021-01-01", "1234", "HO", "Transfer", "Godown", 50)
	seedTransaction(db, t, "1234", "2021-01-01", "1234", "HO", "Out", "Customer", 50)
	seedTransaction(db, t, "1234", "2021-01-01", "1234", "Godown", "Transfer", "HO", 50)
}

func TestSeedMain(t *testing.T) {
	database.ConnectDB()
	db := database.Database
	seedStocks(&db, t)
	seedTransactions(&db, t)
}
