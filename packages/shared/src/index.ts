import { z } from 'zod'

// Pacchetto dei contratti condivisi.
//
// Qui vivono i tipi e gli schemi Zod usati ai confini tra i contesti (messaggi
// IPC, input dell'utente, dati esterni), così frontend, backend e worker
// parlano la stessa lingua senza duplicare le definizioni.

/** Schema Zod delle informazioni di base sull'applicazione. */
export const appInfoSchema = z.object({
  name: z.string(),
  version: z.string()
})

/** Informazioni di base sull'applicazione, validate ai confini. */
export type AppInfo = z.infer<typeof appInfoSchema>

/** Canali IPC esposti dal backend in-process. */
export const backendIpcChannels = {
  echo: 'backend:echo'
} as const

/** Richiesta dell'operazione di esempio usata per validare il trasporto IPC. */
export const backendEchoRequestSchema = z.object({
  messaggio: z.string().min(1),
  timestamp_client: z.string().datetime().optional()
})

/** Risposta validata dell'operazione di esempio. */
export const backendEchoResponseSchema = z.object({
  messaggio: z.string(),
  ricevuto_il: z.string().datetime(),
  lunghezza: z.number().int().nonnegative()
})

export type BackendEchoRequest = z.infer<typeof backendEchoRequestSchema>
export type BackendEchoResponse = z.infer<typeof backendEchoResponseSchema>

export const chatRequestSchema = z.object({
  messaggio: z.string().min(1),
  conversazione_id: z.string().optional()
})

export const chatResponseSchema = z.object({
  risposta: z.string(),
  citazioni: z.array(z.string()).default([])
})

export type ChatRequest = z.infer<typeof chatRequestSchema>
export type ChatResponse = z.infer<typeof chatResponseSchema>

export const retrievalRequestSchema = z.object({
  query: z.string().min(1),
  limite: z.number().int().positive().max(50).default(10)
})

export const retrievalResponseSchema = z.object({
  risultati: z.array(
    z.object({
      id: z.string(),
      titolo: z.string(),
      estratto: z.string()
    })
  )
})

export type RetrievalRequest = z.infer<typeof retrievalRequestSchema>
export type RetrievalResponse = z.infer<typeof retrievalResponseSchema>

export const ricercaRequestSchema = z.object({
  query: z.string().min(1),
  filtri: z.record(z.string(), z.string()).optional()
})

export const ricercaResponseSchema = z.object({
  risultati: z.array(
    z.object({
      id: z.string(),
      titolo: z.string(),
      tipo: z.string()
    })
  )
})

export type RicercaRequest = z.infer<typeof ricercaRequestSchema>
export type RicercaResponse = z.infer<typeof ricercaResponseSchema>

export const uploadDocumentoRequestSchema = z.object({
  nome_file: z.string().min(1),
  mime_type: z.string().min(1),
  dimensione_byte: z.number().int().nonnegative()
})

export const uploadDocumentoResponseSchema = z.object({
  documento_id: z.string(),
  stato: z.enum(['accettato', 'rifiutato'])
})

export type UploadDocumentoRequest = z.infer<typeof uploadDocumentoRequestSchema>
export type UploadDocumentoResponse = z.infer<typeof uploadDocumentoResponseSchema>

/** Contratto diretto del core, indipendente dal trasporto IPC. */
export interface BackendCoreContract {
  echo(request: BackendEchoRequest): Promise<BackendEchoResponse>
  chat(request: ChatRequest): Promise<ChatResponse>
  retrieval(request: RetrievalRequest): Promise<RetrievalResponse>
  ricerca(request: RicercaRequest): Promise<RicercaResponse>
  uploadDocumento(request: UploadDocumentoRequest): Promise<UploadDocumentoResponse>
}
