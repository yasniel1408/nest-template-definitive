export interface EventPayload {
  id: string;
  data: any;
  timestamp: number;
  retryCount?: number;
}

export interface EventAck {
  id: string;
  success: boolean;
  error?: string;
  timestamp: number;
}

export enum EventStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}
