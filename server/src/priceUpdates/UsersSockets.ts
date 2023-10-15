class UsersSockets {
    private usersSockets: Map<string, Set<string>> = new Map()

    getUserSockets = (userId: string) => this.usersSockets.get(userId)

    addUserSocket = (userId: string, socketId: string) => {
        const socketIds = this.usersSockets.get(userId) || new Set()
        socketIds.add(socketId)
        this.usersSockets.set(userId, socketIds)
    }

    removeSocket = (socketId: string) => {
        for (let [userId, socketIds] of this.usersSockets.entries()) {
            if (socketIds.has(socketId)) {
                socketIds.delete(socketId)
                if (socketIds.size === 0) {
                    this.usersSockets.delete(userId)
                } else {
                    this.usersSockets.set(userId, socketIds)
                }
            }
        }
    }
}

const usersSocketsManager = new UsersSockets()

export default usersSocketsManager