import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as room from '../../actions/RoomActions'
import * as navi from '../../actions/NavigationActions'
import backbtn from '../../layout/img/zur_vorherigen_Seite.png'

import PickYourPoisonPage from '../games/PickYourPoisonPage.js'

var images = require('../../utility/image_library')
var allBirds = images.birbs

var sf = require('../../utility/socketFunctions.js')

const mapStateToProps = state => {
	return state
}

class GameEndPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			userID: this.props.userID,
			userAvatar: this.props.userAvatar,
			roomID: this.props.roomID,
			currentPage: this.props.currentPage, // currentPage: page.GAME_PAGE,
			previousPage: this.props.previousPage,
            userList: this.props.userList,
		}

		let userdata = {
			u_name: this.state.userID,
			u_avatar: this.state.userAvatar
		}

        
		this.handleClick = this.handleClick.bind(this)
        this.generatePlace = this.generatePlace.bind(this)
        this.sortParticipants = this.sortParticipants.bind(this)
		this.updateUserListView = this.updateUserListView.bind(this)

        this.sortParticipants()
	}

	handleClick(e) {
		e.preventDefault()
		const { id } = e.target
        if(id === "backToLobby") {
            sf.return_to_lobby(this.state.roomID)
        }
	}

    sortParticipants() {
        // sorting schmorting sag' ich immer
        this.state.userList.sort( (u01, u02) => {
            return u02.points - u01.points
        })

        console.log(this.state.userList[1])
    }

	updateUserListView(userList) {
		userList = (userList) ? userList : []
		if(userList.length < 4) return <ul hidden></ul>
        let counter = 0

        let userArray = []
		for (let user of userList) {
            counter++
            if(counter <=3) continue // ignoring the winners

			let altdescription = 'User Icon of color ' + user.avatar.bird_color + ' with the mood ' + user.avatar.bird_mood + ''
			let likey = 'User_inLobby_' + user.name

			userArray.push(
                <li key={likey} className="user_inEndscreen">
                    <div className="user_inLobby">
                    	<img src={allBirds[user.avatar.bird_color][user.avatar.bird_mood]} alt={altdescription} />
					    <p id="userName">{user.name}</p>
				    </div>
                    <p className="pointsLooser">{user.points} Points</p>
                </li>
			)
		}

		// console.log("listing users");
		return <ul className="allUsers_inLobby">{userArray}</ul>
	}

    generatePlace(user, place) {
        // user = (user) ? user : { name: "ERROR", avatar: { bird_color: "bi", bird_mood: "terror" }, points: 69 }
        if(!user) {
            return
        }
        let altdescription = 'User Icon of color ' + user.avatar.bird_color + ' with the mood ' + user.avatar.bird_mood + ''
        
        let class_name = ""
        if(place == "#1") class_name = "winner"
        if(place == "#2") class_name = "second"
        if(place == "#3") class_name = "third"

        return(
            <div className={class_name}>
                <div className="place_user">
                    <p className="place">{place}</p>
                    <div className="user_inLobby">
                        <img src={allBirds[user.avatar.bird_color][user.avatar.bird_mood]} alt={altdescription} />
                        <p id="userName">{user.name}</p>
                    </div>
                </div>
                <p className="points">{user.points} Points</p>
            </div>
        )
    }

	render() {
		return (
			<main>
				<div className="game_page">
					<div className="guide">
                        <h2>Quick Guide:</h2>
                        <ul>
                            <li><p>Laugh at your friends if you won</p></li>
                            <li><p>If you didn't get first place, let the winner ridicule you</p></li>
                            <li><p>Once you get bored / can't take it anymore, click "Lobby"</p></li>
                        </ul>
					</div>
                    <div className="end_page_content">
                        <div className="end_page_left">
							<div id="gameEndTop" className="game_end_top">
								<p>Winners of this Game:</p>
							</div>
							<div id="endContent" className="end_content">
							
								<div className="end_top_three">
							
									<div className="winnerCont">
										{this.generatePlace(this.state.userList[0], "#1")}
									</div>
							
									<div className="second_third">
										{this.generatePlace(this.state.userList[1], "#2")}
										{this.generatePlace(this.state.userList[2], "#3")}
									</div>
								</div>

								
								<div className="end_users">
									{/* <ul className="allUsers_inLobby"> */}
										{this.updateUserListView(this.state.userList)}
									{/* </ul> */}
								</div>
							</div>
                        </div>
                        <nav className="end_page_right">
                            <div>
                                <button className="end_button" onClick={this.handleClick} id="backToLobby">Lobby</button>
                            </div>
                        </nav>
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
const ConnectedGameEndPage = connect(mapStateToProps, mapDispatchToProps)(GameEndPage)
export default ConnectedGameEndPage

// export default HostRoomPage;
