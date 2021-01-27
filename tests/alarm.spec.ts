import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import * as mod from '../src/alarm'

const mockAxios = new MockAdapter(axios)

const config = {
  hostname: 'https://example.com',
  user_code: '1234',
  app_id: 'a200f36e-84dc-47fe-b104-3e75c525dac6',
  panel_id: '123A11',
  partition: '-1',
  user_email: 'user@example.com',
  user_password: 'password1',
  user_token: '0a863529-7735-49ce-9056-1638713a82ae',
  session_token: 'a1e19b14-6ae2-4d09-a1a2-11c88172500d'
}

describe('alarm', () => {
  let authenticatedAxios
  beforeEach(async () => {
    mockAxios.reset()
    mockAxios
      .onPost(`${config.hostname}/rest_api/8.0/auth`)
      .reply(200, {
        user_token: 'foobara'
      })
      .onPost(`${config.hostname}/rest_api/8.0/panel/login`)
      .reply(200, {
        session_token: 'foobar'
      })
    authenticatedAxios = await mod.getAuthenticatedAxios({
      hostname: config.hostname,
      app_id: config.app_id,
      user_code: config.user_code,
      user_token: null,
      panel_id: config.panel_id,
      email: config.user_email,
      password: config.user_password
    })
  })
  test.todo('getAuthenticatedAxios')
  test('getUserToken', () =>
    expect(
      mod.getUserToken({
        hostname: config.hostname,
        email: config.user_email,
        password: config.user_password,
        app_id: config.app_id
      })
    ).resolves.toBe('foobara'))
  test('getSessionToken', () =>
    expect(
      mod.getSessionToken({
        hostname: config.hostname,
        app_id: config.app_id,
        user_code: config.user_code,
        user_token: config.user_token,
        panel_id: config.panel_id
      })
    ).resolves.toBe('foobar'))
  test('getStatus', async () => {
    const expected_response = {
      connected: true,
      connected_status: {
        bba: { is_connected: true, state: 'online' },
        gprs: { is_connected: true, state: 'online' }
      },
      discovery: {
        completed: true,
        in_queue: 0,
        stages: 10,
        triggered: null
      },
      partitions: [
        { id: -1, options: [], ready: true, state: 'DISARM', status: '' }
      ],
      rssi: { level: 'ok', network: 'Unknown' }
    }
    mockAxios
      .onGet(`${config.hostname}/rest_api/8.0/status`)
      .reply(200, expected_response)
    return expect(mod.getStatus(authenticatedAxios)).resolves.toStrictEqual(
      expected_response
    )
  })
  test('getAlarms', async () => {
    const expected_response = [] // TODO: find out what an alarm looks like
    mockAxios
      .onGet(`${config.hostname}/rest_api/8.0/alarms`)
      .reply(200, expected_response)
    return expect(mod.getAlarms(authenticatedAxios)).resolves.toStrictEqual(
      expected_response
    )
  })
  test('getTroubles', async () => {
    const expected_response = [
      {
        device_type: 'ZONE',
        location: 'another',
        partitions: [1],
        trouble_type: 'PREENROLL_NO_CODE',
        zone: 11,
        zone_name: '',
        zone_type: 'PERIMETER'
      }
    ]
    mockAxios
      .onGet(`${config.hostname}/rest_api/8.0/troubles`)
      .reply(200, expected_response)
    return expect(mod.getTroubles(authenticatedAxios)).resolves.toStrictEqual(
      expected_response
    )
  })
  test('getAlerts', async () => {
    const expected_response = [] // TODO: find out what alerts look like
    mockAxios
      .onGet(`${config.hostname}/rest_api/8.0/alerts`)
      .reply(200, expected_response)
    return expect(mod.getAlerts(authenticatedAxios)).resolves.toStrictEqual(
      expected_response
    )
  })
  test('getPanelInfo', async () => {
    const expected_response = {
      bypass_mode: 'manual_bypass',
      current_user: 'master_user',
      features: {
        alerts: true,
        disabling_siren: true,
        enabling_siren: true,
        outputs_setup: true,
        set_date_time: true,
        video_on_demand: true,
        wi_fi_connection: false
      },
      local_wakeup_needed: true,
      manufacturer: 'Visonic',
      model: 'PowerMaster 30',
      partitions: [
        {
          active: true,
          exit_delay_time: 30,
          id: -1,
          name: 'ALL',
          state_set: 'all'
        }
      ],
      remote_switch_to_programming_mode_requires_user_acceptance: true,
      serial: '123A11',
      state_sets: {
        all: [
          {
            name: 'AWAY',
            options: ['NOENTRY', 'LATCHKEY'],
            settable: true,
            statuses: ['EXIT'],
            transitions: ['DISARM', 'HOME']
          },
          {
            name: 'HOME',
            options: ['NOENTRY'],
            settable: true,
            statuses: ['EXIT'],
            transitions: ['DISARM', 'AWAY']
          },
          {
            name: 'DISARM',
            options: [],
            settable: true,
            statuses: [],
            transitions: ['DISARM', 'AWAY', 'HOME']
          },
          {
            name: 'ENTRY_DELAY',
            options: [],
            settable: false,
            statuses: [],
            transitions: ['DISARM']
          },
          {
            name: 'PROGRAMMING',
            options: [],
            settable: false,
            statuses: [],
            transitions: []
          }
        ]
      }
    }
    mockAxios
      .onGet(`${config.hostname}/rest_api/8.0/panel_info`)
      .reply(200, expected_response)
    return expect(mod.getPanelInfo(authenticatedAxios)).resolves.toStrictEqual(
      expected_response
    )
  })
  test('getEvents', async () => {
    const expected_response = [
      {
        appointment: 'User 2',
        datetime: '2021-01-11 07:14:32',
        description: 'Disarm',
        device_type: 'USER',
        event: 502,
        label: 'DISARM',
        name: 'Her',
        partitions: [1],
        type_id: 89,
        video: false,
        zone: 2
      },
      {
        appointment: 'User 1',
        datetime: '2021-01-11 23:20:49',
        description: 'Arm Home',
        device_type: 'USER',
        event: 624,
        label: 'ARM',
        name: 'Him',
        partitions: [1],
        type_id: 85,
        video: false,
        zone: 1
      },
      {
        appointment: 'User 2',
        datetime: '2021-01-12 06:46:46',
        description: 'Disarm',
        device_type: 'USER',
        event: 655,
        label: 'DISARM',
        name: 'Hannah',
        partitions: [1],
        type_id: 89,
        video: false,
        zone: 2
      },
      {
        appointment: 'IPMP',
        datetime: '2021-01-12 13:20:31',
        description: 'GPRS module has come online',
        device_type: 'IPMP_SERVER',
        event: 722,
        label: 'ONLINE',
        name: null,
        partitions: [1],
        type_id: 992,
        video: false,
        zone: null
      }
    ]
    mockAxios
      .onGet(`${config.hostname}/rest_api/8.0/events`)
      .reply(200, expected_response)
    return expect(mod.getEvents(authenticatedAxios)).resolves.toStrictEqual(
      expected_response
    )
  })
  test('getWakeUpSMS', async () => {
    const expected_response = {
      phone: '01111',
      sms: 'CONNECT;AAAA;CS-1;SEQ-1231;'
    }
    mockAxios
      .onGet(`${config.hostname}/rest_api/8.0/wakeup_sms`)
      .reply(200, expected_response)
    return expect(mod.getWakeUpSMS(authenticatedAxios)).resolves.toStrictEqual(
      expected_response
    )
  })
  test('getAllDevices', async () => {
    const expected_response = [
      {
        device_number: 1,
        device_type: 'CONTROL_PANEL',
        enrollment_id: null,
        id: 1230,
        name: '',
        partitions: [1],
        preenroll: false,
        removable: false,
        renamable: false,
        subtype: 'VISONIC_PANEL',
        warnings: null,
        zone_type: null
      },
      {
        device_number: 1,
        device_type: 'ZONE',
        enrollment_id: '123-1231',
        id: 1231,
        name: '',
        partitions: [1],
        preenroll: false,
        removable: true,
        renamable: true,
        subtype: 'CONTACT_V',
        traits: {
          bypass: {
            enabled: false
          },
          location: {
            name: 'Front door'
          },
          rarely_used: {
            enabled: false
          },
          rssi: {},
          soak: {
            enabled: false
          }
        },
        warnings: null,
        zone_type: 'DELAY_1'
      },
      {
        device_number: 2,
        device_type: 'ZONE',
        enrollment_id: '123-1232',
        id: 1232,
        name: '',
        partitions: [1],
        preenroll: false,
        removable: true,
        renamable: true,
        subtype: 'MOTION_CAMERA',
        traits: {
          bypass: {
            enabled: false
          },
          location: {
            name: 'Dining room'
          },
          rarely_used: {
            enabled: false
          },
          rssi: {},
          soak: {
            enabled: false
          },
          vod: {}
        },
        warnings: [
          {
            in_memory: false,
            severity: 'TROUBLE',
            type: 'PREENROLL_NO_CODE'
          }
        ],
        zone_type: 'INTERIOR_FOLLOW'
      },
      {
        device_number: 3,
        device_type: 'ZONE',
        enrollment_id: '123-1233',
        id: 1233,
        name: '',
        partitions: [1],
        preenroll: false,
        removable: true,
        renamable: true,
        subtype: 'MOTION_CAMERA',
        traits: {
          bypass: {
            enabled: false
          },
          location: {
            name: 'Kitchen'
          },
          rarely_used: {
            enabled: false
          },
          rssi: {},
          soak: {
            enabled: false
          },
          vod: {}
        },
        warnings: null,
        zone_type: 'INTERIOR'
      },
      {
        device_number: 4,
        device_type: 'ZONE',
        enrollment_id: '123-1234',
        id: 1234,
        name: '',
        partitions: [1],
        preenroll: false,
        removable: true,
        renamable: true,
        subtype: 'SHOCK_CONTACT_AUX_ANTIMASK',
        traits: {
          bypass: {
            enabled: false
          },
          location: {
            name: 'Loft'
          },
          rarely_used: {
            enabled: false
          },
          rssi: {},
          soak: {
            enabled: false
          }
        },
        warnings: null,
        zone_type: 'INTERIOR'
      }
    ]
    mockAxios
      .onGet(`${config.hostname}/rest_api/8.0/devices`)
      .reply(200, expected_response)
    return expect(mod.getAllDevices(authenticatedAxios)).resolves.toStrictEqual(
      expected_response
    )
  })
  test('getProcessStatus', async () => {
    const expected_response = [
      {
        error: 'PMAX_ERROR',
        message: 'Replaced',
        status: 'failed',
        token: 'poo'
      }
    ]
    mockAxios
      .onGet(`${config.hostname}/rest_api/8.0/process_status`)
      .reply(200, expected_response)

    return expect(
      mod.getProcessStatus('foa', authenticatedAxios)
    ).resolves.toStrictEqual(expected_response)
  })
  test('getLocations', async () => {
    const expected_response = [
      {
        hel_id: 0,
        is_editable: false,
        name: 'Loft'
      },
      {
        hel_id: 1,
        is_editable: false,
        name: 'Back door'
      },
      {
        hel_id: 2,
        is_editable: false,
        name: 'Cellar'
      }
    ]
    mockAxios
      .onGet(`${config.hostname}/rest_api/8.0/locations`)
      .reply(200, expected_response)
    return expect(mod.getLocations(authenticatedAxios)).resolves.toStrictEqual(
      expected_response
    )
  })
  test('setState', async () => {
    const expected_response = {
      process_token: 'uia'
    }
    mockAxios
      .onPost(`${config.hostname}/rest_api/8.0/set_state`)
      .reply(200, expected_response)
    return expect(
      mod.setState({ state: 'DISARM', partition: -1 }, authenticatedAxios)
    ).resolves.toStrictEqual(expected_response)
  })
})
