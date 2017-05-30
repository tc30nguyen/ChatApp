package main

import (
	"log"
	"net/http"
	"errors"
	"crypto/rand"
	"math/big"

	"github.com/gorilla/websocket"
)

type message struct {
	username string `json:"username"`
	message string `json:"message"`
	userId string `json:"id"`
}

type user struct {
	username string
	token string
	ws *websocket.Conn
}

func handleConnections(
	clients map[string]user,
	broadcast chan message,
	upgrader websocket.Upgrader,
	userId string) func(w http.ResponseWriter, r *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {
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
	clients map[string]user) (string, error) {
	
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

func handleMessages(clients map[string]user, broadcast chan message){
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

func handleGetUsername(
	clients map[string]user,
	userId string) func(http.ResponseWriter, *http.Request) {

	return func(resWriter http.ResponseWriter, req *http.Request) {
		var msg message
		err := json.NewDecoder(req.Body).Decode(&msg)
		if err != nil {
			log.Printf("getUsername error: %v", err)
		}
		defer req.Body.Close()

		username := msg.message
		if _, present := clients[username]; !present {
			var token big.Int
			clients[username] = user{username, userId}
			resWriter.Write([]byte())
		}
		else {
			resWriter.WriteHeader(http.StatusConflict)
			resWriter.Write()
		}
	}
}

func main() {
	var clients = make(map[string]user)
	var broadcast = make(chan message)
	var upgrader = websocket.Upgrader{
		// TODO: remove this later. Just for local dev
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	userId := "testabc123" //temp

	http.HandleFunc("/username", handleGetUsername(clients, userId))
	http.HandleFunc("/ws", handleConnections(clients, broadcast, upgrader, userId))
	go handleMessages(clients, broadcast)

	log.Println("http server started on :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal(err)
	}
}