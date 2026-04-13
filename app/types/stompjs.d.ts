declare module '@stomp/stompjs' {
  export interface SocketLike {
    close(): void;
    send?(data: string | ArrayBuffer | Blob): void;
  }

  export interface Frame {
    command?: string;
    headers?: Record<string, string>;
    body?: string;
  }

  export interface ClientConfig {
    webSocketFactory?: () => SocketLike;
    reconnectDelay?: number;
    onConnect?: (frame: Frame) => void;
    onDisconnect?: (frame: Frame) => void;
  }

  export class Client {
    constructor(config?: ClientConfig);
    activate(): void;
    deactivate(): void;
    onConnect?: (frame: Frame) => void;
    onDisconnect?: (frame: Frame) => void;
    subscribe(destination: string, callback: (message: { body: string }) => void): void;
    publish(options: { destination: string; body: string }): void;
  }
}