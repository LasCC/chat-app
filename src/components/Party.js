import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { TextField, Box, Container, Typography } from "@material-ui/core";
import Messages from "./Messages";
import "emoji-mart/css/emoji-mart.css";

let socket;

const Party = ({ location }) => {
	const [name, setName] = useState("");
	const [party, setParty] = useState("");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const ENDPOINT = "https://react-chat-app-ludovic.herokuapp.com/";

	useEffect(() => {
		const { name, party } = queryString.parse(location.search);
		// console.log(name, party); // thing + thing

		socket = io(ENDPOINT);

		setName(name);
		setParty(party);

		socket.emit("join", { name, party }, () => {});
		// console.log(socket); // return the unique user id

		return () => {
			socket.emit("disconnect"); // end of the useEffect the user left the party
			socket.off(); // turn it off
		};
	}, [ENDPOINT, location.search]);

	useEffect(() => {
		socket.on("message", message => {
			setMessages([...messages, message]); // add the message from the backend (admin welcome)
		});
	}, [messages]);

	// func send message
	const sendMessage = evt => {
		evt.preventDefault();

		if (message) {
			socket.emit("sendMessage", message, () => {
				setMessage("");
			});
		}
	};
	// console.log(message, messages); //display the array of the messages
	return (
		<>
			<Container maxWidth="lg">
				<Box
					style={{ height: "90vh", position: "relative" }}
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Box
						style={{
							padding: 35,
							boxShadow: "0px 10px 35px -4px rgba(0,0,0,0.15)",
							borderRadius: 10,
							height: "auto",
							width: "75%",
							backgroundColor: "white"
						}}
					>
						<Box
							display="flex"
							alignItems="center"
							style={{ padding: 0, margin: 0 }}
						>
							<span className="pulseAnim" />
							<Typography
								variant="h4"
								style={{ fontWeight: "bold", marginLeft: 10 }}
							>
								{party}
							</Typography>
						</Box>
						<Messages messages={messages} name={name} />
						<TextField
							value={message}
							variant="outlined"
							label="Type something"
							style={{ marginTop: 5 }}
							fullWidth
							onChange={evt => setMessage(evt.target.value)}
							onKeyPress={evt =>
								evt.key === "Enter" ? sendMessage(evt) : null
							}
						/>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default Party;
