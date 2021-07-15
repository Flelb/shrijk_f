import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as room from '../../actions/RoomActions'
import * as navi from '../../actions/NavigationActions'
import store from '../../index.js'

var images = require('../../utility/image_library')
var allBirds = images.birbs

var sf = require('../../utility/socketFunctions.js')

const mapStateToProps = state => {
	return state
}

class SpotlightPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			sid: this.props.sid,
			userID: this.props.userID,
			userAvatar: this.props.userAvatar,
			roomID: this.props.roomID,
			currentPage: this.props.currentPage, // currentPage: page.ROOM_HOST,
			previousPage: this.props.previousPage,
			sl_round_done: this.props.sl_round_done,
			userList: this.props.userList
		}

		let userdata = {
			u_name: this.state.userID,
			u_avatar: this.state.userAvatar
		}

		this.handleClick = this.handleClick.bind(this)
		this.stateUpdater = this.stateUpdater.bind(this)
		this.findMeInList = this.findMeInList.bind(this)
		this.generateGameData = this.generateGameData.bind(this)
		this.componentDidMount = this.componentDidMount.bind(this)
		this.generateGameResults = this.generateGameResults.bind(this)
		this.generateUserListView = this.generateUserListView.bind(this)
		this.theirify = this.theirify.bind(this)
		store.subscribe(this.stateUpdater)
	}

	stateUpdater() {
		let templocalstate = this.state
		let globalstore = store.getState()

		if (templocalstate.currentGameObject !== globalstore.currentGameObject) {
			try {
				let currentquestion = templocalstate.currentGameObject.data.question["choice_01"]
				let newquestion = globalstore.currentGameObject.data.question["choice_01"]
				if (currentquestion && newquestion) {
					if (currentquestion != newquestion) {
						this.changeButtonColor(document.getElementById('slChoice_A'), false)
						this.changeButtonColor(document.getElementById('slChoice_B'), false)
					}
				}
			} catch {
				console.log("Tried resetting the button colors, but it wasn't possible")
			}
			templocalstate.currentGameObject = globalstore.currentGameObject
		}
		if (templocalstate.userList !== globalstore.userList) {
			templocalstate.userList = globalstore.userList
		}
		this.setState(templocalstate)
	}

	theirify(input) {
		return input.replace("your", "their").replace("you", "they")
	}

	generateGameData() {
		let cgo = this.state.currentGameObject
		if (!cgo || (cgo.type != "sl_question" && cgo.type != "sl_round_over")) return
		return cgo.data["question"]
	}

	// we need this, because the backend-provided user objects have more info
	// than the user object in the frontend store. But we need to find the
	// backend-provided user corresponding to the one we are.
	findMeInList(list) {
		if(list) {
			for(let element of list) {
				if(this.state && element) if (element.sid == this.state.sid) return element
			}
		}
		return null
	}

	generateGameResults() {
		let cgo = this.state.currentGameObject
		if (!cgo || cgo.type != "sl_round_over") return
		
		// initializing stuff
		let all_matched = cgo.data["log_map_matched"]
		let all_unmatched = cgo.data["log_map_unmatched"]
		let were_matched = false;
		let you = { "name": "default", "avatar": { "bird_color": "bi", "bird_mood": "sleepy"}}
			
		// trying to find ourselves, in order to see if we have won
		you = this.findMeInList(all_matched)
		were_matched = (you) ? true : false
		you = (you) ? you : this.findMeInList(all_unmatched)
		// we need to know who we are, even if we lose sometimes

		// preparing some data for the display
		let main_phrase = (were_matched) ? "picked someone who also picked you" : "picked someone who didn't pick you"
		let point_phrase = (were_matched) ? "makes both of you lose" : "earns you"
		let points = (were_matched) ? "1 Point" : "2 Points"

		let arehost = you.sid == cgo.data["host"]
		let overmessage = (cgo.data["sl_over"]) ? "View Leaderboard" : "Next Question"

		return (
			<div className="sl_round_over_pop" id="results_popup">
				<p>You {main_phrase}</p>
				<p>This {point_phrase} {points}!</p>
				<p>Your new total is: {you.points}</p>
				{(arehost) ? <button id="sl_resume" onClick={this.handleClick}>{overmessage}</button> : null}
			</div>
		)
	}

	generateUserListView(userList) {
		let userArray = []
		userList = userList ? userList : []
		for (let user of userList) {
			try {
                if(this.state.sid == user.sid) continue
				// let's keep the two identical pages consistent between each other...
				let altdescription = 'User Icon of color ' + user.avatar.bird_color + ' with the mood ' + user.avatar.bird_mood + ''
				let likey = 'User_inLobby_' + user.name
				let voted_class = (user.newVote) ? "user_inLobby_voted" : "user_inLobby"
				// let voted_class = (user.newVote) ? "user_inLobby_voted" : "user_inLobby"
				// let voted_class = "user_inLobby"
				
				userArray.push(
					<li id={user.sid} data-user={user.sid} key={likey} className={voted_class} onClick={this.handleClick}>
						<img data-user={user.sid} src={allBirds[user.avatar.bird_color][user.avatar.bird_mood]} alt={altdescription} />
						<p data-user={user.sid}>{user.name}</p>
					</li>
				)
				
				
			} catch {
				console.log('An Error occured while trying to display the UserList')
			}
		}
		return userArray
	}

	handleClick(e) {
		e.preventDefault()
		const { id } = e.target

		if(id === "sl_resume") {
			if (this.state.currentGameObject.data["sl_over"]) {
				sf.end_game(this.state.roomID)
				return
			} else {
				sf.resume_game(this.state.roomID)
				return
			}

		}
		
		if (this.state.currentGameObject.type == "sl_round_over") return
        sf.sl_vote(this.state.roomID, e.target.getAttribute("data-user"), response => {
			
			// Maybe this doesn't have to be in the callback, due to possible lag.
			// But keeping it here ensures that the spotlight only sticks when the
			// vote went through...
			const spotlight = document.querySelector('.spotlight');
			const gamePage = document.querySelector('.game_page');
			if (!spotlight || !gamePage) return

			let clickedopacity = 0.45
			let spotlightSize = `transparent 130px, rgba(0, 0, 0, ${clickedopacity}) 150px)`;
			spotlight.style.backgroundImage = `radial-gradient(circle at ${(e.pageX / window.outerWidth * 100) - 20}% ${((e.pageY - 7 * 16) / gamePage.offsetHeight * 100)}%, ${spotlightSize}`;
			spotlight.style.height = `${gamePage.offsetHeight}px`;

			// this.changeButtonColor(e.target, response.newVote)
        })
	}

	changeButtonColor(elem, newVote) {
		let orange = '#E08631'
		let blue = '#4287f5'
		if (newVote) {
			//mark gameCard
			for (let el of elem.parentNode.childNodes) {
				el.style.background = orange
			}

			elem.style.background = blue
		} else {
			//remove mark on gameCard
			elem.style.background = orange
		}
	}

	// Source: https://codepen.io/GeorgePark/pen/ELemzZ
	componentDidMount() {
		const spotlight = document.querySelector('.spotlight');
		const gamePage = document.querySelector('.game_page');
		if(!spotlight || !gamePage) return

		let clickedopacity = 0.45
		let regularopacity = 0.40
		let spotlightSize = `transparent 160px, rgba(0, 0, 0, ${regularopacity}) 200px)`;


		window.addEventListener('mousemove', e => {
			let me = this.findMeInList(this.state.userList)
			if(me) {
				if (!me.newVote) updateSpotlight(e)
			}
		});

		window.addEventListener('mousedown', e => {
			let me = this.findMeInList(this.state.userList)
			if(me) {
				if(!me.newVote) {
					spotlightSize = `transparent 130px, rgba(0, 0, 0, ${clickedopacity}) 150px)`;
					updateSpotlight(e);
				}
			}
		});

		window.addEventListener('mouseup', e => {
			let me = this.findMeInList(this.state.userList)
			if(me) {
				if(!me.newVote) {
					spotlightSize = `transparent 160px, rgba(0, 0, 0, ${regularopacity}) 200px)`;
					updateSpotlight(e);
				}
			}
		});

		function updateSpotlight(e) {
			spotlight.style.backgroundImage = `radial-gradient(circle at ${(e.pageX / window.outerWidth * 100) - 20}% ${((e.pageY - 7*16) / gamePage.offsetHeight * 100)}%, ${spotlightSize}`;
			spotlight.style.height = `${gamePage.offsetHeight}px`;
		}
	}

	// componentWillUnmount() {
	// 	window.removeEventListener('mousemove', null)
	// 	window.removeEventListener('mouseup', null)
	// 	window.removeEventListener('mousedown', null)
	// }

	render() {
		//Standard layout, Statements als einzelne Komponenten.

		//Statements bei Spielstart in ein Array packen (bspw. 20 Statement Paare)
		//Array wird dann ans Frontend geschickt und nacheinander einfach abgearbeitet

		return (
			<>
			<div id="Spotlight" className="sl_page">
				
				<div className="spotlight"></div>
				{this.generateGameResults()}
				<h5>Who...</h5>
				<div className="statement">
					<p id="slChoice" className="sl_choice">
						{this.generateGameData("choice")}
					</p>
				</div>
				{ <ul id="user_list" className="allUsers_inLobby">
					{this.generateUserListView(this.state.userList)}
				</ul> }
				
			</div>
			</>
		)
	}
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)
const ConnectedSpotlightPage = connect(mapStateToProps, mapDispatchToProps)(SpotlightPage)
export default ConnectedSpotlightPage

// export default HostRoomPage;
