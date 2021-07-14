export const SWITCH_TO_PAGE = 'SWITCH_TO_PAGE'
var page = require('../constants/pageNames')

export function getSwitchToHomePageAction() {
	return dispatch =>
		dispatch({
			type: SWITCH_TO_PAGE,
			payload: { currentPage: page.HOME_PAGE }
		})
}

export function getSwitchToRoomPageAction(room_id, previousPage_id) {
	return dispatch =>
		dispatch({
			type: SWITCH_TO_PAGE,
			payload: { currentPage: page.ROOM_PAGE, roomID: room_id, previousPage: previousPage_id }
		})
}

export function getSwitchToGamePageAction(room_id, previousPage_id) {
	return dispatch =>
		dispatch({
			type: SWITCH_TO_PAGE,
			payload: { currentPage: page.GAME_PAGE, roomID: room_id, previousPage: previousPage_id }
		})
}

export function getSwitchToRoomSettingsAction(room_id, previousPage_id) {
	return dispatch =>
		dispatch({
			type: SWITCH_TO_PAGE,
			payload: { currentPage: page.ROOM_SETTINGS, roomID: room_id, previousPage: previousPage_id }
		})
}

export function getSwitchToHostRoomAction(previousPage_id) {
	return dispatch =>
		dispatch({
			type: SWITCH_TO_PAGE,
			payload: { currentPage: page.ROOM_HOST, previousPage: previousPage_id }
		})
}

export function getSwitchToGameEndPageAction(room_id, previousPage_id) {
	return dispatch =>
		dispatch({
			type: SWITCH_TO_PAGE,
			payload: { currentPage: page.GAME_END_PAGE, roomID: room_id, previousPage: previousPage_id }
		})
}
