package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/saharshbhansali/TallyStock/database"
	"github.com/saharshbhansali/TallyStock/routes"
)

func welcome(c *fiber.Ctx) error {
	return c.SendString("Welcome to the API!")
}

func setupRoutes(app *fiber.App) {
	// welcome endpoint
	app.Get("/api", welcome)

	// User endpoints
	app.Post("/api/users", routes.CreateUser)
	app.Get("/api/users", routes.GetUsers)
	app.Get("/api/users/:id", routes.GetUser)
	app.Put("/api/users/:id", routes.UpdateUser)
	app.Delete("/api/users/:id", routes.DeleteUser)

	// Product endpoints
	app.Post("/api/products", routes.CreateProduct)
	app.Get("/api/products", routes.GetProducts)
	app.Get("/api/products/:id", routes.GetProduct)
	app.Put("/api/products/:id", routes.UpdateProduct)
	app.Delete("/api/products/:id", routes.DeleteProduct)

	// Order endpoints
	app.Post("/api/orders", routes.CreateOrder)
	app.Get("/api/orders", routes.GetOrders)
	app.Get("/api/orders/:id", routes.GetOrder)
	app.Put("/api/orders/:id", routes.UpdateOrder)
	app.Delete("/api/orders/:id", routes.DeleteOrder)

	// Stock endpoints
	app.Post("/api/stocks", routes.CreateStock)
	app.Get("/api/stocks", routes.GetStocks)
	app.Get("/api/stocks/:id", routes.GetStockByID)
	app.Put("/api/stocks/:id", routes.UpdateStockByID)
	app.Delete("/api/stocks/:id", routes.DeleteStockByID)
	app.Get("/api/stocks/:hsn_code", routes.GetStockByHSN)
	app.Put("/api/stocks/:hsn_code", routes.UpdateStockByHSN)
	app.Delete("/api/stocks/:hsn_code", routes.DeleteStockByHSN)

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

	err := app.Listen(":3000")
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Server is running on port 3000")
	}

}
