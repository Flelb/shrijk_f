import { io } from 'socket.io-client'
// import { updateUserListView } from "../components/pages/HostRoomPage.js";
import store from '../index.js'
import { getUpdateUserListAction } from '../actions/RoomActions.js'
import { getEnterRoomIDAction } from '../actions/RoomActions.js'
import { getEnterSidAction } from '../actions/UserdataActions.js'
import { getSwitchToGamePageAction } from '../actions/NavigationActions.js'
import { getSwitchToHostRoomAction } from '../actions/NavigationActions.js'
import { getSwitchToRoomPageAction } from '../actions/NavigationActions.js'
import { getSwitchToGameEndPageAction } from '../actions/NavigationActions.js'
import { getUpdateGameObjectAction } from '../actions/GameActions.js'
import { getUpdateGameAction } from '../actions/GameActions.js'

var page = require('../constants/pageNames')
const clientsocket = io('https://shrijk-backend.herokuapp.com/')

clientsocket.on('connect', () => {
	console.log(' > FE LISTENER: CONNECTED on id: ' + clientsocket.id)
})

clientsocket.on('user_list', list => {
	// pushing the new info into the store
	console.log(' > FE LISTENER: USER LIST UPDATE')
	store.dispatch(getUpdateUserListAction(list))
})

clientsocket.on('gameObject_update', gameObject => {
	// pushing the new info into the store
	console.log(' > FE LISTENER: GAME OBJECT UPDATE')
	console.log(gameObject)
	store.dispatch(getUpdateGameObjectAction(gameObject))
})

clientsocket.on('promotion', current_room => {
	console.log(' > FE LISTENER: PROMOTION')
	if (store.getState().currentPage === page.ROOM_PAGE) {
		// we're kinda abusing this function, ngl
		store.dispatch(getSwitchToHostRoomAction())
		store.dispatch(getEnterRoomIDAction(current_room))
	}
})

clientsocket.on('started_game', (room, game) => {
	console.log(' > FE LISTENER: STARTED GAME SENT TO ALL')
	store.dispatch(getUpdateGameAction(game))
	store.dispatch(getSwitchToGamePageAction(room, store.getState().currentPage))
	if(game == 'pyp'){
		clientsocket.emit('pyp_fetch', room)
	}
	if(game == 'sl'){
		console.log(' > FE LISTENER: SPOTLIGHT')
		clientsocket.emit('sl_fetch', room)
	}
})

clientsocket.on("ended_game", (roomcode, userlist) => {
	store.dispatch(getUpdateUserListAction(userlist))
	store.dispatch(getUpdateGameAction(''))
	store.dispatch(getSwitchToGameEndPageAction(roomcode, store.getState().currentPage))
})

clientsocket.on("returning_as_host", roomcode => {
	store.dispatch(getSwitchToHostRoomAction())
	store.dispatch(getEnterRoomIDAction(roomcode))
})

clientsocket.on("returning_as_player", roomcode => {
	store.dispatch(getSwitchToRoomPageAction(roomcode, store.getState().currentPage))
})

clientsocket.on("get_sid", sid => { // aber nicht der von ice age nmn
	store.dispatch(getEnterSidAction(sid))
})

export function host(data, callback) {
	console.log(data)
	clientsocket.emit('host_room', data, response => {
		callback(response)
	})
}

export function join(data, roomcode, callback) {
	console.log(data)
	roomcode = ('' + roomcode).toUpperCase()
	// store.dispatch(getEnterRoomIDAction(roomcode.toUpperCase()))
	clientsocket.emit('join_room', { user: data, code: roomcode }, response => {
		callback(response)
	})
}

export function leave() {
	clientsocket.emit('leave_room')
}

export function status() {
	clientsocket.emit('status')
}

export function vote(roomcode, game, callback) {
	clientsocket.emit('vote', roomcode, game, response => {
		callback(response)
	})
}

export function start_game(roomcode) {
	clientsocket.emit('start_game', roomcode)
}

export function resume_game(roomcode) {
	console.log("RESUME SEND TO BACKEND")
	clientsocket.emit('resume_game', roomcode)
}

export function end_game(roomcode) {
	clientsocket.emit('end_game', roomcode)
}

export function return_to_lobby(roomcode) {
	clientsocket.emit("return_to_lobby", roomcode)
}

// Pick your Poison (wähle dein Geschenk):
export function pyp_vote(roomcode, choice, callback) {
	clientsocket.emit('pyp_vote', roomcode, choice, response => {
		callback(response)
	})
}

export function pyp_fetch(roomcode, game) {
	clientsocket.emit('pyp_fetch', roomcode, game)
}

//PunktLicht
export function sl_vote(roomcode, choice, callback) {
	clientsocket.emit('sl_vote', roomcode, choice, response => {
		callback(response)
	})
}

export function sl_fetch(roomcode, game) {
	clientsocket.emit('sl_fetch', roomcode, game)
}

// export function getUsers(roomcode, callback) {
//     // Richtiger Code:
//     // clientsocket.emit('getUsers', roomcode, response => {
//     //     callback(response)
//     // })

//     // Erstmal nur um im Backend den console.log() zu triggern,
//     // Um sich das Format der Daten dort anschauen zu können
//     clientsocket.emit('getUsers', roomcode, response => {})
// }
