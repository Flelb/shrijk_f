import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as room from '../../actions/RoomActions'
import * as navi from '../../actions/NavigationActions'
import store from '../../index.js'

var images = require('../../utility/image_library')
var allBirds = images.birbs

// var page = require("../../constants/pageNames");
var sf = require('../../utility/socketFunctions.js')

const mapStateToProps = state => {
	return state
}

class PickYourPoisonPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			sid: this.props.sid,
			userID: this.props.userID,
			userAvatar: this.props.userAvatar,
			roomID: this.props.roomID,
			currentPage: this.props.currentPage, // currentPage: page.ROOM_HOST,
			previousPage: this.props.previousPage,
			pyp_round_done: this.props.pyp_round_done,
			userList: this.props.userList
		}

		let userdata = {
			u_name: this.state.userID,
			u_avatar: this.state.userAvatar
		}

		// sf.pyp_fetch(this.state.roomID, 'pyp');

		this.handleClick = this.handleClick.bind(this)
		this.stateUpdater = this.stateUpdater.bind(this)
		this.findMeInList = this.findMeInList.bind(this)
		this.generateGameData = this.generateGameData.bind(this)
		this.generateGameResults = this.generateGameResults.bind(this)
		this.generateUserListView = this.generateUserListView.bind(this)
		this.theirify = this.theirify.bind(this)
		store.subscribe(this.stateUpdater)
		this.generateCursorImg = this.generateCursorImg.bind(this)
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
						this.changeButtonColor(document.getElementById('pypChoice_A'), false)
						this.changeButtonColor(document.getElementById('pypChoice_B'), false)
					}
				}
			} catch {
				console.log("Tried resetting the button colors, but it wasn't possible")
			}
			templocalstate.currentGameObject = globalstore.currentGameObject
		}
		if (templocalstate.userList !== globalstore.userList) {
			console.log(":: stateUpdater: UserList (stinky)");
			console.log(globalstore.userList);
			templocalstate.userList = globalstore.userList
		}
		this.setState(templocalstate)
	}

	theirify(input) {
		return input.replace("your", "their").replace("you", "they")
	}

	generateCursorImg() {
		let cgo = this.state.currentGameObject
		if (!cgo || (cgo.type != "pyp_question")) return
		
		let user = cgo.data["user"];
		let altdescription = 'User Icon of color ' + user.avatar.bird_color + ' with the mood ' + user.avatar.bird_mood + ''
		let itsyou = user.sid == this.state.sid
		if(itsyou) return

		return <img hidden className="bird_cursor" src={allBirds[user.avatar.bird_color][user.avatar.bird_mood]} alt={altdescription} />
	}

	generateGameData(choice) {
		let cgo = this.state.currentGameObject
		if (!cgo || (cgo.type != "pyp_question" && cgo.type != "pyp_round_over")) return choice
		
		let user = cgo.data["user"];
		let altdescription = 'User Icon of color ' + user.avatar.bird_color + ' with the mood ' + user.avatar.bird_mood + ''
		let itsyou = user.sid == this.state.sid
		
		if(choice == "headline") {
			if (itsyou) {
				return <h5>Would you</h5>
			} else {
				return (
					<div className="headline_question">
						<h5>Would</h5>
						<div className="user_inLobby">
							<img src={allBirds[user.avatar.bird_color][user.avatar.bird_mood]} alt={altdescription} />
							<p id="userName">{user.name}</p>
						</div>
					</div>
				)
			}
		}

		if(itsyou) {
			return cgo.data["question"][choice]
		} else {
			// bruh, i not only gotta make it a temp variable, but also a new string, using the ""
			let tempstring = "" + cgo.data["question"][choice]
			return this.theirify(tempstring)
		}
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
		if (!cgo || cgo.type != "pyp_round_over") return
		
		// initializing stuff
		let itsyou = cgo.data["user"].name == this.state.userID
		let winners = cgo.data["log_map_winners"]
		let losers = cgo.data["log_map_losers"]
		let were_right = false;
		let you = { "name": "default", "avatar": { "bird_color": "bi", "bird_mood": "sleepy"}}

		// stupid way of asking if you are a regular, non-chosen-one player
		if(!itsyou) {
			
			// trying to find ourselves, in order to see if we have won
			you = this.findMeInList(winners)
			were_right = you != null
			you = (you) ? you : this.findMeInList(losers)
			// we need to know who we are, even if we lose sometimes

			// preparing some data for the display
			let correctness = (were_right) ? "correctly!" : "incorrectly!"
			let phrase = (were_right) ? "earns you" : "makes you lose"
			let points = (were_right) ? "5" : "2"

			// display
			return (
				//BIRD PICKER NEEDS TO BE CHANGED
				<div className="pyp_round_over_pop" id="results_popup">
					<p>You guessed {correctness}</p>
					<p>This {phrase} {points} Points!</p>
					<p>Your new total is: {you.points}</p>
				</div>
			)
		} else {
			let points = (winners.length == 0) ? "0" : "+3"
			let overmessage = (cgo.data["pyp_over"]) ? "View Leaderboard" : "Next Question"
			let people_amount = (winners.length == 0) ? "Nobody" : "These people"
			return (
				<div className="pyp_round_over_pop" id="results_popup">
					<p>{people_amount} guessed correctly:</p>
					<ul id="user_list" className="allUsers_inLobby">
						{this.generateUserListView(winners)}
					</ul>
					<p>You get {points} Points!</p>
					<p>Your new total is: {cgo.data["user"].points}</p>
					<button id="pyp_resume" onClick={this.handleClick}>{overmessage}</button>
				</div>
			)
		}

	}

	generateUserListView(userList) {
		let userArray = []
		userList = userList ? userList : []
		for (let user of userList) {
			try {
				// let's keep the two identical pages consistent between each other...
				let altdescription = 'User Icon of color ' + user.avatar.bird_color + ' with the mood ' + user.avatar.bird_mood + ''
				let likey = 'User_inLobby_' + user.name
				let voted_class = (user.newVote) ? "user_inLobby_voted" : "user_inLobby"
				// let voted_class = "user_inLobby"
				// console.log("USER IN LIST HAS THIS VOTE: ")
				// console.log(user.newVote)
				
				userArray.push(
					<li key={likey} className={voted_class}>
						<img src={allBirds[user.avatar.bird_color][user.avatar.bird_mood]} alt={altdescription} />
						<p id="userName">{user.name}</p>
					</li>
				)
				
				
			} catch {
				console.log('An Error occured while trying to display the UserList')
			}
		}

		// console.log('listing users')
		return userArray
	}

	handleClick(e) {
		e.preventDefault()
		const { id } = e.target

		if(id === "pyp_resume") {
			// console.log("FRONNENN PYP RESUME JAJAJAJAJAJAJJAJ")

			if (this.state.currentGameObject.data["pyp_over"]) {
				sf.end_game(this.state.roomID)
				return
			} else {
				sf.resume_game(this.state.roomID)
				return
			}

		}
		
		if (this.state.currentGameObject.type == "pyp_round_over") return

		if (id === 'pypChoice_A') {
			console.log('vote A')
			sf.pyp_vote(this.state.roomID, 'A', response => {
				this.changeButtonColor(e.target, response.newVote)
			})
			// sf.pyp_fetch(this.state.roomID, 'pyp'); // only for debugging
		}

		if (id === 'pypChoice_B') {
			console.log('vote B')
			sf.pyp_vote(this.state.roomID, 'B', response => {
				this.changeButtonColor(e.target, response.newVote)
			})
			// sf.pyp_fetch(this.state.roomID, 'pyp'); // only for debugging
		}
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
			console.log('new vote')
		} else {
			//remove mark on gameCard
			elem.style.background = orange
			console.log('old vote')
		}
	}

	componentDidMount() {
		const cursor_bird = document.querySelector('.bird_cursor');
		const gamePage = document.querySelector('.game_page');
		if (cursor_bird) {
			window.addEventListener('mousemove', e => {
				if(this.findMeInList(this.state.userList)) {
					if(this.findMeInList(this.state.userList).newVote) return
					cursor_bird.style.left = "" + (e.clientX - 32) + "px"
					cursor_bird.style.top = "" + (e.clientY - 32) + "px"
					cursor_bird.hidden = false
				}
			});

			window.addEventListener('mouseup', e => {
				if(this.findMeInList(this.state.userList)) {
					cursor_bird.style.left = "" + (e.clientX - 32) + "px"
					cursor_bird.style.top = "" + (e.clientY - 32) + "px"
					cursor_bird.hidden = true
				}
			});
		}
	}
	
	render() {
		
		//Standard layout, Statements als einzelne Komponenten.

		//Statements bei Spielstart in ein Array packen (bspw. 20 Statement Paare)
		//Array wird dann ans Frontend geschickt und nacheinander einfach abgearbeitet

		return (
			<div id="PickYourPoison" className="pyp_page">
				{this.generateCursorImg()}
				
				{ <ul id="user_list" className="allUsers_inLobby">
					{this.generateUserListView(this.state.userList)}
				</ul> }
				
				{this.generateGameResults()}
				{this.generateGameData("headline")}
				
				<div className="choices">
					<button id="pypChoice_A" className="pyp_choice" onClick={this.handleClick} style={{ background: '#E08631' }}>
						{this.generateGameData("choice_01")}
					</button>

					<button id="pypChoice_B" className="pyp_choice" onClick={this.handleClick} style={{ background: '#E08631' }}>
						{this.generateGameData("choice_02")}
					</button>
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)
const ConnectedPickYourPoisonPage = connect(mapStateToProps, mapDispatchToProps)(PickYourPoisonPage)
export default ConnectedPickYourPoisonPage

// export default HostRoomPage;
