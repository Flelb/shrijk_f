export const ENTER_ROOM_ID = 'ENTER_ROOM_ID' // OMG THIS BROKE SO MUCH SHIT
export const UPDATE_USER_LIST = 'UPDATE_USER_LIST'

export function getEnterRoomIDAction(room_id) {
	return dispatch =>
		dispatch({
			type: ENTER_ROOM_ID,
			payload: { roomID: room_id }
		})
}

export function getUpdateUserListAction(user_list) {
	return dispatch =>
		dispatch({
			type: UPDATE_USER_LIST,
			payload: { userList: user_list }
		})
}

/*export function getGameVoteAction(room_id) {
	return dispatch => dispatch({
		type: ENTER_ROOM_ID,
		payload: { roomID: room_id }
	});
}*/
