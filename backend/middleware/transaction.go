package middleware

import (
	"fmt"

	"github.com/saharshbhansali/TallyStock/database"
	"github.com/saharshbhansali/TallyStock/models"
)

// Helper function to update a relevant item on a transaction i.e. Business Logic
func BusinessLogic(t *models.Transaction) error {
	s := t.Stock
	fmt.Println("Business Logic")
	switch t.Supply {
	case "HO":
		if t.Status == "Incoming" {
			fmt.Println("Inward to HO")
			s.HOQuantity += t.Quantity
			s.TotalQuantity += t.Quantity
		} else if t.Status == "Outgoing" {
			fmt.Println("Outward from HO")
			s.HOQuantity -= t.Quantity
			s.TotalQuantity -= t.Quantity
		} else if t.Status == "Transfer" && t.Destination == "Godown" {
			fmt.Println("Transfer to Godown from HO")
			s.HOQuantity -= t.Quantity
			s.GodownQuantity += t.Quantity
		}
	case "Godown":
		if t.Status == "Incoming" {
			fmt.Println("Inward to Godown")
			s.GodownQuantity += t.Quantity
			s.TotalQuantity += t.Quantity
		} else if t.Status == "Outgoing" {
			fmt.Println("Outward to Godown")
			s.GodownQuantity -= t.Quantity
			s.TotalQuantity -= t.Quantity
		} else if t.Status == "Transfer" && t.Destination == "HO" {
			fmt.Println("Transfer to HO from Godown")
			s.GodownQuantity -= t.Quantity
			s.HOQuantity += t.Quantity
		}
	}
	// if check := (s.TotalQuantity == s.HOQuantity+s.GodownQuantity); !check {
	// 	fmt.Println("total quantity not equal to sum of ho and godown quantity")
	// 	return errors.New("total quantity not equal to sum of ho and godown quantity")
	// }
	s.CalculateTotalQuantity()

	err := s.Validate()
	if err != nil {
		fmt.Println("Stock validation failed")
		return err //errors.New("stock validation failed")
	}

	database.Database.Db.Save(&s)

	return nil
}

// reversion  logic is flawed/broken

func RevertTransaction(t *models.Transaction) error {
	s := t.Stock
	fmt.Println("Revert Transaction")
	switch t.Supply {
	case "HO":
		if t.Status == "Incoming" {
			fmt.Println("Reverting: Inward to HO")
			s.HOQuantity -= t.Quantity
			s.TotalQuantity -= t.Quantity
		} else if t.Status == "Outgoing" {
			fmt.Println("Reverting: Outward from HO")
			s.HOQuantity += t.Quantity
			s.TotalQuantity += t.Quantity
		} else if t.Status == "Transfer" && t.Destination == "Godown" {
			fmt.Println("Reverting: Transfer to Godown from HO")
			s.HOQuantity += t.Quantity
			s.GodownQuantity -= t.Quantity
		}
	case "Godown":
		if t.Status == "Incoming" {
			fmt.Println("Reverting: Inward to Godown")
			s.GodownQuantity -= t.Quantity
			s.TotalQuantity -= t.Quantity
		} else if t.Status == "Outgoing" {
			fmt.Println("Reverting: Outward to Godown")
			s.GodownQuantity += t.Quantity
			s.TotalQuantity += t.Quantity
		} else if t.Status == "Transfer" && t.Destination == "HO" {
			fmt.Println("Reverting: Transfer to HO from Godown")
			s.GodownQuantity += t.Quantity
			s.HOQuantity -= t.Quantity
		}
	}
	// if check := (s.TotalQuantity == s.HOQuantity+s.GodownQuantity); !check {
	// 	fmt.Println("total quantity not equal to sum of ho and godown quantity")
	// 	return errors.New("total quantity not equal to sum of ho and godown quantity")
	// }
	s.CalculateTotalQuantity()

	err := s.Validate()
	if err != nil {
		fmt.Println("Stock revertion validation failed")
		return err //errors.New("stock validation failed")
	}

	database.Database.Db.Save(&s)

	return nil
}
