import axios from 'axios'
const app_type = 'com.visonic.PowerMaxApp'

interface getUserToken {
  hostname: string
  app_id: string
  email: string
  password: string
}
export async function getUserToken (config: getUserToken) {
  const token = await axios.post(`${config.hostname}/rest_api/8.0/auth`, {
    email: config.email,
    password: config.password,
    app_id: config.app_id
  })
  return token.data.user_token
}

interface getSessionToken {
  hostname: string
  app_id: string
  user_token: string
  user_code: string
  panel_id: string
}
export async function getSessionToken (config: getSessionToken) {
  const sessionToken = await axios.post(
    `${config.hostname}/rest_api/8.0/panel/login`,
    {
      user_code: config.user_code,
      app_type: app_type,
      app_id: config.app_id,
      panel_serial: config.panel_id
    },
    {
      headers: {
        'User-Token': config.user_token
      }
    }
  )
  return sessionToken.data.session_token
}

// TODO: define the output
export async function getStatus (authenticatedAxios) {
  return (await authenticatedAxios.get('status')).data
}

// TODO: define the output
export async function getAlarms (authenticatedAxios) {
  return (await authenticatedAxios.get('alarms')).data
}

export async function getTroubles (authenticatedAxios) {
  return (await authenticatedAxios.get('troubles')).data
}

export async function getAlerts (authenticatedAxios) {
  return (await authenticatedAxios.get('alerts')).data
}

export async function getPanelInfo (authenticatedAxios) {
  return (await authenticatedAxios.get('panel_info')).data
}

export async function getEvents (authenticatedAxios) {
  return (await authenticatedAxios.get('events')).data
}

export async function getWakeUpSMS (authenticatedAxios) {
  return (await authenticatedAxios.get('wakeup_sms')).data
}

export async function getAllDevices (authenticatedAxios) {
  return (await authenticatedAxios.get('devices')).data
}

export async function getProcessStatus (
  process_token: string,
  authenticatedAxios
) {
  return (
    await authenticatedAxios.get('process_status', {
      params: { process_tokens: process_token }
    })
  ).data
}

export async function getLocations (authenticatedAxios) {
  return (await authenticatedAxios.get('locations')).data
}

interface setState {
  state: 'HOME' | 'AWAY' | 'DISARM'
  partition: number
}

interface setStateResponse {
  process_token: string
}

export async function setState (
  state: setState,
  authenticatedAxios
): Promise<setStateResponse> {
  return (await authenticatedAxios.post('set_state', state)).data
}

export async function getAuthenticatedAxios (
  params: getUserToken & getSessionToken
) {
  const usertoken = await getUserToken({
    hostname: params.hostname,
    email: params.email,
    password: params.password,
    app_id: params.app_id
  })
  const sessiontoken = await getSessionToken({
    hostname: params.hostname,
    app_id: params.app_id,
    user_code: params.user_code,
    panel_id: params.panel_id,
    user_token: usertoken
  })
  const client = axios.create({
    baseURL: `${params.hostname}/rest_api/8.0/`,
    headers: {
      'User-Token': usertoken,
      'Session-Token': sessiontoken
    }
  })
  return client
}
