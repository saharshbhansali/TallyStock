package database

import (
	"log"
	"os"

	"github.com/saharshbhansali/TallyStock/models"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DBInstance struct {
	Db *gorm.DB
}

var Database DBInstance

func ConnectDB() {
	// Connect to database
	dbSoftware := "sqlite"
	var db *gorm.DB
	var err error

	if dbSoftware == "sqlite" {
		// If using SQLite
		db, err = gorm.Open(sqlite.Open("build/api.db"), &gorm.Config{})

		if err != nil {
			log.Fatal("failed to connect database!\n", err.Error())
			os.Exit(2)
		}

	} else if dbSoftware == "postgres" {
		// If using Postgres
		dsn := "user=postgres dbname=postgres password=TallyStock host=localhost sslmode=disable"
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

		if err != nil {
			log.Fatal("failed to connect database!\n", err.Error())
			os.Exit(2)
		}
	}

	log.Print("Database successfully connected!\n")
	db.Logger = db.Logger.LogMode(logger.Info)

	log.Print("Migrating database...\n")
	// Migrate database
	db.AutoMigrate(&models.Stock{}, &models.Transaction{})

	Database = DBInstance{Db: db}

}
