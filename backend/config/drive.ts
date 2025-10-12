import env from '#start/env'
import { defineConfig, services } from '@adonisjs/drive'
import app from '@adonisjs/core/services/app'

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  services: {
    fs: services.fs({
      location: env.get('NODE_ENV') === 'production'
        ? '/app/storage'
        : app.makePath('storage'),
      serveFiles: true,
      routeBasePath: '/uploads',
      visibility: 'public',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
