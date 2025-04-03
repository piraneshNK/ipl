const socket = new WebSocket("https://calico-mercury-skink.glitch.me");
// Replace with your WebSocket URL

let teamName = localStorage.getItem("teamName") || "";
let budget = 100000000;

function placeBid(amount) {
    if (budget >= amount) {
        socket.send(JSON.stringify({ type: "placeBid", bid: amount, team: teamName }));
    }
}

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "auctionUpdate") {
        document.getElementById("playerName").innerText = "Current Player: " + data.data.player;
        document.getElementById("highestBid").innerText = "Highest Bid: ₹" + data.data.bid;
        document.getElementById("highestBidder").innerText = "Team: " + data.data.team;
    }
};

function startAuction() {
    socket.send(JSON.stringify({ type: "startAuction" }));
}

function nextPlayer() {
    socket.send(JSON.stringify({ type: "finalizeBid" }));
}
