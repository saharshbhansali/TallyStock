package routes

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/saharshbhansali/TallyStock/database"
	"github.com/saharshbhansali/TallyStock/models"
)

type User struct {
	// not a model - it is similar to a serializer
	ID       uint   `json:"id"`
	FirsName string `json:"first_name"`
	LastName string `json:"last_name"`
}

func CreateResponseUser(userModel models.User) User {
	return User{ID: userModel.ID, FirsName: userModel.FirsName, LastName: userModel.LastName}
}

func CreateUser(c *fiber.Ctx) error {
	var user models.User

	if err := c.BodyParser(&user); err != nil {
		fmt.Println("Getting user failed.")
		return c.Status(400).JSON(err.Error())
	}

	database.Database.Db.Create(&user)
	responseUser := CreateResponseUser(user)

	fmt.Println("Successful user creation.")
	return c.Status(200).JSON(responseUser)

}
