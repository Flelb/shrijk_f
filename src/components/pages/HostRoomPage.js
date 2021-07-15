import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as room from '../../actions/RoomActions'
import * as navi from '../../actions/NavigationActions'
import store from '../../index.js'

import pypLogo from '../../layout/img/PyPLogo.png'
import spotlightLogo from '../../layout/img/SpotlightLogo.png'

var images = require('../../utility/image_library')
var allBirds = images.birbs

// var page = require("../../constants/pageNames");
var sf = require('../../utility/socketFunctions.js')

const mapStateToProps = state => {
	return state
}

class HostRoomPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			userID: this.props.userID,
			userAvatar: this.props.userAvatar,
			roomID: this.props.roomID,
			currentPage: this.props.currentPage, // currentPage: page.ROOM_HOST,
			previousPage: this.props.previousPage,
			userList: this.props.userList
		}

		let userdata = {
			u_name: this.state.userID,
			u_avatar: this.state.userAvatar
		}

		if (!this.state.userList) {
			sf.host(userdata, res => {
				this.setState({ roomID: res.code })
				const { getEnterRoomIDAction } = this.props
				getEnterRoomIDAction(this.state.roomID)
			})
		}

		this.handleClick = this.handleClick.bind(this)
		this.generateUserListView = this.generateUserListView.bind(this)
		this.changeGameCardColor = this.changeGameCardColor.bind(this)
		this.stateUpdater = this.stateUpdater.bind(this)
		store.subscribe(this.stateUpdater)
	}

	handleClick(e) {
		e.preventDefault()
		const { id } = e.target
		const { getSwitchToRoomPageAction } = this.props
		const { getSwitchToGamePageAction } = this.props

		if (id === 'startGame') {
			if (this.state.userList) {
				if (this.state.userList.length >= 3) { 
					sf.start_game(this.state.roomID)
				} else {
					alert("ATTENTION! Bring more friends to play.")
				}
			}
		}
		let id_split = id.split('_')
		if (id_split[0] === 'vote') {
			sf.vote(this.state.roomID, id_split[1], response => {
				this.changeGameCardColor(e.target, response.newVote)
			})
		}
	}

	changeGameCardColor(elem, newVote) {
		let card = elem.parentNode
		let cardheader = card.childNodes[1].childNodes[0]
		let orange = '#E08631'
		let blue = '#4287f5'
		if (newVote) {
			//mark gameCard
			for (let el of card.parentNode.childNodes) {
				let elheader = el.childNodes[1].childNodes[0]
				el.style.borderColor = orange
				el.style.background = orange
				elheader.style.background = orange
				elheader.style.borderColor = orange
			}
			card.style.borderColor = blue
			card.style.background = blue
			cardheader.style.background = blue
			cardheader.style.borderColor = blue
		} else {
			//remove mark on gameCard
			card.style.borderColor = orange
			card.style.background = orange
			cardheader.style.background = orange
			cardheader.style.borderColor = orange
		}
	}

	stateUpdater() {
		let templocalstate = this.state
		let globalstore = store.getState()
		if (templocalstate.userList !== globalstore.userList) {
			templocalstate.userList = globalstore.userList
		}
		templocalstate.roomID = globalstore.roomID
		this.setState(templocalstate)
	}

	generateUserListView(userList) {
		let userArray = []
		userList = userList ? this.state.userList : [{ name: this.state.userID, avatar: { bird_color: this.state.userAvatar.bird_color, bird_mood: this.state.userAvatar.bird_mood } }]
		for (let user of userList) {
			try {
				// let's keep the two identical pages consistent between each other...
				let altdescription = 'User Icon of color ' + user.avatar.bird_color + ' with the mood ' + user.avatar.bird_mood + ''
				let likey = 'User_inLobby_' + user.name
				let voted_class = (user.newVote) ? "user_inLobby_voted" : "user_inLobby"
				
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
		return userArray
	}

	render() {
		//Muss sich die votes aus dem Backend holen

		return (
			<main>
				<div className="private_room_host">
					<div className="guide">
						<h2>Quick Guide:</h2>
						<ul>
							<li><p>Wait for all players to join</p></li>
							<li><p>Vote for a game you'd like to play</p></li>
							<li><p>Click "Start Game" when everybody has voted</p></li>
						</ul>
					</div>

					<div className="lobby">
						<div className="lobbyTop">
							<p className="roomcode">{this.state.roomID}</p>
							<p className="waitingOnPlayers">Vote for your game of choice!</p>
							<button id="startGame" onClick={this.handleClick}>
								Start Game
							</button>
						</div>

						<ul id="user_list" className="allUsers_inLobby">
							{this.generateUserListView(this.state.userList)}
						</ul>
						<ul className="gameList">
							<li className="gameCard">
								<div className="gameCardOverlay" onClick={this.handleClick} id="vote_pyp"></div>
								<div>
									<div className="gameCardHeader">
										<img src={pypLogo} id="gameIcon" alt="pypIcon" />
										<h4 id="gameTitle">Pick your Poison</h4>
									</div>
									<p id="gameDesc">Guess which Poison your friend would pick! Whoever guesses right, scores points.</p>
									{/* <p>{this.pyp_votes}</p> */}
								</div>
							</li>

							<li className="gameCard">
								<div className="gameCardOverlay" onClick={this.handleClick} id="vote_sl"></div>
								<div>
									<div className="gameCardHeader">
										<img src={spotlightLogo} id="gameIcon" alt="OtherIcon" />
										<h4 id="gameTitle">Spotlight</h4>
									</div>
									<p id="gameDesc">Pick who fits the statement the most. If two people pick each other, you both lose points. Otherwise, you win points!</p>
									{/* <p>{this.pyp_votes}</p> */}
								</div>
							</li>
						</ul>
					</div>
				</div>
			</main>
		)
	}
}

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			getSwitchToRoomPageAction: navi.getSwitchToRoomPageAction,
			getSwitchToGamePageAction: navi.getSwitchToGamePageAction,
			getEnterRoomIDAction: room.getEnterRoomIDAction
		},
		dispatch
	)
const ConnectedHostRoomPage = connect(mapStateToProps, mapDispatchToProps)(HostRoomPage)
export default ConnectedHostRoomPage
