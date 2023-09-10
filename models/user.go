package models

import (
	"time"
)

type User struct {
	ID        uint `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time
	FirsName  string `json:"first_name" gorm:"not null"`
	LastName  string `json:"last_name"`
}
