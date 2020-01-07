const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const { addUser, removeUser, getUser, getUserInParty } = require("./users");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors());

io.on("connection", socket => {
	console.log("New connection ! YAY");

	socket.on("join", ({ name, party }, callback) => {
		// console.log(name, party); // display the name and the party of the user
		const { error, user } = addUser({ id: socket.id, name, party });

		if (error) return callback(error);

		socket.emit("message", {
			user: "#root",
			text: `Welcome ${user.name}, be nice.`
		});
		socket.broadcast.to(user.party).emit("message", {
			user: "#root",
			text: `${user.name}, has joined the party.`
		});

		io.to(user.party).emit("partyData", {
			party: user.party,
			users: getUserInParty(user.party)
		});

		socket.join(user.party);

		callback();
	});

	socket.on("sendMessage", (message, callback) => {
		const user = getUser(socket.id);

		io.to(user.party).emit("message", { user: user.name, text: message });
		callback();
	});

	socket.on("disconnect", () => {
		const user = removeUser(socket.id);

		if (user) {
			io.to(user.party).emit("message", {
				user: "#root",
				text: `${user.name} left the party.`
			});
			io.to(user.room).emit("partyData", {
				party: user.party,
				users: getUserInParty(user.party)
			});
		}
	});
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
