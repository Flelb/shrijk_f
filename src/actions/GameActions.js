export const UPDATE_GAME_OBJECT = 'UPDATE_GAME_OBJECT'
export const UPDATE_GAME = 'UPDATE_GAME'

export function getUpdateGameObjectAction(game_object) {
	return dispatch =>
		dispatch({
			type: UPDATE_GAME_OBJECT,
			payload: { currentGameObject: game_object }
		})
}

export function getUpdateGameAction(game) {
	console.log(">>>GETUPDATEGAMEACTION<<< " + game)
	return dispatch =>
		dispatch({
			type: UPDATE_GAME,
			payload: { game: game }
		})
}