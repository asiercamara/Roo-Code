import * as vscode from "vscode"
import originalAxios, { AxiosInstance, AxiosRequestConfig } from "axios"
import * as https from "https"
import { HttpsProxyAgent } from "https-proxy-agent"

// Función para obtener una instancia de axios configurada con el proxy de VSCode
function getConfiguredAxios(): AxiosInstance {
	// Obtener la configuración de VSCode
	const config = vscode.workspace.getConfiguration("http")
	const proxySettings: string | undefined = config.get("proxy")
	const proxyStrictSSL: boolean = config.get("proxyStrictSSL") || false

	console.error(`Axios Proxy settings:${JSON.stringify(proxySettings)}`)

	// Configuración base de axios
	const axiosConfig: AxiosRequestConfig = {}

	// Verificar si el proxy está activado
	if (proxySettings && proxySettings.trim() !== "") {
		const agent = new HttpsProxyAgent(proxySettings)

		axiosConfig.proxy = false
		axiosConfig.httpAgent = agent
		axiosConfig.httpsAgent = agent
	}

	return originalAxios.create(axiosConfig)
}

// Crear una instancia configurada
const axios = getConfiguredAxios()

// Re-exportar lo que originalmente exporta axios
export default axios
export * from "axios"
