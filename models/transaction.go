package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

// check out gorm tags and features
// check out validation and how to use
type Transaction struct {
	ID            uint      `json:"id" gorm:"primaryKey" validate:"required"`
	CreatedAt     time.Time `json:"created_at" validate:"-"`
	InvoiceNumber string    `json:"invoice_number" validate:"required,min=3,max=50,alphanum"`
	PartyName     string    `json:"party_name" validate:"required,oneof=HO Godown"` // gorm:"not null;check:party_name IN ('HO', 'Godown')"`
	SupplySource  string    `json:"supply_source" gorm:"not null" validate:"required,min=3,max=50"`
	Inward        float32   `json:"inward" gorm:"default:0" validate:"gte=0"`
	Outward       float32   `json:"outward" gorm:"default:0" validate:"gte=0"`
}

func (t *Transaction) Validate() error {
	validate := validator.New()
	return validate.Struct(t)
}

// Helper function to update a relevant item on a transaction i.e. Business Logic
