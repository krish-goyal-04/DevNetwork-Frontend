import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { useSelector } from "react-redux";
import { baseURL } from "../utils/constants";
import { useSocket } from "../context/SocketContext";
import { ToastNotification } from "./ToastNotification";

const Chat = () => {
  const { userId: participantId } = useParams();
  const socket = useSocket();
  const currentUser = useSelector((state) => state.user);
  // partner holds the details of the user we are chatting with
  const [partner, setPartner] = useState(null);
  // messages is the list of chat messages in this conversation
  const [messages, setMessages] = useState([]);
  // messageText is the current text in the message input box
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatError, setChatError] = useState("");
  // isJoining indicates whether we are in the process of joining the chat room
  const [isJoining, setIsJoining] = useState(false);
  const messageEndRef = useRef(null);

  // Load chat details and messages when the component mounts or participantId changes
  useEffect(() => {
    const loadChat = async () => {
      try {
        setLoading(true);
        setChatError("");

        // Fetch both participant details and chat messages in parallel
        // This optimizes loading time by not waiting for one request to finish before starting the other.
        // The participant details are needed to display the chat header and identify the chat partner.
        // The messages are needed to populate the chat history in the UI.
        const [participantRes, messageRes] = await Promise.all([
          axios.get(`${baseURL}/chat/participant/${participantId}`, {
            withCredentials: true,
          }),
          axios.get(`${baseURL}/chat/messages/${participantId}`, {
            withCredentials: true,
          }),
        ]);

        setPartner(participantRes.data.data);
        setMessages(messageRes.data.data || []);
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        setChatError(message);
        ToastNotification("Unable to load chat", message, "error");
      } finally {
        setLoading(false);
      }
    };

    if (participantId) {
      loadChat();
    }
  }, [participantId]);

  // Listen for incoming chat messages via the socket connection
  useEffect(() => {
    if (!socket || !participantId) return;

    const handleIncomingMessage = (payload) => {
      if (
        payload.fromUserId === participantId ||
        payload.toUserId === participantId
      ) {
        setMessages((prevMessages) => [...prevMessages, payload]);
      }
    };

    socket.on("chat:message", handleIncomingMessage);

    return () => {
      socket.off("chat:message", handleIncomingMessage);
    };
  }, [socket, participantId]);

  useEffect(() => {
    if (!socket || !participantId) return;

    setIsJoining(true);
    socket.emit("joinChat", { participantId }, (response) => {
      setIsJoining(false);
      if (response?.status !== "ok") {
        const message = response?.message || "Could not join chat.";
        setChatError(message);
        ToastNotification("Chat unavailable", message, "error");
      }
    });
  }, [socket, participantId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!messageText.trim()) return;
    if (!socket) {
      ToastNotification(
        "Socket not ready",
        "Please wait for the chat connection to establish.",
        "error",
      );
      return;
    }

    const trimmedMessage = messageText.trim();
    socket.emit(
      "chat:send",
      { toUserId: participantId, message: trimmedMessage },
      (response) => {
        if (response?.status === "error") {
          const errorMessage = response?.message || "Unable to send message.";
          setChatError(errorMessage);
          ToastNotification("Send failed", errorMessage, "error");
        } else {
          setMessageText("");
        }
      },
    );
  };

  const renderChatHeader = () => {
    if (!partner) return null;
    const fullName =
      `${partner.firstName || "User"} ${partner.lastName || ""}`.trim();

    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-900 rounded-3xl border border-slate-800 p-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Chat with {fullName}
          </h1>
          <p className="text-sm text-slate-400">
            Only connected users can exchange messages here.
          </p>
        </div>
        <Link
          to="/connections"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700"
        >
          Back to connections
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
            <p className="text-slate-400">Loading chat...</p>
          </div>
        ) : chatError ? (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-100">
            <p className="text-lg font-semibold">{chatError}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {renderChatHeader()}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
              <div className="h-[calc(100vh-26rem)] overflow-y-auto rounded-3xl bg-slate-950/70 p-4 shadow-inner">
                {messages.length === 0 ? (
                  <div className="py-24 text-center text-slate-500">
                    <p className="text-lg">No messages yet.</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Send the first message to start the conversation.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isFromSelf = currentUser
                        ? message.fromUserId === currentUser._id
                        : message.fromSelf === true;
                      return (
                        <div
                          key={message._id}
                          className={`flex ${
                            isFromSelf ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-3xl border px-4 py-3 text-sm shadow-sm ${
                              isFromSelf
                                ? "bg-sky-500 text-slate-950 border-sky-400"
                                : "bg-slate-800 text-slate-100 border-slate-700"
                            }`}
                          >
                            <p>{message.message}</p>
                            <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                              {isFromSelf
                                ? "You"
                                : partner?.firstName || "Connected user"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messageEndRef} />
                  </div>
                )}
              </div>
            </div>

            <form
              onSubmit={handleSendMessage}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-4"
            >
              <label className="sr-only" htmlFor="chat-input">
                Type a message
              </label>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <textarea
                  id="chat-input"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  rows={3}
                  placeholder="Write your message..."
                  className="min-h-18 resize-none rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || isJoining}
                  className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isJoining ? "Joining chat..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
