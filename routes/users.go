package routes

import (
	"errors"
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

func GetUsers(c *fiber.Ctx) error {

	users := []models.User{}

	database.Database.Db.Find(&users)
	responseUsers := []User{}
	for _, user := range users {
		responseUser := CreateResponseUser(user)
		responseUsers = append(responseUsers, responseUser)
	}

	fmt.Println("Successful user retrieval.")
	return c.Status(200).JSON(responseUsers)
}

func findUser(id uint, user *models.User) error {
	database.Database.Db.Find(&user, "id = ?", id)
	if user.ID == 0 {
		return errors.New("User does not exist")
	}
	return nil
}

func GetUser(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")

	var user models.User

	if err != nil {
		fmt.Println("Getting user failed.")
		return c.Status(400).JSON("Please ensure that the :id is an integer.")
	}

	if err := findUser(uint(id), &user); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	responseUser := CreateResponseUser(user)

	fmt.Println("Successful user retrieval.")
	return c.Status(200).JSON(responseUser)
}

func UpdateUser(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")

	var user models.User

	if err != nil {
		fmt.Println("Getting user :id failed.")
		return c.Status(400).JSON("Please ensure that the :id is an integer.")
	}

	if err := findUser(uint(id), &user); err != nil {
		fmt.Println("User :id does not exist.")
		return c.Status(404).JSON(err.Error())
	}

	type UpdateUser struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
	}

	var updateData UpdateUser
	if err := c.BodyParser(&updateData); err != nil {
		fmt.Println("Updating user :id failed. No data provided.")
		return c.Status(400).JSON(err.Error())
	}

	user.FirsName = updateData.FirstName
	user.LastName = updateData.LastName
	database.Database.Db.Save(&user)

	responseUser := CreateResponseUser(user)
	fmt.Println("Updating user :id successful.")
	return c.Status(200).JSON(responseUser)
}

func DeleteUser(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")

	var user models.User

	if err != nil {
		fmt.Println("Getting user :id failed.")
		return c.Status(400).JSON("Please ensure that the :id is an integer.")
	}

	if err := findUser(uint(id), &user); err != nil {
		fmt.Println("User :id does not exist.")
		return c.Status(400).JSON(err.Error())
	}

	if err := database.Database.Db.Delete(&user).Error; err != nil {
		fmt.Println("Deleting user :id failed.")
		return c.Status(404).JSON(err.Error())
	}

	return c.Status(200).JSON("User successfully deleted.")
}
