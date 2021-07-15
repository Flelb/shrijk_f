var page = require("../constants/pageNames");

const initialState = {
	userID: null,
	userAvatar: { bird_color: "normalo", bird_mood: "angery" },
	roomID: null,
	userList: null,
	currentPage: page.HOME_PAGE,
	previousPage: null,
	sid: null,
	game: null,
	error: null,
};

export default initialState;