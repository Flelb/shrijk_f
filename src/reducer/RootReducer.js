import * as UserdataActions from "../actions/UserdataActions"
import * as NavigationActions from "../actions/NavigationActions"
import * as RoomActions from "../actions/RoomActions"
import * as GameActions from "../actions/GameActions"
import initialState from "./initialState";

function rootReducer(state = initialState, action) {

	switch (action.type) {

		case UserdataActions.ENTER_BIRD_CREDENTIALS:
			return {
				...state,
				userAvatar: action.payload.userAvatar,
				error: null,
			}

		case UserdataActions.ENTER_USER_NAME:
			return {
				...state,
				userID: action.payload.userID,
				error: null,
			}

		case UserdataActions.ENTER_SID:
			return {
				...state,
				sid: action.payload.sid,
				error: null,
			}

		case NavigationActions.SWITCH_TO_PAGE:
			// console.log(this.state.game)
			return {
				...state,
				// userID: action.payload.userID,
				// userAvatar: action.payload.userAvatar,
				roomID: action.payload.roomID,
				currentPage: action.payload.currentPage,
				previousPage: action.payload.previousPage,
				error: null,
			}
		
		case RoomActions.ENTER_ROOM_ID:
			return {
				...state,
				roomID: action.payload.roomID,
				error: null,
			}

		case RoomActions.UPDATE_USER_LIST:
			return {
				...state,
				userList: action.payload.userList,
				error: null,
			}

		case GameActions.UPDATE_GAME_OBJECT:
			return {
				...state,
				currentGameObject: action.payload.currentGameObject,
				error: null,
			}

		case GameActions.UPDATE_GAME:
			return {
				...state,
				game: action.payload.game,
				error: null,
			}

		default:
			return state;
	}

};

export default rootReducer;