import { io } from 'socket.io-client'

import { wsUrl } from '../utils'

const socket = io(wsUrl)

export default socket
