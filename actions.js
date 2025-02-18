const { flat } = require("./upgrades")

module.exports = function (self) {

	self.setActionDefinitions({
		recall_preset: {
			name: 'Recall Preset',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot ID (1-15)',
					default: 1,
					min: 1,
					max: 15,
				},
				{
					id: 'num',
					type: 'number',
					label: 'Preset Index (1-100)',
					default: 1,
					min: 1,
					max: 100,
				},
			],
			callback: async (event) => {
				const url = `/v1/robots/${event.options.robot}/preset/${event.options.num-1}`
				self.sendCam(url)
			},
		},
		recall_move: {
			name: 'Recall Move',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot ID (1-15)',
					default: 1,
					min: 1,
					max: 15,
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
		stop_robot: {
			name: 'Stop Robot',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot ID (1-15)',
					default: 1,
					min: 1,
					max: 15,
				}
			],
			callback: async (event) => {
				const url = `/v1/robots/${event.options.robot-1}/stop`
				self.sendCam(url, 'PUT')
			}
		},
		stop_all: {
			name: 'Stop All Robots',
			callback: async (event) => {
				self.sendCam('/v1/robots/stop')
			},
		},
		set_move_option: {
			name: 'Set Move Options',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot ID (1-15)',
					default: 1,
					min: 1,
					max: 15,
				},
				{
					type: 'dropdown',
					label: 'One Click Start',
					id: 'oneClickStart',
					choices: [
						{ id: false, label: 'Off' },
						{ id: true, label: 'On' },
					],
					default: '1',
				},
				{
					type: 'dropdown',
					label: 'Loop',
					id: 'loop',
					choices: [
						{ id: false, label: 'Off' },
						{ id: true, label: 'On' },
					],
					default: '1',
				}
			],
			callback: async (event) => {
				const url = `/v1/robots/${event.options.robot-1}/moves/settings`
				options = {
					oneClickStart: event.options.oneClickStart,
					loop: event.options.oneClickStart
				}
				self.sendCam(url, 'PATCH', options)
			}
		},
		enable_robot: {
			name: 'Robot Enable/Disable',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot ID (1-15)',
					default: 1,
					min: 1,
					max: 15,
				},
				{
					type: 'dropdown',
					label: 'Enabled On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '1',
				}
			],
			callback: async (event) => {
				const url = `/v1/robots/${event.options.robot-1}/configuration`
				data = {
					enable: event.options.bol === '1'
				}
				self.sendCam(url, 'PATCH', data)
			}
		},
		set_input: {
			name: 'Set Pan Bar Input On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'Input Number',
					id: 'input',
					choices: [
						{ id: 0, label: 'Input 1' },
						{ id: 1, label: 'Input 2' },
					],
					default: '1',
				},
				{
					type: 'dropdown',
					label: 'Enabled On/Off',
					id: 'state',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '1',
				}
			],
			callback: async (event) => {
				const url = `/v1/devices/3/inputs`
				payload = {
					State: event.options.state === '1',
					Index: event.options.input
				}
				self.sendCam(url, 'PATCH', payload)
			}
		},
		manage_tracking: {
			name: 'Robot Tracking On/Off',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot Index (1-15)',
					default: 1,
					min: 1,
					max: 15,
				},
				{
					type: 'dropdown',
					label: 'Enabled On/Off',
					id: 'state',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '1',
				}
			],
			callback: async (event) => {
				const url = `/v1/robots/${event.options.robot-1}/tracking`
				options = {
					TrackingEnabled: event.options.state === '1'
				}
				self.sendCam(url, 'PATCH', options)
			}
		}
		// add loop parameter to mset move ooptions
	})
}
