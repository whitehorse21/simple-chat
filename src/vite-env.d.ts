/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBNUB_PUBLISH_KEY: string
  readonly VITE_PUBNUB_SUBSCRIBE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
