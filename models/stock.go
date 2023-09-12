package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

/*
Notes:

- Display TotalQuantity before HOQuantity and GodownQuantity in frontend
- Test total_quantity validation properly
*/
type Stock struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	CreatedAt      time.Time `json:"created_at" validate:"-"`
	UpdatedAt      time.Time `json:"updated_at" validate:"-"`
	HSNCode        string    `json:"hsn_code" gorm:"not null;unique" validate:"required,min=3,max=50,alphanum"`
	StockName      string    `json:"stock_name" gorm:"not null" validate:"required,min=3,max=50"`
	HOQuantity     float32   `json:"ho_quantity" gorm:"not null;default:0" validate:"-"`
	GodownQuantity float32   `json:"godown_quantity" gorm:"not null;default:0" validate:"-"`
	TotalQuantity  float32   `json:"total_quantity" validate:"get=0,eqfield=HOQuantity+GodownQuantity"` // gorm:"not null;check:total_quantity = ho_quantity + godown_quantity"`
}

func (s *Stock) Validate() error {
	validate := validator.New()
	return validate.Struct(s)
}

// Helper function to update a relevant item on a transaction s.e. Business Logic
