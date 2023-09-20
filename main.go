package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/saharshbhansali/TallyStock/database"
	"github.com/saharshbhansali/TallyStock/models"
	"github.com/saharshbhansali/TallyStock/routes"
)

func welcome(c *fiber.Ctx) error {
	return c.SendString("Welcome to the API!")
}

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

func setupRoutes(app *fiber.App) {
	// welcome endpoint
	app.Get("/api", welcome)

	// // User endpoints
	// app.Post("/api/users", routes.CreateUser)
	// app.Get("/api/users", routes.GetUsers)
	// app.Get("/api/users/:id", routes.GetUser)
	// app.Put("/api/users/:id", routes.UpdateUser)
	// app.Delete("/api/users/:id", routes.DeleteUser)

	// // Product endpoints
	// app.Post("/api/products", routes.CreateProduct)
	// app.Get("/api/products", routes.GetProducts)
	// app.Get("/api/products/:id", routes.GetProduct)
	// app.Put("/api/products/:id", routes.UpdateProduct)
	// app.Delete("/api/products/:id", routes.DeleteProduct)

	// // Order endpoints
	// app.Post("/api/orders", routes.CreateOrder)
	// app.Get("/api/orders", routes.GetOrders)
	// app.Get("/api/orders/:id", routes.GetOrder)
	// app.Put("/api/orders/:id", routes.UpdateOrder)
	// app.Delete("/api/orders/:id", routes.DeleteOrder)

	// Stock endpoints
	app.Post("/api/stocks", routes.CreateStock)
	app.Get("/api/stocks", routes.GetStocks)
	app.Get("/api/stocks/:id", routes.GetStockByID)
	app.Put("/api/stocks/:id", routes.UpdateStockByID)
	app.Delete("/api/stocks/:id", routes.DeleteStockByID)
	app.Get("/api/stocks/hsn/:hsn_code", routes.GetStockByHSN)
	app.Put("/api/stocks/hsn/:hsn_code", routes.UpdateStockByHSN)
	app.Delete("/api/stocks/hsn/:hsn_code", routes.DeleteStockByHSN)

	// Transaction endpoints
	app.Post("/api/transactions", routes.CreateTransaction)
	app.Get("/api/transactions", routes.GetTransactions)
	app.Get("/api/transactions/:id", routes.GetTransaction)
	app.Put("/api/transactions/:id", routes.UpdateTransaction)
	app.Delete("/api/transactions/:id", routes.DeleteTransaction)

}

func main() {
	database.ConnectDB()
	app := fiber.New()

	setupRoutes(app)

	seedStocks()
	seedTransactions()

	err := app.Listen(":3000")
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Server is running on port 3000")
	}

}
