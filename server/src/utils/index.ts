import { db } from "../db"

export const dbHealthCheck = async () => {
    console.log('running DB health check...')

    let retries = 5
    while (retries) {
        try {
            await db.$queryRaw`SELECT 1`
            break
        } catch (err) {
            retries -= 1
            if (!retries) throw new Error('health check error')
            await new Promise(resolve => setTimeout(resolve, 10000))
        }
    }
    console.log('DB health check done')
}
