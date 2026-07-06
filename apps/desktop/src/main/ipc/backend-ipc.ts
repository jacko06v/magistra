import {
  backendEchoRequestSchema,
  backendEchoResponseSchema,
  backendIpcChannels,
  type BackendCoreContract
} from '@magistra/shared'

export interface IpcMainLike {
  handle(channel: string, listener: (event: unknown, payload: unknown) => Promise<unknown>): void
}

export function registerBackendIpc(ipcMain: IpcMainLike, core: BackendCoreContract): void {
  ipcMain.handle(backendIpcChannels.echo, async (_event, payload) => {
    const request = backendEchoRequestSchema.parse(payload)
    const response = await core.echo(request)
    return backendEchoResponseSchema.parse(response)
  })
}
