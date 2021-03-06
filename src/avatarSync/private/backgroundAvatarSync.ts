import schedule from 'node-schedule'

export const backgroundAvatarSync = {
  init(): void {
    schedule.scheduleJob('*/1 * * * *', () => {
      console.log('The answer to life, the universe, and everything!')
    })
  },
}
