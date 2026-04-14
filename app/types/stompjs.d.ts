declare module '@stomp/stompjs' {
  export class Client {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(config?: any);
    activate(): void;
    deactivate(): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onConnect?: (frame: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDisconnect?: (frame: any) => void;
    subscribe(destination: string, callback: (message: { body: string }) => void): void;
    publish(options: { destination: string; body: string }): void;
  }
}
