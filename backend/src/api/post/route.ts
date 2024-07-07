import { BaseElysia } from '../..'

export default (app: BaseElysia) => app.group('/post', (app) => app.get('/', () => 'asd'))
