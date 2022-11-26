package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"strconv"
	"time"
)

func main() {
	// Open csv file date_hood_thefts.csv
	f, err := os.Open("date_hood_thefts.csv")
	if err != nil {
		fmt.Println(err)
	}

	// Read csv file
	r := csv.NewReader(f)
	records, err := r.ReadAll()
	if err != nil {
		fmt.Println(err)
	}

	// Loop though records and track seen dates and neighborhoods
	seenDates := make(map[string]map[int]int)
	for _, record := range records {
		// If date is not in seenDates, add it
		if _, ok := seenDates[record[0]]; !ok {
			// There are 158 neighborhoods in the city
			// Create a default map where key starts at 1 and ends at 158 set to false and 0 is undefined
			seenDates[record[0]] = make(map[int]int)
			for i := 0; i <= 158; i++ {
				seenDates[record[0]][i] = 0
			}
		}
		// NSA will be 0
		if record[1] == "NSA" {
			record[1] = "0"
		}
		// get neighborhood id as int
		hood, err := strconv.Atoi(record[1])
		if err != nil {
			fmt.Println(err)
		}
		seenDates[record[0]][hood] = seenDates[record[0]][hood] + 1
	}

	firstDate := "2015-01-01"
	lastDate := "2022-06-30"

	// Convert firstDate and lastDate to time.Time
	start, err := time.Parse("2006-01-02", firstDate)
	if err != nil {
		fmt.Println(err)
	}
	end, err := time.Parse("2006-01-02", lastDate)
	if err != nil {
		fmt.Println(err)
	}

	// Loop through start and end dates
	for date := start; date.Before(end); date = date.AddDate(0, 0, 1) {
		// If date is not in seenDates, add it
		if _, ok := seenDates[date.Format("2006-01-02")]; !ok {
			// Set the 158 default map
			seenDates[date.Format("2006-01-02")] = make(map[int]int)
			for i := 0; i <= 158; i++ {
				seenDates[date.Format("2006-01-02")][i] = 0
			}
		}
	}

	// Create csv file
	f, err = os.Create("date_hood_thefts_filled.csv")
	if err != nil {
		fmt.Println(err)
	}

	// Create csv writer
	w := csv.NewWriter(f)

	// Loop through seenDates and write to csv
	for date := start; date.Before(end); date = date.AddDate(0, 0, 1) {
		for hood := 0; hood <= 158; hood++ {
			// Write to csv
			w.Write([]string{date.Format("2006-01-02"), strconv.Itoa(hood), strconv.Itoa(seenDates[date.Format("2006-01-02")][hood])})
		}
	}

	// Flush csv writer
	w.Flush()
}
