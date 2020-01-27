# Visonic powermanage v8.0 API compatible client

[![Coverage Status](https://coveralls.io/repos/github/chrisns/visonic_v8/badge.svg?branch=master)](https://coveralls.io/github/chrisns/visonic_v8?branch=master)
![ci](https://github.com/chrisns/visonic_v8/workflows/ci/badge.svg)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/chrisns/visonic_v8.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/chrisns/visonic_v8/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/chrisns/visonic_v8.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/chrisns/visonic_v8/context:javascript)

> The v8 api is noticeably different in that it requires email/password auth in addition to the user's pin

Written in typescript for your development pleasure :)

## Supported features

- authentication
- get status of panel
- get current alarms
- get current troubles
- get current alerts
- get panel info
- get event history
- get wake up sms string
- get devices
- get status on a process change
- get all locations
- set the state (disarm/home/away)

## Nice to have features

> If you'd like to raise a PR? :)

- trigger cameras to take pictures
- collect pictures from cameras
- user management

## Example Usage

### index.ts

```typescript
import * as alarm from '@chrisns/visonic_v8'
const { hostname, app_id, user_code, panel_id, email, password } = process.env

const run = async () => {
  const authenticatedAxios = await alarm.getAuthenticatedAxios({
    hostname,
    app_id,
    user_code,
    user_token: null,
    panel_id,
    email,
    password
  })
  const status = await alarm.getStatus(authenticatedAxios)
  console.log(status)
}
try {
  run()
} catch (error) {
  console.error(error)
}
```

### Shell

```bash
npm i --save @chrisns/visonic_v8 typescript
ts-node index.ts
```

### Response

```js
{
  connected: false,
  connected_status: {
    bba: {
      is_connected: false,
      state: 'online'
    },
    gprs: {
      is_connected: false,
      state: 'online'
    }
  },
  discovery: {
    completed: true,
    stages: 10,
    in_queue: 0,
    triggered: null
  },
  partitions: [ {
    id: -1,
    state: 'DISARM',
    status: '',
    ready: true,
    options: []
  } ],
  rssi: {
    level: 'ok',
    network: 'Unknown'
  }
}
```

## References

- https://github.com/And3rsL/VisonicAlarm2
- https://github.com/tkleijkers/visonic-powerlink3
