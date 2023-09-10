package database

import (
	"log"
	"os"

	"github.com/saharshbhansali/TallyStock/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DBInstance struct {
	Db *gorm.DB
}

var Database DBInstance

func ConnectDB() {
	db, err := gorm.Open(postgres.Open("api.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database!\n", err.Error())
		os.Exit(2)
	}

	log.Print("Database successfully connected!\n")
	db.Logger = db.Logger.LogMode(logger.Info)

	log.Print("Migrating database...\n")
	// TODO: migrate database
	db.AutoMigrate(&models.User{})

	Database = DBInstance{Db: db}

}
