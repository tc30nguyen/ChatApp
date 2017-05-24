package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Message struct {
	Username string `json:"username"`
	Message string `json:"message"`
}

func handleConnections(clients map[*websocket.Conn]bool, broadcast chan Message, upgrader websocket.Upgrader) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("Websocket init error. %v", err)
			return
		}
		log.Printf("Connected %v", ws.LocalAddr())
		// broadcast <- Message{"userA", "test msg"}
		defer ws.Close()

		clients[ws] = true
		for {
			var msg Message
			err := ws.ReadJSON(&msg)
			if err != nil {
				log.Printf("error: %v.\nmsg: %v", err, msg)
				delete(clients, ws)
				break
			}
			broadcast <- msg
		}
	}
}

func handleMessages(clients map[*websocket.Conn]bool, broadcast chan Message) {
	for {
		msg := <- broadcast
		log.Printf("new message: %v", msg)
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v.\nmsg: %v", err, msg)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	var clients = make(map[*websocket.Conn]bool)
	var broadcast = make(chan Message)
	var upgrader = websocket.Upgrader{
		// TODO: remove this later. Just for local dev
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	http.HandleFunc("/ws", handleConnections(clients, broadcast, upgrader))
	go handleMessages(clients, broadcast)

	log.Println("http server started on :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal(err)
	}
}