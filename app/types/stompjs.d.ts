declare module '@stomp/stompjs' {
  export class Client {
    constructor(config?: any);
    activate(): void;
    deactivate(): void;
    onConnect?: (frame: any) => void;
    onDisconnect?: (frame: any) => void;
    subscribe(destination: string, callback: (message: { body: string }) => void): void;
    publish(options: { destination: string; body: string }): void;
  }
}