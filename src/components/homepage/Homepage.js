import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as navi from '../../actions/NavigationActions'
import * as user from '../../actions/UserdataActions'
import * as room from '../../actions/RoomActions'
import BirdPopup from '../pop-ups/BirdPopup.js'

// var sf = require("../../utility/socketFunctions.js");

var page = require('../../constants/pageNames')
var images = require('../../utility/image_library')
var birbs = images.birbs

const mapStateToProps = state => {
	return state
}

class Homepage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			userID: this.props.userID,
			roomID: this.props.roomID,
			currentPage: this.props.currentPage, // page.HOME_PAGE
			previousPage: this.props.previousPage
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.handleBirbPopup = this.handleBirbPopup.bind(this)
	}

	handleChange(e) {
		// console.log(this.state);
		const { value, id } = e.target

		if (id === 'username') {
			this.setState({ userID: value }, () => {
				const { getEnterUsernameAction } = this.props
				getEnterUsernameAction(this.state.userID)
				// console.log(this.state);
			})
		} else if (id === 'roomcode') {
			this.setState({ roomID: value.toUpperCase() }, () => {
				const { getEnterRoomIDAction } = this.props
				getEnterRoomIDAction(this.state.roomID)
				// console.log(this.state);
			})
		}
	}

	handleClick(e) {
		e.preventDefault()
		const { id } = e.target

		// const { getEnterUsernameAction } = this.props;
		const { getEnterRoomIDAction } = this.props

		if (id === 'host') {
			console.log('DEBUG: pressed on host room')
			try {
				if (this.state.userID.length >= 1) {
					const { getSwitchToHostRoomAction } = this.props
					getSwitchToHostRoomAction(page.HOME_PAGE)
				}
			} catch {
				console.log('DEBUG: credentials not sufficient')
				return
			}
		} else if (id === 'join') {
			const { getEnterRoomIDAction } = this.props
			getEnterRoomIDAction(this.state.roomID)
			console.log('DEBUG: pressed on join room')
			try {
				if (this.state.roomID.length === 4 && this.state.userID.length >= 1) {
					const { getSwitchToRoomPageAction } = this.props
					getSwitchToRoomPageAction(this.state.roomID, page.HOME_PAGE)
				}
			} catch {
				console.log('DEBUG: credentials not sufficient')
				return
			}
		}
	}

	handleBirbPopup(e) {
		document.getElementById('bird_picker').hidden = false
	}

	render() {
		// variables and logic here
		return (
			<main>
				<div id="homepage" className="homepage">
					<div>
						<img id="avatar" src={birbs.normalo.angery} className="user_avatar" alt="User Avatar Icon" onClick={this.handleBirbPopup} />
						<input id="username" placeholder="Enter Username" onChange={this.handleChange} maxLength={16}></input>
						<BirdPopup />
					</div>

					<div>
						<button id="host" onClick={this.handleClick}>
							Host
						</button>
						<p>or</p>
						<input id="roomcode" className="room_input" placeholder="Code" onChange={this.handleChange} maxLength={4}></input>
						<button id="join" onClick={this.handleClick}>
							Join
						</button>
					</div>

					<div>
						<p>Pick a username and profile picture to join or create a private lobby to play one of our awesome games!</p>
					</div>
				</div>
			</main>
		)
	}
}

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			getSwitchToHostRoomAction: navi.getSwitchToHostRoomAction,
			getSwitchToRoomPageAction: navi.getSwitchToRoomPageAction,
			getEnterUsernameAction: user.getEnterUsernameAction,
			getEnterRoomIDAction: room.getEnterRoomIDAction
		},
		dispatch
	)
const ConnectedHomepage = connect(mapStateToProps, mapDispatchToProps)(Homepage)
export default ConnectedHomepage

// export default Homepage;
