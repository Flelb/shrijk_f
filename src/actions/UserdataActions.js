export const ENTER_BIRD_CREDENTIALS = 'ENTER_BIRD_CREDENTIALS'
export const ENTER_USER_NAME = 'ENTER_USER_NAME'
export const ENTER_SID = 'ENTER_SID'

export function getEnterBirdCredentialsAction(user_avatar) {
	console.log(user_avatar)
	return dispatch =>
		dispatch({
			type: ENTER_BIRD_CREDENTIALS,
			payload: { userAvatar: user_avatar }
		})
}

export function getEnterUsernameAction(user_id) {
	return dispatch =>
		dispatch({
			type: ENTER_USER_NAME,
			payload: { userID: user_id }
		})
}

export function getEnterSidAction(sid) {
	return dispatch =>
		dispatch({
			type: ENTER_SID,
			payload: { sid: sid }
		})
}
