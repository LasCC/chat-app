const users = [];

const addUser = ({ id, name, party }) => {
	// trim the data
	name = name.trim().toLowerCase();
	party = party.trim().toLowerCase();

	const alreadyExist = users.find(
		user => user.party === party && user.name === name
	);

	if (alreadyExist) {
		return { error: "Username is already taken" };
	}

	const user = { id, name, party };

	users.push(user);

	return { user };
};

const removeUser = id => {
	const idUser = users.findIndex(user => user.id === id);

	if (idUser !== -1) {
		return users.splice(idUser, 1)[0];
	}
};

const getUser = id => users.find(user => user.id === id);

const getUserInParty = party => users.filter(user => user.party === party);

module.exports = { addUser, removeUser, getUser, getUserInParty };
