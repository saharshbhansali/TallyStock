package database

import (
	"log"
	"os"

	"github.com/saharshbhansali/TallyStock/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	// "gorm.io/driver/sqlite"
)

type DBInstance struct {
	Db *gorm.DB
}

var Database DBInstance

func ConnectDB() {
	// Connect to database

	// If using SQLite
	// db, err := gorm.Open(sqlite.Open("build/api.db"), &gorm.Config{})

	// If using Postgres
	dsn := "user=postgres dbname=postgres password=TallyStock host=localhost sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("failed to connect database!\n", err.Error())
		os.Exit(2)
	}

	log.Print("Database successfully connected!\n")
	db.Logger = db.Logger.LogMode(logger.Info)

	log.Print("Migrating database...\n")
	// Migrate database
	db.AutoMigrate(&models.User{}, &models.Product{}, &models.Order{}, &models.Transaction{}, &models.Stock{})

	Database = DBInstance{Db: db}

}
