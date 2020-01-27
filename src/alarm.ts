import axios from 'axios'
import AxiosInstance from 'axios'
const app_type = 'com.visonic.PowerMaxApp'

interface getUserToken {
  hostname: string
  app_id: string
  email: string
  password: string
}
export async function getUserToken (config: getUserToken): Promise<string> {
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
export async function getSessionToken (
  config: getSessionToken
): Promise<string> {
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

interface getStatusResponse {
  connected: boolean
  connected_status: {
    bba: { is_connected: boolean; state: string }
    gprs: { is_connected: boolean; state: string }
  }
  discovery: {
    completed: boolean
    in_queue: number
    stages: number
    triggered: null
  }
  partitions: [
    {
      id: number
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options: any[]
      ready: boolean
      state: string
      status: string
    }
  ]
  rssi: { level: 'ok'; network: 'Unknown' }
}

export async function getStatus (
  authenticatedAxios: typeof AxiosInstance
): Promise<getStatusResponse> {
  return (await authenticatedAxios.get('status')).data
}

// TODO: define the output
export async function getAlarms (
  authenticatedAxios: typeof AxiosInstance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return (await authenticatedAxios.get('alarms')).data
}

interface getTroublesResponse {
  [index: number]: {
    device_type: string
    location: string
    partitions: [number]
    trouble_type: string
    zone: number
    zone_name: string
    zone_type: string
  }
}
export async function getTroubles (
  authenticatedAxios: typeof AxiosInstance
): Promise<getTroublesResponse> {
  return (await authenticatedAxios.get('troubles')).data
}

export async function getAlerts (
  authenticatedAxios: typeof AxiosInstance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return (await authenticatedAxios.get('alerts')).data
}

export async function getPanelInfo (
  authenticatedAxios: typeof AxiosInstance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return (await authenticatedAxios.get('panel_info')).data
}

interface getEventsResponse {
  [index: number]: {
    appointment: string
    datetime: string
    description: string
    device_type: string
    event: number
    label: string
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    partitions: any[]
    type_id: number
    video: boolean
    zone: number
  }
}

export async function getEvents (
  authenticatedAxios: typeof AxiosInstance
): Promise<getEventsResponse> {
  return (await authenticatedAxios.get('events')).data
}

interface getWakeUpSMSResponse {
  phone: string
  sms: string
}

export async function getWakeUpSMS (
  authenticatedAxios: typeof AxiosInstance
): Promise<getWakeUpSMSResponse> {
  return (await authenticatedAxios.get('wakeup_sms')).data
}

interface getAllDevicesResponse {
  [index: number]: {
    device_number: number
    device_type: string
    enrollment_id: number | null
    id: number
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    partition: any[]
    preenroll: boolean
    removable: boolean
    renamable: boolean
    subtype: string
    warnings: null | Array<{
      in_memory: boolean
      severity: string
      type: string
    }>
    zone_type: string | null
    traits?: {
      bypass: { enabled: boolean }
      location: { name: string }
      rarely_used: { enabled: boolean }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rssi: any
      soak: { enabled: boolean }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vod?: any
    }
  }
}

export async function getAllDevices (
  authenticatedAxios: typeof AxiosInstance
): Promise<getAllDevicesResponse> {
  return (await authenticatedAxios.get('devices')).data
}

interface getProcessStatusResponse {
  [index: number]: {
    error: string
    message: string
    status: string
    token: string
  }
}

export async function getProcessStatus (
  process_token: string,
  authenticatedAxios: typeof AxiosInstance
): Promise<getProcessStatusResponse> {
  return (
    await authenticatedAxios.get('process_status', {
      params: { process_tokens: process_token }
    })
  ).data
}

interface getLocationsResponse {
  [index: number]: { hel_id: number; is_editable: boolean; name: string }
}

export async function getLocations (
  authenticatedAxios: typeof AxiosInstance
): Promise<getLocationsResponse> {
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
  authenticatedAxios: typeof AxiosInstance
): Promise<setStateResponse> {
  return (await authenticatedAxios.post('set_state', state)).data
}

export async function getAuthenticatedAxios (
  params: getUserToken & getSessionToken
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
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
