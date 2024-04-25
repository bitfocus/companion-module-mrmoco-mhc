module.exports = function (self) {

	self.setActionDefinitions({
		sample_action: {
			name: 'Recall Preset',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot ID',
					default: 1,
					min: 1,
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
				self.sendCam(self, url)
			},
		},
		start_preset: {
			name: 'Stop All',
			callback: async (event) => {
				self.sendCam(self, '/v1/robots/stop')
			},
		}
	})
}
