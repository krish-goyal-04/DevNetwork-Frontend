import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { useSelector } from "react-redux";
import { baseURL } from "../utils/constants";
import { useSocket } from "../context/SocketContext";
import { ToastNotification } from "./ToastNotification";

const formatMessageTime = (dateString) => {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills
      .flatMap((skill) => skill.split(","))
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

const Chat = () => {
  const { userId: participantId } = useParams();
  const socket = useSocket();
  const currentUser = useSelector((state) => state.user);
  const presence = useSelector((state) => state.presence || {});
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
    const location =
      [partner.city, partner.state].filter(Boolean).join(", ") ||
      "Connected developer";
    const initials = `${partner.firstName?.[0] || "U"}${partner.lastName?.[0] || ""}`;
    const isOnline =
      presence[String(participantId)] ?? partner.isOnline ?? false;

    return (
      <div className="chat-header flex flex-col gap-3 border-b border-white/10 bg-slate-950/95 px-5 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/10 ring-1 ring-white/10">
            {partner.photoUrl ? (
              <img
                src={partner.photoUrl}
                alt={`${fullName} profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold">
                {initials}
              </div>
            )}
            <span
              className={`absolute -right-0.5 top-0.5 h-3 w-3 rounded-full border border-slate-950/70 ${
                isOnline
                  ? "bg-emerald-400 shadow-[0_0_0_2px_rgba(15,23,42,0.55)]"
                  : "bg-slate-500"
              }`}
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-white">
              {fullName}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-0.5">
                <span
                  className={`inline-flex h-2 w-2 rounded-full ${
                    isOnline ? "bg-emerald-400" : "bg-slate-500"
                  }`}
                />
                {isOnline ? "Online" : "Offline"}
              </span>
              <span className="truncate text-xs">{location}</span>
            </div>
          </div>
        </div>
        <Link
          to="/connections"
          className="btn-secondary flex h-9 items-center justify-center px-4 text-xs font-semibold"
        >
          Back
        </Link>
      </div>
    );
  };

  const renderPartnerPanel = () => {
    if (!partner) return null;

    const fullName =
      `${partner.firstName || "User"} ${partner.lastName || ""}`.trim();
    const location =
      [partner.city, partner.state].filter(Boolean).join(", ") ||
      "Location not specified";
    const skillItems = normalizeSkills(partner.skills);
    const profileItems = [
      partner.age ? `${partner.age} yrs` : null,
      partner.gender || null,
      partner.college || null,
    ].filter(Boolean);

    return (
      <aside className="panel hidden h-full flex flex-col p-4 lg:flex overflow-hidden">
        <p className="eyebrow text-xs">About</p>
        <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-slate-950 flex-shrink-0">
          <img
            src={
              partner.photoUrl ||
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
            }
            alt={`${fullName} profile`}
            onError={(event) => {
              event.currentTarget.src =
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80";
            }}
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
        <h2 className="mt-3 text-base font-semibold text-white truncate">
          {fullName}
        </h2>
        <p className="mt-1 text-xs text-slate-400 truncate">{location}</p>
        {profileItems.length > 0 && (
          <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3 text-xs text-slate-300 flex-shrink-0">
            {profileItems.map((item) => (
              <p key={item} className="text-slate-300">
                {item}
              </p>
            ))}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5 overflow-y-auto">
          {skillItems.length ? (
            skillItems.slice(0, 8).map((skill) => (
              <span className="chip text-xs" key={skill}>
                {skill}
              </span>
            ))
          ) : (
            <span className="chip text-xs">No skills</span>
          )}
        </div>
      </aside>
    );
  };

  return (
    <div className="app-shell flex flex-col h-screen overflow-hidden">
      {loading ? (
        <div className="panel m-4 p-10 text-center">
          <p className="text-slate-400">Loading chat...</p>
        </div>
      ) : chatError ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-8 m-4 text-center text-rose-100">
          <p className="text-lg font-semibold">{chatError}</p>
        </div>
      ) : (
        <div className="grid gap-3 flex-1 overflow-hidden lg:grid-cols-[1fr_20rem] px-3 py-3">
          <section className="panel overflow-hidden flex flex-col">
            {renderChatHeader()}
            <div className="chat-messages flex-1 overflow-hidden px-4 py-4 sm:px-5">
              {messages.length === 0 ? (
                <div className="chat-empty flex h-full items-center justify-center text-center">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      Start the conversation
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                      Messages are encrypted in transit. Share a quick intro,
                      mention your project goals, or ask about their work.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 h-full overflow-y-auto pr-2">
                  {messages.map((message) => {
                    const isFromSelf = currentUser
                      ? message.fromUserId === currentUser._id
                      : message.fromSelf === true;
                    return (
                      <div
                        key={
                          message._id ||
                          `${message.fromUserId}-${message.createdAt}`
                        }
                        className={`flex ${
                          isFromSelf ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`chat-bubble ${
                            isFromSelf
                              ? "chat-bubble-sent"
                              : "chat-bubble-received"
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-6">
                            {message.message}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                            <span className="text-xs font-semibold text-slate-300">
                              {isFromSelf
                                ? "You"
                                : partner?.firstName || "Connected user"}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatMessageTime(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-area">
              <label className="sr-only" htmlFor="chat-input">
                Type a message
              </label>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div>
                  <textarea
                    id="chat-input"
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    rows={2}
                    placeholder="Start typing..."
                    className="textarea-control mt-0 min-h-[2.5rem] max-h-20"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {messageText.trim().length} chars
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!messageText.trim() || isJoining}
                  className="btn-primary flex min-h-[2.5rem] items-center justify-center px-5 py-2"
                >
                  {isJoining ? "Joining..." : "Send"}
                </button>
              </div>
            </form>
          </section>
          {renderPartnerPanel()}
        </div>
      )}
    </div>
  );
};

export default Chat;
