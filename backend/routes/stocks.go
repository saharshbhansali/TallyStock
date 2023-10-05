package routes

import (
	"errors"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/saharshbhansali/TallyStock/database"
	"github.com/saharshbhansali/TallyStock/models"
)

type Stock struct {
	ID             uint      `json:"id"`
	HSNCode        string    `json:"hsn_code"`
	StockName      string    `json:"stock_name"`
	TotalQuantity  float32   `json:"total_quantity"`
	HOQuantity     float32   `json:"ho_quantity"`
	GodownQuantity float32   `json:"godown_quantity"`
	UpdatedAt      time.Time `json:"updated_at"`
}

func CreateResponseStock(stockModel models.Stock) Stock {
	return Stock{ID: stockModel.ID, HSNCode: stockModel.HSNCode, StockName: stockModel.StockName, TotalQuantity: stockModel.TotalQuantity, HOQuantity: stockModel.HOQuantity, GodownQuantity: stockModel.GodownQuantity, UpdatedAt: stockModel.UpdatedAt}
}

func CreateStock(c *fiber.Ctx) error {
	var stock models.Stock

	if err := c.BodyParser(&stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	stock.CalculateTotalQuantity()
	if err := stock.Validate(); err != nil {
		fmt.Println("Stock validation failed")
		return c.Status(400).JSON(err.Error())
	}

	database.Database.Db.Create(&stock)
	responseStock := CreateResponseStock(stock)

	return c.Status(200).JSON(responseStock)
}

func GetStocks(c *fiber.Ctx) error {

	stocks := []models.Stock{}

	database.Database.Db.Find(&stocks)
	responseStocks := []Stock{}
	for _, stock := range stocks {
		responseStock := CreateResponseStock(stock)
		responseStocks = append(responseStocks, responseStock)
	}

	return c.Status(200).JSON(responseStocks)
}

func findStockByHSN(hsn_code string, stock *models.Stock) error {
	database.Database.Db.Find(&stock, "hsn_code = ?", hsn_code)
	if stock.ID == 0 {
		return fmt.Errorf("Stock does not exist")
	}
	return nil
}

func findStockByID(id uint, stock *models.Stock) error {
	database.Database.Db.Find(&stock, "id = ?", id)
	if stock.ID == 0 {
		return fmt.Errorf("Stock does not exist")
	}
	return nil
}

func GetStockByHSN(c *fiber.Ctx) error {
	hsn_code := c.Params("hsn_code")

	var stock models.Stock
	if hsn_code == "" {
		return c.Status(400).JSON(errors.New("HSN Code not provided"))
	}

	if err := findStockByHSN(hsn_code, &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	responseStock := CreateResponseStock(stock)

	return c.Status(200).JSON(responseStock)
}

func GetStockByID(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")

	var stock models.Stock
	if err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := findStockByID(uint(id), &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	responseStock := CreateResponseStock(stock)

	return c.Status(200).JSON(responseStock)
}

func UpdateStockByHSN(c *fiber.Ctx) error {
	hsn_code := c.Params("hsn_code")

	var stock models.Stock
	if hsn_code == "" {
		return c.Status(400).JSON(errors.New("HSN Code not provided"))
	}

	if err := findStockByHSN(hsn_code, &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := c.BodyParser(&stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	// insert validation here and updation business logic here

	type UpdateStock struct {
		HOQuantity     float32 `json:"ho_quantity"`
		GodownQuantity float32 `json:"godown_quantity"`
	}

	var updateData UpdateStock

	if err := c.BodyParser(&updateData); err != nil {
		fmt.Println("Updating stock :hsn_code failed. No data provided.")
		return c.Status(400).JSON(err.Error())
	}

	stock.HOQuantity = updateData.HOQuantity
	stock.GodownQuantity = updateData.GodownQuantity
	stock.CalculateTotalQuantity()
	stock.UpdatedAt = time.Now()

	if err := stock.Validate(); err != nil {
		fmt.Println("Stock validation failed")
		return c.Status(400).JSON(err.Error())
	}

	database.Database.Db.Save(&stock)
	responseStock := CreateResponseStock(stock)

	return c.Status(200).JSON(responseStock)
}

func UpdateStockByID(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")

	var stock models.Stock
	if err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := findStockByID(uint(id), &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := c.BodyParser(&stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	type UpdateStock struct {
		HOQuantity     float32 `json:"ho_quantity"`
		GodownQuantity float32 `json:"godown_quantity"`
	}

	var updateData UpdateStock

	if err := c.BodyParser(&updateData); err != nil {
		fmt.Println("Updating stock :id failed. No data provided.")
		return c.Status(400).JSON(err.Error())
	}

	stock.HOQuantity = updateData.HOQuantity
	stock.GodownQuantity = updateData.GodownQuantity
	// stock.CalculateTotalQuantity()
	stock.UpdatedAt = time.Now()

	if err := stock.Validate(); err != nil {
		fmt.Println("Stock validation failed")
		return c.Status(400).JSON(err.Error())
	}

	database.Database.Db.Save(&stock)
	responseStock := CreateResponseStock(stock)

	return c.Status(200).JSON(responseStock)
}

func DeleteStockByHSN(c *fiber.Ctx) error {
	hsn_code := c.Params("hsn_code")

	var stock models.Stock
	if hsn_code == "" {
		return c.Status(400).JSON(errors.New("HSN Code not provided"))
	}

	if err := findStockByHSN(hsn_code, &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	database.Database.Db.Delete(&stock)

	return c.Status(200).JSON("Stock deleted successfully")
}

func DeleteStockByID(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")

	var stock models.Stock
	if err != nil {
		return c.Status(400).JSON(err.Error())
	}

	if err := findStockByID(uint(id), &stock); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	database.Database.Db.Delete(&stock)

	return c.Status(200).JSON("Stock deleted successfully")
}

// func UpdateStockQuantity(c *fiber.Ctx) error {
// 	hsn_code := c.Params("hsn_code")

// 	var stock models.Stock
// 	if hsn_code == "" {
// 		return c.Status(400).JSON(errors.New("HSN Code not provided"))
// 	}

// 	if err := findStockByHSN(hsn_code, &stock); err != nil {
// 		return c.Status(400).JSON(err.Error())
// 	}

// 	type UpdateStock struct {
// 		HOQuantity     float32 `json:"ho_quantity"`
// 		GodownQuantity float32 `json:"godown_quantity"`
// 	}

// 	var updateData UpdateStock
// 	if err := c.BodyParser(&updateData); err != nil {
// 		fmt.Println("Updating stock :id failed. No data provided.")
// 		return c.Status(400).JSON(err.Error())
// 	}

// 	stock.HOQuantity = updateData.HOQuantity
// 	stock.GodownQuantity = updateData.GodownQuantity
// 	stock.TotalQuantity = stock.HOQuantity + stock.GodownQuantity
// 	database.Database.Db.Save(&stock)

// 	responseStock := CreateResponseStock(stock)

// 	return c.Status(200).JSON(responseStock)
// }
