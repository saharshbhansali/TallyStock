package models

import (
	"errors"
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"
)

/*
Notes:

- Frontend input format:
	Invoice: X and Destination: Dest and Status: Status (I/O/T)

	HSNCode StockName Supply Quantity
	1. H1 SN1 S1 Q1
	2. H2 SN2 S2 Q2
	3. H3 SN3 S3 Q3

	Feat: Auto load StockName from HSNCode
	Feat: Autocomplete (fuzzy match) HSNCode, Destination, Supply

- Backend data format:

	Invoice Destination Status HSNCode StockName Supply Quantity
	X Dest P1 Status S1 Q1
	X Dest P2 Status S2 Q2
	X Dest P3 Status S3 Q3

- Business Logic:
	Check and commit to database only if total_quantity = ho_quantity + godown_quantity for each HSNCode (StockName) individually
		- If not, return error
		- If yes, commit to database

*/

// check out gorm tags and features
// check out validation and how to use
type Transaction struct {
	ID            uint      `json:"id" gorm:"primaryKey" validate:"required"`
	CreatedAt     time.Time `json:"created_at" validate:"-"`
	UpdatedAt     time.Time `json:"updated_at" validate:"-"`
	Date          time.Time `json:"date" validate:"date"`
	InvoiceNumber string    `json:"invoice_number" validate:"required,min=3,max=50,alphanum"`
	Destination   string    `json:"destination" validate:"required,min=2,max=50,alphanum"`            // gorm:"not null;check:party_name IN ('HO', 'Godown')"`
	Status        string    `json:"status" gorm:"not null" validate:"required,oneof=In Out Transfer"` // gorm:"not null;check:status IN ('In', 'Out','Transfer')"`
	HSNCode       string    `json:"hsn_code" validate:"required,min=3,max=50,alphanum"`
	Stock         Stock     `gorm:"foreignKey:hsn_code"`
	Supply        string    `json:"storage" gorm:"not null" validate:"required,min=3,max=50,alphanum"`
	Quantity      float32   `json:"quantity" gorm:"default:0" validate:"gte=0"`
}

func (t *Transaction) Validate() error {
	validate := validator.New()
	return validate.Struct(t)
}

// Helper function to update a relevant item on a transaction i.e. Business Logic
func (t *Transaction) BusinessLogic(s *Stock) error {
	fmt.Println("Business Logic")
	switch t.Supply {
	case "HO":
		if t.Status == "In" {
			fmt.Println("Inward to HO")
			s.HOQuantity += t.Quantity
			s.TotalQuantity += t.Quantity
		} else if t.Status == "Out" {
			fmt.Println("Outward from HO")
			s.HOQuantity -= t.Quantity
			s.TotalQuantity -= t.Quantity
		} else if t.Status == "Transfer" && t.Destination == "Godown" {
			fmt.Println("Transfer to Godown from HO")
			s.HOQuantity -= t.Quantity
			s.GodownQuantity += t.Quantity
		}
	case "Godown":
		if t.Status == "In" {
			fmt.Println("Inward to Godown")
			s.GodownQuantity += t.Quantity
			s.TotalQuantity += t.Quantity
		} else if t.Status == "Out" {
			fmt.Println("Outward to Godown")
			s.GodownQuantity -= t.Quantity
			s.TotalQuantity -= t.Quantity
		} else if t.Status == "Transfer" && t.Destination == "HO" {
			fmt.Println("Transfer to HO from Godown")
			s.GodownQuantity -= t.Quantity
			s.HOQuantity += t.Quantity
		}
	}
	if check := (s.TotalQuantity == s.HOQuantity+s.GodownQuantity); !check {
		return errors.New("total quantity not equal to sum of ho and godown quantity")
	}

	err := s.Validate()
	if err != nil {
		return errors.New("stock validation failed")
	}

	return nil
}
