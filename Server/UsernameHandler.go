package main

import (
	"crypto/rand"
	"encoding/json"
	"net/http"
	"fmt"
	"log"
)

// returns function to handle client requesting a username
func HandleGetUsername(clients map[string]*user) http.HandlerFunc {
	return func(resWriter http.ResponseWriter, req *http.Request) {
		var msg message
		err := json.NewDecoder(req.Body).Decode(&msg)
		if err != nil {
			log.Printf("getUsername error: %v -- asdf", err)
			resWriter.WriteHeader(http.StatusInternalServerError)
			resWriter.Write([]byte(fmt.Sprintf("%+v", err)))
			return
		}
		defer req.Body.Close()

		resWriter.Header().Set("Access-Control-Allow-Origin", "*")
		username := msg.Message
		if _, present := clients[username]; !present {
			// generate token
			userId := make([]byte, 32)
			rand.Read(userId)
			clients[username] = &user{username: username, id: fmt.Sprintf("%x", userId)}
			resWriter.Write([]byte(fmt.Sprintf("%x", userId)))
			log.Printf("Username <%s> has been allocated\n", username)
		} else {
			resWriter.WriteHeader(http.StatusConflict)
			resWriter.Write(make([]byte, 0))
		}
	}
}