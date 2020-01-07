import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	Typography,
	Box,
	Container,
	Grid,
	TextField,
	Button
} from "@material-ui/core";

export default props => {
	const [name, setName] = useState("");
	const [party, setParty] = useState("");

	return (
		<Container maxWidth="lg">
			<Box
				style={{ height: "90vh", position: "relative", zIndex: "10" }}
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Box
					className="hoverCard"
					style={{
						padding: 35,
						boxShadow: "0px 10px 35px -4px rgba(0,0,0,0.15)",
						borderRadius: 10,
						backgroundColor: "white"
					}}
				>
					<Grid container>
						<Grid container justify="center" alignItems="center">
							<i
								className="uil uil-comments-alt"
								style={{ fontWeight: "bold", marginRight: 15, fontSize: 35 }}
							/>
							<Typography
								variant="h4"
								style={{
									marginBottom: 10,
									marginTop: 5,
									display: "flex",
									fontWeight: "bold"
								}}
								align="center"
							>
								Chat app
							</Typography>
						</Grid>
					</Grid>
					<TextField
						variant="outlined"
						label="Username"
						onChange={evt => setName(evt.target.value)}
						type="text"
						fullWidth
						style={{
							marginTop: 20
						}}
					/>
					<TextField
						variant="outlined"
						label="Party"
						onChange={evt => setParty(evt.target.value)}
						type="text"
						fullWidth
						style={{
							marginTop: 20
						}}
					/>
					<Link
						onClick={evt =>
							!name || !party
								? evt.preventDefault(alert("Alert handler here"))
								: null
						}
						to={`/party?name=${name}&party=${party}`}
						style={{ textDecoration: "none" }}
					>
						<Button
							fullWidth
							className="gradiantColor"
							style={{
								marginTop: 15,
								color: "white",
								background:
									"linear-gradient(to right, #00d0ea 0%, #0085d1 100%)",
								fontWeight: "bold",
								backgroundSize: "cover",
								backgroundPosition: "bottom",
								backgroundRepeat: "no-repeat",
								borderRadius: 8
							}}
						>
							Let's party !
						</Button>
					</Link>
				</Box>
			</Box>
		</Container>
	);
};
