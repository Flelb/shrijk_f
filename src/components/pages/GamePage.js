import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as room from '../../actions/RoomActions'
import * as navi from '../../actions/NavigationActions'

import PickYourPoisonPage from '../games/PickYourPoisonPage.js'
import SpotlightPage from '../games/SpotlightPage.js'

var images = require('../../utility/image_library')
var allBirds = images.birbs

var sf = require('../../utility/socketFunctions.js')

const mapStateToProps = state => {
	return state
}

class GamePage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			userID: this.props.userID,
			userAvatar: this.props.userAvatar,
			roomID: this.props.roomID,
			currentPage: this.props.currentPage, // currentPage: page.GAME_PAGE,
			previousPage: this.props.previousPage,
			game: this.props.game
		}

		let userdata = {
			u_name: this.state.userID,
			u_avatar: this.state.userAvatar
		}

		this.updateUserListView = this.updateUserListView.bind(this)
	}

	updateUserListView(userList) {
		let userArray = []
		for (let user of userList) {
			let altdescription = 'User Icon of color ' + user.avatar.bird_color + ' with the mood ' + user.avatar.bird_mood + ''
			let likey = 'User_inLobby_' + user.name

			userArray.push(
				<li key={likey} className="user_inLobby">
					<img src={allBirds[user.avatar.bird_color][user.avatar.bird_mood]} alt={altdescription} />
					<p id="userName">{user.name}</p>
				</li>
			)
		}

		// console.log("listing users");
		return <ul className="allUsers_inLobby">{userArray}</ul>
	}
	
	render() {
		let content = <></>
		let ul = <></>
		let gameTitle = ''
		console.log(this.state.game)
		switch(this.state.game) {
		    case "pyp":
		        content = <PickYourPoisonPage />
		        gameTitle = "Pick Your Poison"
				ul = <ul>
						<li><p>Read the two choices</p></li>
						<li><p>If the text reads "Would you", just pick the choice you like more</p></li>
						<li><p>Otherwise, guess which option the selected user would pick</p></li>
						<li><p>Click the button containing your choice</p></li>
						<li><p>Wait for the results</p></li>
						<li><p>If the round was about you, click "Next Question"</p></li>
					</ul>
				break;
		    case "sl":
		        content = <SpotlightPage/>
		        gameTitle = "Spotlight"
				ul = <ul>
						<li><p>Think about which player is the most likely to find themselves in the mentioned scenario</p></li>
						<li><p>Click on that player</p></li>
						<li><p>Hope that they didn't also pick you</p></li>
						<li><p>Wait for the results</p></li>
						<li><p>If you're the host, click on "Next Question"</p></li>
					</ul>
				break;
		}

		// content = <PickYourPoisonPage />
		// gameTitle = 'Pick your Poison!'

		return (
			<main>
				<div className="game_page">
					<div className="guide">
						<h2>Quick Guide:</h2>
						{ul}
					</div>
					<div className="game_page_content">
						<div id="gameTopConstant" className="game_top_constant">
							<h4 className="game_title">{gameTitle}</h4>
						</div>
						<div id="gameContent" className="game_content">
							{content}
						</div>
					</div>
				</div>
			</main>
		)
	}
}

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			getSwitchToRoomPageAction: navi.getSwitchToRoomPageAction
		},
		dispatch
	)
const ConnectedGamePage = connect(mapStateToProps, mapDispatchToProps)(GamePage)
export default ConnectedGamePage

// export default HostRoomPage;
