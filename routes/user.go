package routes

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

func Welcome(c *fiber.Ctx) error {
	fmt.Println("Welcome to API")
	log.Print("welcome route accessed API")
	return c.SendString("Welcome to API")
}
