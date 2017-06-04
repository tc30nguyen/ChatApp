package main

import (
	"log"
	"net/http"
	"errors"

	"github.com/gorilla/websocket"
)

type message struct {
	Username string `json:"username"`
	Message string `json:"message"`
	UserId string `json:"id"`
}

type user struct {
	username string
	id string
	ws *websocket.Conn
}

func handleConnections(
	clients map[string]*user,
	readMessages func(user),
	upgrader websocket.Upgrader) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("Websocket init error. %v", err)
			return
		}
		defer ws.Close()

		user, err := getUsername(ws, clients)
		if err != nil {
			log.Println(err)
			return
		}
		defer delete(clients, user.id)
		user.ws = ws

		broadcastUsernames(*user, clients)
		readMessages(*user)
	}
}

func getUsername(ws *websocket.Conn, clients map[string]*user) (*user, error) {
	var msg message
	err := ws.ReadJSON(&msg)
	if _, present := clients[msg.Username]; err != nil || !present {
		log.Printf("error: %v.\nmsg: %+v", err, msg)
		return &user{}, errors.New("username was not yet allocated")
	}
	return clients[msg.Username], nil
}

// send new user a list of current peers and notify peers of the new user
func broadcastUsernames(user user, clients map[string]*user) {
	peers := make([]string, len(clients) - 1)
	idx := 0
	for peerName, peer := range clients {
		if peerName != user.username {
			// peers = append(peers, peerName)
			peers[idx] = peerName
			err := peer.ws.WriteJSON(message{Username: user.username, UserId: "Server"})
			if err != nil {
				log.Printf(
					"Error notifying %s of new user: %s.\n%v", 
					peerName, 
					user.username, 
					err,
				)
				delete(clients, peerName)
			}
			idx++
		}
	}

	err := user.ws.WriteJSON(peers)
	if err != nil {
		log.Printf("%v", err)
	}
}

// adds messages received from a user to the broadcast channel
func readMessages(broadcast chan message) func(user) {
	return func(user user) {
		for {
			var msg message
			err := user.ws.ReadJSON(&msg)
			if err != nil || msg.UserId != user.id {
				log.Printf("error: %v.\nmsg: %+v", err, msg)
				break
			}
			broadcast <- message{
				Username: user.username,
				Message: msg.Message,
			}
		}
	}
}

// broadcasts messages in the broadcast channel to all users
func handleMessages(clients map[string]*user, broadcast chan message){
	for {
		msg := <- broadcast
		for username, user := range clients {
			err := user.ws.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v.\nmsg: %v", err, msg)
				user.ws.Close()
				delete(clients, username)
			}
		}
	}
}

func main() {
	clients := make(map[string]*user)
	broadcast := make(chan message)
	upgrader := websocket.Upgrader{
		// TODO: remove this later. Just for local dev
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	http.HandleFunc("/username", HandleGetUsername(clients))
	http.HandleFunc(
		"/ws", 
		handleConnections(clients, readMessages(broadcast), upgrader),
	)
	go handleMessages(clients, broadcast)

	log.Println("http server started on :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal(err)
	}
}