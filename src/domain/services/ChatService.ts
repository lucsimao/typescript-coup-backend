export interface ChatService {
  listenToChat<T>(callback: (response: T) => Promise<void>): Promise<void>;
  updateChat<T>(chat: T): Promise<void>;
}
