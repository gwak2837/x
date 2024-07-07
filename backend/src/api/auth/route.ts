import { BaseElysia } from '../..'

export default (app: BaseElysia) => app.group('/auth', (app) => app.get('/', () => 'asd'))
