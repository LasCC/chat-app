import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
	TextField,
	Typography,
	List,
	Toolbar,
	Divider,
	ListItem,
	ListItemIcon,
	ListItemText,
	AppBar,
	Drawer,
	Tooltip
} from "@material-ui/core";
import Messages from "./Messages";
import "emoji-mart/css/emoji-mart.css";
import ForumIcon from "@material-ui/icons/Forum";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

let socket;
const drawerWidth = 45;

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex"
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		backgroundColor: "white",
		boxShadow: "0px 14px 24px -10px rgba(0,0,0,0.25)"
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: 36
	},
	hide: {
		display: "none"
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap"
	},
	drawerClose: {
		marginRight: 15,
		border: "none",
		borderRadius: "0px 15px 15px 0px"
	},
	toolbar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: theme.spacing(0, 1),
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	}
}));

const Party = ({ location }) => {
	const classes = useStyles();
	const [open] = React.useState(false);

	const [name, setName] = useState("");
	const [party, setParty] = useState("");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	// const ENDPOINT = "localhost:5000";
	const ENDPOINT = "http://react-chat-app-ludovic.herokuapp.com/";

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
			<div className={classes.root}>
				<AppBar
					position="fixed"
					className={clsx(classes.appBar, {
						[classes.appBarShift]: open
					})}
				>
					<Toolbar>
						<span className="pulseAnim" style={{ marginRight: 15 }} />
						<Typography
							variant="h5"
							noWrap
							style={{ color: "black", fontWeight: "bold" }}
						>
							{party}
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					className={clsx(classes.drawer, {
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open
					})}
					classes={{
						paper: clsx({
							[classes.drawerOpen]: open,
							[classes.drawerClose]: !open
						})
					}}
				>
					<div className={classes.toolbar} />
					<Divider />
					<List>
						<Tooltip title="Chat">
							<ListItem button>
								<ListItemIcon>
									<ForumIcon />
								</ListItemIcon>
								<ListItemText />
							</ListItem>
						</Tooltip>
						<Tooltip title="Settings">
							<ListItem button>
								<ListItemIcon>
									<SettingsIcon />
								</ListItemIcon>
								<ListItemText />
							</ListItem>
						</Tooltip>
						<a href="/">
							<Tooltip title="Quit the party">
								<ListItem button>
									<ListItemIcon>
										<ExitToAppIcon />
									</ListItemIcon>
									<ListItemText />
								</ListItem>
							</Tooltip>
						</a>
					</List>
				</Drawer>
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<Messages messages={messages} name={name} />
					<TextField
						value={message}
						variant="outlined"
						label="Type something"
						style={{ marginTop: 5 }}
						fullWidth
						onChange={evt => setMessage(evt.target.value)}
						onKeyPress={evt => (evt.key === "Enter" ? sendMessage(evt) : null)}
					/>
				</main>
			</div>
		</>
	);
};

export default Party;
