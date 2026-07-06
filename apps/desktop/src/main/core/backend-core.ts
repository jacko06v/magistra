import type {
  BackendCoreContract,
  BackendEchoRequest,
  BackendEchoResponse,
  ChatRequest,
  ChatResponse,
  RicercaRequest,
  RicercaResponse,
  RetrievalRequest,
  RetrievalResponse,
  UploadDocumentoRequest,
  UploadDocumentoResponse
} from '@magistra/shared'

export class BackendOperationNotImplementedError extends Error {
  constructor(operation: string) {
    super(`Operazione backend non ancora implementata: ${operation}`)
    this.name = 'BackendOperationNotImplementedError'
  }
}

export function createBackendCore(now: () => Date = () => new Date()): BackendCoreContract {
  return {
    async echo(request: BackendEchoRequest): Promise<BackendEchoResponse> {
      return {
        messaggio: request.messaggio,
        ricevuto_il: now().toISOString(),
        lunghezza: request.messaggio.length
      }
    },

    async chat(request: ChatRequest): Promise<ChatResponse> {
      void request
      throw new BackendOperationNotImplementedError('chat')
    },

    async retrieval(request: RetrievalRequest): Promise<RetrievalResponse> {
      void request
      throw new BackendOperationNotImplementedError('retrieval')
    },

    async ricerca(request: RicercaRequest): Promise<RicercaResponse> {
      void request
      throw new BackendOperationNotImplementedError('ricerca')
    },

    async uploadDocumento(request: UploadDocumentoRequest): Promise<UploadDocumentoResponse> {
      void request
      throw new BackendOperationNotImplementedError('uploadDocumento')
    }
  }
}
