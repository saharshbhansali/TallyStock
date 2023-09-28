package routes

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/saharshbhansali/TallyStock/database"
	"github.com/saharshbhansali/TallyStock/middleware"
	"github.com/saharshbhansali/TallyStock/models"
)

type Transaction struct {
	ID            uint         `json:"id"`
	Date          string       `json:"date"`
	InvoiceNumber string       `json:"invoice_number"`
	Destination   string       `json:"destination"`
	Status        string       `json:"status"`
	HSNReferer    string       `json:"hsn_referer"`
	Stock         DisplayStock `json:"stock"`
	Supply        string       `json:"supply"`
	Quantity      float32      `json:"quantity"`
	UpdatedAt     time.Time    `json:"updated_at"`
}

// custom struct to return only required fields

type DisplayStock struct {
	ID        uint   `json:"id"`
	HSNCode   string `json:"hsn_code"`
	StockName string `json:"stock_name"`
}

func CreateDisplayStock(stockModel models.Stock) DisplayStock {
	return DisplayStock{ID: stockModel.ID, HSNCode: stockModel.HSNCode, StockName: stockModel.StockName}
}

func CreateResponseTransaction(transactionModel models.Transaction, stock models.Stock) Transaction {
	stockResponse := CreateDisplayStock(stock)
	return Transaction{ID: transactionModel.ID, InvoiceNumber: transactionModel.InvoiceNumber, Date: transactionModel.Date, Destination: transactionModel.Destination, Status: transactionModel.Status, HSNReferer: transactionModel.HSNReferer, Stock: stockResponse, Supply: transactionModel.Supply, Quantity: transactionModel.Quantity}
}

func CreateTransaction(c *fiber.Ctx) error {
	var transaction models.Transaction

	if err := c.BodyParser(&transaction); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := transaction.Validate(); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	var stock models.Stock
	if err := findStockByHSN(transaction.HSNReferer, &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	transaction.Stock = stock
	fmt.Println("Transaction:", transaction)
	fmt.Println("Stock:", stock)

	if err := middleware.BusinessLogic(&transaction); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	fmt.Println("Transaction (After BL):", transaction)
	fmt.Println("Stock (After BL):", stock)
	database.Database.Db.Create(&transaction)

	responseTransaction := CreateResponseTransaction(transaction, transaction.Stock)

	return c.Status(200).JSON(responseTransaction)
}

func GetTransactions(c *fiber.Ctx) error {

	transactions := []models.Transaction{}

	database.Database.Db.Find(&transactions)
	responseTransactions := []Transaction{}
	for _, transaction := range transactions {
		var stock models.Stock
		database.Database.Db.Find(&stock, "hsn_code = ?", transaction.HSNReferer)
		transaction.Stock = stock
		responseTransaction := CreateResponseTransaction(transaction, transaction.Stock)
		responseTransactions = append(responseTransactions, responseTransaction)
	}

	return c.Status(200).JSON(responseTransactions)
}

func findTransaction(id uint, transaction *models.Transaction) error {
	database.Database.Db.Find(&transaction, "id = ?", id)
	if transaction.ID == 0 {
		return fmt.Errorf("Transaction does not exist")
	}
	return nil
}

func GetTransaction(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")

	var transaction models.Transaction
	if err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := findTransaction(uint(id), &transaction); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	var stock models.Stock
	database.Database.Db.Find(&stock, "hsn_code = ?", transaction.HSNReferer)
	transaction.Stock = stock
	responseTransaction := CreateResponseTransaction(transaction, transaction.Stock)

	return c.Status(200).JSON(responseTransaction)
}

func UpdateTransaction(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")

	var transaction models.Transaction
	if err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := findTransaction(uint(id), &transaction); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	// insert validation here and updation business logic here

	type UpdateTransaction struct {
		InvoiceNumber string  `json:"invoice_number"`
		Date          string  `json:"date"`
		Destination   string  `json:"destination"`
		Status        string  `json:"status"`
		HSNReferer    string  `json:"hsn_referer"`
		Supply        string  `json:"supply"`
		Quantity      float32 `json:"quantity"`
	}

	var updateData UpdateTransaction
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	transaction.InvoiceNumber = updateData.InvoiceNumber
	transaction.Destination = updateData.Destination
	transaction.Status = updateData.Status
	transaction.HSNReferer = updateData.HSNReferer
	transaction.Supply = updateData.Supply
	transaction.Quantity = updateData.Quantity
	transaction.UpdatedAt = time.Now()
	// updated date is treated as a string
	transaction.Date = updateData.Date

	var stock models.Stock
	if err := findStockByHSN(transaction.HSNReferer, &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	transaction.Stock = stock

	fmt.Println("Pre-Update:")
	fmt.Println("Transaction:", transaction)
	fmt.Println("Stock:", stock)

	if err := middleware.RevertTransaction(&transaction); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := middleware.BusinessLogic(&transaction); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := findStockByHSN(transaction.HSNReferer, &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	transaction.Stock = stock

	fmt.Println("Post-Update:")
	fmt.Println("Transaction:", transaction)
	fmt.Println("Stock:", stock)
	
	database.Database.Db.Save(&stock)
	database.Database.Db.Save(&transaction)

	responseTransaction := CreateResponseTransaction(transaction, transaction.Stock)

	return c.Status(200).JSON(responseTransaction)
}

func DeleteTransaction(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")

	var transaction models.Transaction
	if err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := findTransaction(uint(id), &transaction); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	// insert validation here and updation business logic here

	type DeleteTransaction struct {
		InvoiceNumber string  `json:"invoice_number"`
		Date          string  `json:"date"`
		Destination   string  `json:"destination"`
		Status        string  `json:"status"`
		HSNReferer    string  `json:"hsn_referer"`
		Supply        string  `json:"supply"`
		Quantity      float32 `json:"quantity"`
	}

	var updateData DeleteTransaction
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	transaction.InvoiceNumber = updateData.InvoiceNumber
	transaction.Destination = updateData.Destination
	transaction.Status = updateData.Status
	transaction.HSNReferer = updateData.HSNReferer
	transaction.Supply = updateData.Supply
	transaction.Quantity = 0

	var stock models.Stock
	if err := findStockByHSN(transaction.HSNReferer, &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	transaction.Stock = stock

	if err := middleware.RevertTransaction(&transaction); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := findStockByHSN(transaction.HSNReferer, &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	fmt.Println("Transaction:", transaction)
	fmt.Println("Stock:", stock)
	database.Database.Db.Save(&stock)
	// database.Database.Db.Save(&transaction)
	database.Database.Db.Delete(&transaction)

	responseStock := CreateResponseStock(stock)
	type UpdatedStock struct {
		Message string `json:"message"`
		Stock   Stock  `json:"stock"`
	}

	return c.Status(200).JSON(UpdatedStock{Message: "Transaction deleted successfully", Stock: responseStock})
}
