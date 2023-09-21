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
	ID             uint      `json:"id" gorm:"primaryKey:pk_stock_id;auto_increment" `
	CreatedAt      time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt      time.Time `json:"updated_at" validate:"-"`                                         // gorm:"autoUpdateTime"`
	HSNCode        string    `json:"hsn_code" gorm:"primaryKey:pk_hsn_code;uniqueIndex:idx_hsn_code"` // gorm:"primaryKey:pk_hsn_code;"
	StockName      string    `json:"stock_name" gorm:"index:idx_stock_name" validate:"required,min=3,max=50"`
	HOQuantity     float32   `json:"ho_quantity" validate:"gte=0"`
	GodownQuantity float32   `json:"godown_quantity" validate:"gte=0"`
	TotalQuantity  float32   `json:"total_quantity" validate:"gte=0,totalqty"` // gorm:"not null;check:total_quantity = ho_quantity + godown_quantity"`
}

func (s *Stock) CalculateTotalQuantity() {
	s.TotalQuantity = s.HOQuantity + s.GodownQuantity
}

func (s *Stock) Validate() error {
	// s.TotalQuantity = s.HOQuantity + s.GodownQuantity
	validate := validator.New()
	validate.RegisterValidation("totalqty", s.validateTotalQuantity)

	return validate.Struct(s)
}

func (s *Stock) validateTotalQuantity(fl validator.FieldLevel) bool {
	return s.TotalQuantity == s.HOQuantity+s.GodownQuantity
}

// Helper function to update a relevant item on a transaction s.e. Business Logic
