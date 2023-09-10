package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/saharshbhansali/TallyStock/database"
	"github.com/saharshbhansali/TallyStock/routes"
)

func main() {
	database.ConnectDB()
	// if err != nil {
	// 	log.Fatal(err)
	// }

	app := fiber.New()
	app.Get("/api", routes.Welcome)

	err := app.Listen(":3000")
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Server is running on port 3000")
	}

}
