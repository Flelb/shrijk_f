import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as user from '../../actions/UserdataActions'

var images = require('../../utility/image_library')
var birbs = images.birbs

const mapStateToProps = state => {
	return state
}

class BirdPopup extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userAvatar: this.props.userAvatar
		}
		this.handleClick = this.handleClick.bind(this)
		this.make_bird_grid = this.make_bird_grid.bind(this)
	}

	handleClick(e) {
		e.preventDefault()
		const { id } = e.target

		let color = undefined
		let mood = undefined

		try {
			color = id.split('_')[1].split(':')[0]
			mood = id.split('_')[1].split(':')[1]
		} catch {
			color = this.state.userAvatar.bird_color
			mood = this.state.userAvatar.bird_mood
		}
		this.setState({ userAvatar: { bird_color: color, bird_mood: mood } }, () => {
			const { getEnterBirdCredentialsAction } = this.props
			getEnterBirdCredentialsAction(this.state.userAvatar)
			let avatar = document.getElementById('avatar')
			avatar.src = birbs[color][mood]

			document.getElementById('bird_picker').hidden = true
		})
	}

	make_bird_grid() {
		let bird_colors = ['arizona', 'beach', 'bi', 'blu', 'normalo', 'poke']
		let bird_moods = ['angery', 'happy', 'sad', 'satisfied', 'sleepy', 'terror']

		let listarray = []

		for (let i = 0; i < bird_colors.length; i++) {
			let birdarray = []

			for (let j = 0; j < bird_moods.length; j++) {
				let altdescription = 'Bird Icon of color ' + bird_colors[i] + ' with the mood ' + bird_moods[j] + ''
				let combo = 'icon_' + bird_colors[i] + ':' + bird_moods[j]
				let imgsrc = birbs[bird_colors[i]][bird_moods[j]]
				birdarray.push(
					<li key={combo} onClick={this.handleClick}>
						<img id={combo} alt={altdescription} src={imgsrc} />
					</li>
				)
			}

			listarray.push(<ul key={'bird_list_color_' + bird_colors[i]}>{birdarray}</ul>)
		}

		return <>{listarray}</>
	}

	render() {
		// variables and logic here
		return (
			<div className="bird_picker" id="bird_picker" hidden>
				{this.make_bird_grid()}
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => bindActionCreators({ getEnterBirdCredentialsAction: user.getEnterBirdCredentialsAction }, dispatch)
const ConnectedBirdPopup = connect(mapStateToProps, mapDispatchToProps)(BirdPopup)
export default ConnectedBirdPopup

// export default BirdPopup;
