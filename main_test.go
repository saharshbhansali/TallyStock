// tests for the application

package main

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/saharshbhansali/TallyStock/database"
	"github.com/saharshbhansali/TallyStock/models"
)

func seedStocks() {
	s1 := models.Stock{HSNCode: "H1", StockName: "SN1", HOQuantity: 10, GodownQuantity: 20}
	s2 := models.Stock{HSNCode: "H2", StockName: "SN2", HOQuantity: 30, GodownQuantity: 40}
	s3 := models.Stock{HSNCode: "H3", StockName: "SN3", HOQuantity: 50, GodownQuantity: 60}
	database.Database.Db.Create(&s1)
	database.Database.Db.Create(&s2)
	database.Database.Db.Create(&s3)
	fmt.Println("Seeded stocks")
}

func seedTransactions() {
	t1 := models.Transaction{Date: "2021-01-01", InvoiceNumber: "I1", Destination: "HO", Status: "In", HSNCode: "H1", Supply: "S1", Quantity: 100}
	t2 := models.Transaction{Date: "2021-01-01", InvoiceNumber: "I1", Destination: "HO", Status: "In", HSNCode: "H1", Supply: "S2", Quantity: 20}
	t3 := models.Transaction{Date: "2021-01-01", InvoiceNumber: "I1", Destination: "HO", Status: "In", HSNCode: "H2", Supply: "S3", Quantity: 30}
	t4 := models.Transaction{Date: "2021-01-01", InvoiceNumber: "I2", Destination: "Godown", Status: "Transfer", HSNCode: "H1", Supply: "HO", Quantity: 60}
	t5 := models.Transaction{Date: "2021-01-01", InvoiceNumber: "I3", Destination: "Vendor", Status: "Out", HSNCode: "H1", Supply: "Godown", Quantity: 40}
	database.Database.Db.Create(&t1)
	database.Database.Db.Create(&t2)
	database.Database.Db.Create(&t3)
	database.Database.Db.Create(&t4)
	database.Database.Db.Create(&t5)
	fmt.Println("Seeded transactions")
}

func seedMain() {
	seedStocks()
	seedTransactions()
}

func setupApp() *fiber.App {
	database.ConnectDB()
	app := fiber.New()
	setupRoutes(app)
	return app
}

func TestWelcome(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodGet, "/api", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("Welcome endpoint failed")
	}
}

func TestGetStocks(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodGet, "/api/stocks", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("GetStocks endpoint failed")
	}
}

func TestGetStockByID(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodGet, "/api/stocks/1", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("GetStockByID endpoint failed")
	}
}

func TestGetStockByHSN(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodGet, "/api/stocks/hsn/H1", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("GetStockByHSN endpoint failed")
	}
}

func TestCreateStock(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodPost, "/api/stocks", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("CreateStock endpoint failed")
	}
}

func TestUpdateStockByID(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodPut, "/api/stocks/1", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("UpdateStockByID endpoint failed")
	}
}

func TestUpdateStockByHSN(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodPut, "/api/stocks/hsn/H1", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("UpdateStockByHSN endpoint failed")
	}
}

func TestDeleteStockByID(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodDelete, "/api/stocks/1", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("DeleteStockByID endpoint failed")
	}
}

func TestDeleteStockByHSN(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodDelete, "/api/stocks/hsn/H1", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("DeleteStockByHSN endpoint failed")
	}
}

func TestGetTransactions(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodGet, "/api/transactions", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("GetTransactions endpoint failed")
	}
}

func TestGetTransaction(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodGet, "/api/transactions/1", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("GetTransaction endpoint failed")
	}
}

func TestCreateTransaction(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodPost, "/api/transactions", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("CreateTransaction endpoint failed")
	}
}

func TestUpdateTransaction(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodPut, "/api/transactions/1", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("UpdateTransaction endpoint failed")
	}
}

func TestDeleteTransaction(t *testing.T) {
	app := setupApp()
	req, _ := http.NewRequest(http.MethodDelete, "/api/transactions/1", nil)
	res, _ := app.Test(req, -1)
	if res.StatusCode != 200 {
		t.Errorf("DeleteTransaction endpoint failed")
	}
}

func TestMain(m *testing.M) {
	seedMain()
	m.Run()
}
