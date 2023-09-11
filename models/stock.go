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
	StockName      string    `json:"stock_name" gorm:"not null" validate:"required,min=3,max=50"`
	HOQuantity     float32   `json:"ho_quantity" gorm:"not null;default:0" validate:"gte=0"`
	GodownQuantity float32   `json:"godown_quantity" gorm:"not null;default:0" validate:"gte=0"`
	TotalQuantity  float32   `json:"total_quantity" gorm:"not null;check:total_quantity_check:total_quantity = ho_quantity + godown_quantity" validate:"eqfield=HOQuantity+GodownQuantity"`
	Status         string    `json:"status" gorm:"not null;check:status_check:status IN ('In', 'Out','Transfer')" validate:"required,oneof=In Out Transfer"`
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
		if s.Status == "In" {
			fmt.Println("Inward to HO")
			s.HOQuantity += t.Inward
		} else if s.Status == "Out" {
			fmt.Println("Outward from HO")
			s.HOQuantity -= t.Outward
		} else if s.Status == "Transfer" && t.SupplySource == "Godown" {
			fmt.Println("Transfer to HO from Godown")
			s.HOQuantity += t.Inward
			s.GodownQuantity -= t.Outward
		}
	case "Godown":
		if s.Status == "In" {
			fmt.Println("Inward to Godown")
			s.GodownQuantity += t.Inward
		} else if s.Status == "Out" {
			fmt.Println("Outward to Godown")
			s.HOQuantity -= t.Outward
		} else if s.Status == "Transfer" && t.SupplySource == "HO" {
			fmt.Println("Transfer to Godowm from HO")
			s.GodownQuantity += t.Inward
			s.HOQuantity -= t.Outward
		}
	}
	if check := (s.TotalQuantity == s.HOQuantity+s.GodownQuantity); !check {
		return errors.New("total quantity not equal to sum of ho and godown quantity")
	}

	return nil
}
