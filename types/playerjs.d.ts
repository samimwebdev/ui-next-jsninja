declare module 'player.js' {
  export type PlayerEvent =
    | 'ready'
    | 'play'
    | 'pause'
    | 'ended'
    | 'timeupdate'
    | 'seeked'
    | 'volumechange'
    | 'error'

  export interface TimeUpdateData {
    seconds: number
    duration: number
  }

  export interface ErrorData {
    message?: string
    code?: number
  }

  export class Player {
    constructor(element: HTMLIFrameElement)

    // Event listeners
    on(event: 'error', callback: (data?: ErrorData) => void): void
    on(event: 'timeupdate', callback: (data?: TimeUpdateData) => void): void
    on(
      event: Exclude<PlayerEvent, 'error' | 'timeupdate'>,
      callback: () => void
    ): void
    off(event: PlayerEvent): void

    // Getters
    getDuration(callback: (duration: number) => void): void
    getCurrentTime(callback: (time: number) => void): void
    getPaused(callback: (paused: boolean) => void): void
    getVolume(callback: (volume: number) => void): void
    setCurrentTime(seconds: number, callback: (error?: ErrorData) => void): void

    // Setters
    play(): void
    pause(): void
    seek(seconds: number): void
    setVolume(volume: number): void
  }
}
