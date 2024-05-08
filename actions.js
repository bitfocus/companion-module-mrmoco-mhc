module.exports = function (self) {

	self.setActionDefinitions({
		recall_preset: {
			name: 'Recall Preset',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot ID',
					default: 0,
					min: 0,
					max: 100,
				},
				{
					id: 'num',
					type: 'number',
					label: 'Preset ID',
					default: 0,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				const url = `/v1/robots/${event.options.robot}/preset/${event.options.num}`
				self.sendCam(url)
			},
		},
		recall_move: {
			name: 'Recall Move',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot ID',
					default: 0,
					min: 0,
					max: 100,
				},
				{
					id: 'num',
					type: 'number',
					label: 'Move ID',
					default: 0,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				const url = `/v1/robots/${event.options.robot}/moves/${event.options.num}/begin`
				self.sendCam(url, 'POST')
			},
		},
		stop_all: {
			name: 'Stop All',
			callback: async (event) => {
				self.sendCam('/v1/robots/stop')
			},
		},
		set_move_option: {
			name: 'Set Move Option',
			callback: async (event) => {
				const url = `/v1/robots/0/moves/settings`
				options = {
					oneClickStart: true
				}
				self.sendCam(url, 'PATCH', options)
			}
		}
	})
}
