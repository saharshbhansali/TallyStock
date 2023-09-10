package main

import (
	"fmt"
	"log"

	"github.com/saharshbhansali/TallyStock/database"
	"github.com/gofiber/fiber/v2"
)

func welcome(c *fiber.Ctx) error {
	return c.SendString("Welcome to API")
}


func main() {
	database.ConnectDB()
	// if err != nil {
	// 	log.Fatal(err)
	// }

	app := fiber.New()
	app.Get("/api", welcome)

	err := app.Listen(":3000")
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Server is running on port 3000")
	}

}

