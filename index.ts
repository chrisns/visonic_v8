import * as alarm from './src/alarm'
const { hostname, app_id, user_code, panel_id, email, password } = process.env
console.log(user_code)
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
