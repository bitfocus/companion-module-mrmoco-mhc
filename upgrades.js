module.exports = [
	/*
	 * Place your upgrade scripts here
	 * Remember that once it has been added it cannot be removed!
	 */
	function v102(context, props) {
		// prepare the upgrade response
		const result = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		for (const action of props.actions) {
			switch (action.actionId) {
				case 'set_move_option':
					action.actionId = 'set_move_option_v2'
					action.options = { oneClickStart: true, loop: false }
					result.updatedActions.push(action)
					break
			}
		}
		return result
	},
]
