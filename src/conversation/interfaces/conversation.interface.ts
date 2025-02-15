export interface ConversationInterface{
    id: number,
    sender: string,
    updatedAt: Date | null,
    unreadMessageCount?: number | null,
}