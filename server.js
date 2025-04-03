const WebSocket = require("ws");
const express = require("express");

const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

let currentAuction = { player: "No Player", bid: 0, team: "None" };
let players = ["Virat Kohli", "Rohit Sharma", "Jasprit Bumrah", "MS Dhoni"];

wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "auctionUpdate", data: currentAuction }));

    socket.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "startAuction") {
            currentAuction = { player: players[0], bid: 0, team: "None" };
            broadcast();
        }

        if (data.type === "placeBid") {
            if (data.bid > currentAuction.bid) {
                currentAuction = { player: currentAuction.player, bid: data.bid, team: data.team };
                broadcast();
            }
        }

        if (data.type === "finalizeBid") {
            players.shift();
            currentAuction = players.length > 0 ? { player: players[0], bid: 0, team: "None" } : { player: "Auction Over", bid: 0, team: "None" };
            broadcast();
        }
    });
});

function broadcast() {
    wss.clients.forEach(client => client.send(JSON.stringify({ type: "auctionUpdate", data: currentAuction })));
}

server.listen(3000, () => console.log("Server running on port 3000"));
