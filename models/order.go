package models

import (
	"time"
)

type Order struct {
	ID           uint `json:"id" gorm:"primaryKey"`
	CreatedAt    time.Time
	ProductRefer uint    `json:"product_refer" gorm:"not null"`
	Product      Product `gorm:"foreignKey:ProductRefer"`
	UserRefer    uint    `json:"user_refer" gorm:"not null"`
	User         User    `gorm:"foreignKey:UserRefer"`
}
