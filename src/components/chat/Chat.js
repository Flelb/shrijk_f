import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as room from '../../actions/RoomActions'
import * as navi from '../../actions/NavigationActions'
import store from '../../index.js'

var images = require('../../utility/image_library')
// var page = require("../../constants/pageNames");
var sf = require('../../utility/socketFunctions.js')

const mapStateToProps = state => {
	return state
}

class Chat extends Component {
	constructor(props) {
		super(props)

		this.state = {
			userID: this.props.userID,
			userAvatar: this.props.userAvatar,
			roomID: this.props.roomID,
			currentPage: this.props.currentPage, // currentPage: page.ROOM_HOST,
			previousPage: this.props.previousPage
		}

		let userdata = {
			u_name: this.state.userID,
			u_avatar: this.state.userAvatar
		}

		this.handleClick = this.handleClick.bind(this)
		this.stateUpdater = this.stateUpdater.bind(this)
		this.generateGameData = this.generateGameData.bind(this)
		store.subscribe(this.stateUpdater)
	}

	stateUpdater() {
		let templocalstate = this.state
		let globalstore = store.getState()
		if (templocalstate.currentGameObject !== globalstore.currentGameObject) {
			templocalstate.currentGameObject = globalstore.currentGameObject
		}
	}

	generateGameData(choice) {
		if(this.state.currentGameObject) {
			if (this.state.currentGameObject.type == "pyp_question") {
				return this.state.currentGameObject.data[choice]
			}
		}

		return choice
	}

	handleClick(e) {
		e.preventDefault()
		const { id } = e.target
	}

	render() {
		return (

            <div className="chat">
						<input placeholder="Enter Message..." />
						<button>
							<img src="img/logo.png" id="imgChatButton" alt="Chatbutton" />
						</button>
					</div>
        <div className="chat">
            <form id="add-message-form">
                <div class="form-group">
                    <input type="text" class="form-control" id="message-text" placeholder="type in a message and press enter to send it...">
                </div>
            </form>
 
            <ul class="list-group" id="message-log">
                <li class="list-group-item"></li>
            </ul>
        </div>
		)
	}
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)
const ConnectedChat = connect(mapStateToProps, mapDispatchToProps)(Chat)
export default ConnectedChat

// export default HostRoomPage;
