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

	// Product endpoints

	// Order endpoints

}

func main() {
	database.ConnectDB()
	// if err != nil {
	// 	log.Fatal(err)
	// }

	app := fiber.New()
	setupRoutes(app)

	err := app.Listen(":3000")
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Server is running on port 3000")
	}

}
