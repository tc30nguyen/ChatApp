package main

import (
	"log"
	"net/http"
	"errors"

	"github.com/gorilla/websocket"
)

type message struct {
	username string `json:"username"`
	message string `json:"message"`
	userId string `json:"id"`
}

func handleConnections(
	clients map[string]*websocket.Conn,
	broadcast chan message,
	upgrader websocket.Upgrader) func(w http.ResponseWriter, r *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {
		userId := "testabc123" //temp

		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("Websocket init error. %v", err)
			return
		}
		defer ws.Close()

		username, err := getUsername(ws, userId, clients)
		if err != nil {
			log.Println(err)
			return
		}
		clients[username] = ws
		defer delete(clients, username)

		readMessages(username, ws, userId, broadcast)
	}
}

func getUsername(
	ws *websocket.Conn,
	userId string,
	clients map[string]*websocket.Conn) (string, error) {
	
	for {
		var msg message
		err := ws.ReadJSON(&msg)
		if err != nil || msg.userId != userId {
			log.Printf("error: %v.\nmsg: %v", err, msg)
			break
		}

		if _, present := clients[msg.message]; !present {
			return msg.message, nil
		}
	}
	return "", errors.New("Client failed to set username")
}

func readMessages(
	username string,
	ws *websocket.Conn,
	userId string,
	broadcast chan message){
	
	for {
		var msg message
		err := ws.ReadJSON(&msg)
		if err != nil || msg.userId != userId {
			log.Printf("error: %v.\nmsg: %v", err, msg)
			break
		}
		broadcast <- message{username: username, message: msg.message}
	}
}

func handleMessages(clients map[string]*websocket.Conn, broadcast chan message){
	for {
		msg := <- broadcast
		for username, client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v.\nmsg: %v", err, msg)
				client.Close()
				delete(clients, username)
			}
		}
	}
}

func main() {
	var clients = make(map[string]*websocket.Conn)
	var broadcast = make(chan message)
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