const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')



class ModuleInstance extends InstanceBase {

	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	async sendCam(self, str) {
		const { default: got } = await import('got');
		if (str) {

			const url = `https://${self.config.httpHost}:${self.config.httpPort}${str}`

			if (self.config.debug) {
				self.log('debug', `Sending : ${url}`)
			}

			try {
				const response = await got.put(
					url,
					{
						username:self.config.username,
						password:self.config.password,
						https: { rejectUnauthorized: false }
					}
				)
				console.log("Result from REST:" + str);
			} catch (err) {
				throw new Error(`Action failed err: ${err}`)
			}
		}
	}

	async getRobotList(self) {
		const { default: got } = await import('got');
		try {
			const response = await got.get(
				`https://${self.config.httpHost}:${self.config.httpPort}/v1/status`,
				{
					username:self.config.username,
					password:self.config.password,
					https: { rejectUnauthorized: false }
				}
			).json()
			console.log("Result from REST:" + response);
		} catch (err) {
			return []
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'httpHost',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'httpPort',
				label: 'Target Port',
				width: 4,
				regex: Regex.PORT,
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'User Name',
				width: 4,
				value: 'operator',
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				width: 4,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
