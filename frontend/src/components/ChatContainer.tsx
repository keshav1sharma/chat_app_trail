import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessageLoading, selectedUser } =
    useChatStore() as any;
  const { authUser } = useAuthStore() as any;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-200/50">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message: any) => {
          if (!message?.senderId || !authUser?._id) return null;

          const isOwnMessage =
            String(message.senderId._id) === String(authUser._id);
          const senderDetails = message.senderId;

          return (
            <div
              key={message._id}
              className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 h-10 rounded-full ring-1 ring-base-content/10">
                  <img
                    src={senderDetails.profilePic || "/avatar.png"}
                    alt="avatar"
                    className="rounded-full"
                  />
                </div>
              </div>

              <div className={`chat-header opacity-50 text-xs mb-1`}>
                {isOwnMessage ? "You" : senderDetails.fullName}{" "}
                <time>{formatMessageTime(message.createdAt)}</time>
              </div>

              <div className="chat-bubble-container flex flex-col gap-2">
                {message.text && (
                  <div
                    className={`chat-bubble ${
                      isOwnMessage ? "chat-bubble-primary" : ""
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {message.image && (
                  <div
                    className={`chat-bubble p-2 ${
                      isOwnMessage ? "chat-bubble-primary" : ""
                    }`}
                  >
                    <img
                      src={message.image}
                      alt="attachment"
                      className="max-w-[200px] rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
