import React from "react";
import { Typography } from "@material-ui/core";
const moment = require("moment");

const Message = ({ message: { user, text }, name }) => {
	let isSentByCurrentUser = false;

	const trimmedUser = name.trim().toLowerCase();

	if (user === trimmedUser) {
		isSentByCurrentUser = true;
	}

	return isSentByCurrentUser ? (
		<div className="chat">
			<div className="mine messages">
				<div>
					<Typography variant="body2">
						{trimmedUser} - {moment().calendar()}
					</Typography>
				</div>
				<div className="message last">{text}</div>
			</div>
		</div>
	) : (
		<div className="chat">
			<div className="yours messages">
				<div>
					<Typography variant="body2">
						{user} - {moment().calendar()}
					</Typography>
				</div>
				<div className="message last">{text}</div>
			</div>
		</div>
	);
};

export default Message;
