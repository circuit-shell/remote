package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/rs/cors"

	"github.com/go-vgo/robotgo"
)

func main() {
	robotgo.MouseSleep = 100

	http.HandleFunc("/move", moveHandler)
	http.HandleFunc("/click", clickHandler)
	http.HandleFunc("/scroll", scrollHandler)

	fmt.Println("Mouse Control API Server")
	fmt.Println("Running on http://192.168.3.102:8080")
	fmt.Println("Available endpoints:")
	fmt.Println("  /move?x=<x>&y=<y>")
	fmt.Println("  /click?button=left|right")
	fmt.Println("  /scroll?amount=<amount>")

	// --url GET-http://192.168.3.102:8080/move?x=50&y=30 \

	log.Fatal(http.ListenAndServe(":8080", nil))

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"}, // Be more specific in production
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
	})

	handler := c.Handler(http.DefaultServeMux)
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", handler))
}

func moveHandler(w http.ResponseWriter, r *http.Request) {
	x, err := strconv.Atoi(r.URL.Query().Get("x"))
	if err != nil {
		http.Error(w, "Invalid x parameter", http.StatusBadRequest)
		return
	}

	y, err := strconv.Atoi(r.URL.Query().Get("y"))
	if err != nil {
		http.Error(w, "Invalid y parameter", http.StatusBadRequest)
		return
	}

	currentX, currentY := robotgo.GetMousePos()
	robotgo.MoveSmooth(currentX+x, currentY+y, 1.0, 5.0)
	fmt.Fprintf(w, "Moved mouse by x: %d, y: %d", x, y)
}

func clickHandler(w http.ResponseWriter, r *http.Request) {
	button := r.URL.Query().Get("button")
	if button != "left" && button != "right" {
		http.Error(w, "Invalid button parameter. Use 'left' or 'right'", http.StatusBadRequest)
		return
	}

	robotgo.Click(button, true)
	fmt.Fprintf(w, "Clicked %s button", button)
}

func scrollHandler(w http.ResponseWriter, r *http.Request) {
	amount, err := strconv.Atoi(r.URL.Query().Get("amount"))
	if err != nil {
		http.Error(w, "Invalid amount parameter", http.StatusBadRequest)
		return
	}

	robotgo.ScrollSmooth(amount, 5, 10.0)
	fmt.Fprintf(w, "Scrolled by amount: %d", amount)
}
