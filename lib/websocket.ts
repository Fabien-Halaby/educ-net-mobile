import { Message } from "./types";

interface WebSocketMessage {
  type: string;
  content: Message;
}

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private messageCallbacks: ((msg: Message) => void)[] = [];
  private errorCallbacks: ((error: string) => void)[] = [];
  private connectCallbacks: (() => void)[] = [];

connect(classId: number, token: string) {
  const url = `ws://192.168.201.145:8080/api/ws/chat/${classId}?token=${token}`;
  this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log(`WebSocket connected - Classe ${classId}`);
      this.connectCallbacks.forEach(cb => cb());
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        if (data.type === 'message') {
          this.messageCallbacks.forEach(cb => cb(data.content));
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.errorCallbacks.forEach(cb => cb('Connection error'));
    };
  }

  // send(content: string) {
  //   if (this.ws?.readyState === WebSocket.OPEN) {
  //     this.ws.send(JSON.stringify({ content }));
  //   }
  // }
  send(content: string) {
  if (this.ws?.readyState === WebSocket.OPEN) {
    this.ws.send(JSON.stringify({ 
      type: "message", 
      content 
    }));
  }
}

  onMessage(callback: (msg: Message) => void) {
    this.messageCallbacks.push(callback);
  }

  onConnect(callback: () => void) {
    this.connectCallbacks.push(callback);
  }

  onError(callback: (error: string) => void) {
    this.errorCallbacks.push(callback);
  }

  disconnect() {
    this.ws?.close();
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const chatWS = new ChatWebSocket();
