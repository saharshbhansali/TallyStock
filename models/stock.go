package models

import (
	"errors"
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"
)

type Stock struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	CreatedAt      time.Time `json:"created_at" validate:"-"`
	UpdatedAt      time.Time `json:"updated_at" validate:"-"`
	HSNCode        string    `json:"hsn_code" gorm:"not null" validate:"required,min=3,max=50,alphanum"`
	StockName      string    `json:"stock_name" gorm:"not null" validate:"required,min=3,max=50"`
	HOQuantity     float32   `json:"ho_quantity" gorm:"not null;default:0" validate:"gte=0"`
	GodownQuantity float32   `json:"godown_quantity" gorm:"not null;default:0" validate:"gte=0"`
	TotalQuantity  float32   `json:"total_quantity" validate:"get=0,eqfield=HOQuantity+GodownQuantity"` // gorm:"not null;check:total_quantity = ho_quantity + godown_quantity"`
	// SerialNumber string `json:"serial_number"`
}

func (s *Stock) Validate() error {
	validate := validator.New()
	return validate.Struct(s)
}

// Helper function to update a relevant item on a transaction s.e. Business Logic

func (s *Stock) BusinessLogic(t *Transaction) error {
	switch t.PartyName {
	case "HO":
		if t.Status == "In" {
			fmt.Println("Inward to HO")
			s.HOQuantity += t.Quantity
		} else if t.Status == "Out" {
			fmt.Println("Outward from HO")
			s.HOQuantity -= t.Quantity
		} else if t.Status == "Transfer" && t.SupplySource == "Godown" {
			fmt.Println("Transfer to HO from Godown")
			s.HOQuantity += t.Quantity
			s.GodownQuantity -= t.Quantity
		}
	case "Godown":
		if t.Status == "In" {
			fmt.Println("Inward to Godown")
			s.GodownQuantity += t.Quantity
		} else if t.Status == "Out" {
			fmt.Println("Outward to Godown")
			s.HOQuantity -= t.Quantity
		} else if t.Status == "Transfer" && t.SupplySource == "HO" {
			fmt.Println("Transfer to Godowm from HO")
			s.GodownQuantity += t.Quantity
			s.HOQuantity -= t.Quantity
		}
	}
	if check := (s.TotalQuantity == s.HOQuantity+s.GodownQuantity); !check {
		return errors.New("total quantity not equal to sum of ho and godown quantity")
	}

	return nil
}
