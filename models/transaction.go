package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

/*
// Frontend input format:
Invoice: 15 and PartyName: SB and Status: S (I/O/T)
HSNCode StockName SupplySource Quantity
1. H1 S1 SS1 Q1
2. H2 S2 SS2 Q2
3. H3 S3 SS3 Q3

Feat: Auto load StockName from HSNCode
Feat: Autocomplete (fuzzy match) HSNCode, PartyName, SupplySource

//Backend data format:
Invoice PartyName Status HSNCode StockName SupplySource Quantity
15 SB P1 S SS1 Q1
15 SB P2 S SS2 Q2
15 SB P3 S SS3 Q3
*/

// check out gorm tags and features
// check out validation and how to use
type Transaction struct {
	ID            uint      `json:"id" gorm:"primaryKey" validate:"required"`
	CreatedAt     time.Time `json:"created_at" validate:"-"`
	UpdatedAt     time.Time `json:"updated_at" validate:"-"`
	InvoiceNumber string    `json:"invoice_number" validate:"required,min=3,max=50,alphanum"`
	PartyName     string    `json:"party_name" validate:"required,oneof=HO Godown"`                  // gorm:"not null;check:party_name IN ('HO', 'Godown')"`
	Status        string    `json:"status" gorm:"not null;check:status IN ('In', 'Out','Transfer')"` // validate:"required,oneof=In Out Transfer"`
	HSNCode       string    `json:"hsn_code" validate:"required,min=3,max=50,alphanum"`
	Stock         Stock     `gorm:"foreignKey:HSNCode"`
	SupplySource  string    `json:"supply_source" gorm:"not null" validate:"required,min=3,max=50,alphanum"`
	Quantity      float32   `json:"quantity" gorm:"default:0" validate:"gte=0"`
}

func (t *Transaction) Validate() error {
	validate := validator.New()
	return validate.Struct(t)
}

// Helper function to update a relevant item on a transaction i.e. Business Logic
