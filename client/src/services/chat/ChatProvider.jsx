import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import PropTypes from "prop-types";
import CustomLoader from "@/components/customLoader/CustomLoader";

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

const ChatProvider = ({ children }) => {
  const { user, isLoading } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (isLoading || !user) return;

    const fetchToken = async () => {
      try {
        const sanitizedId = user.sub.replace(/[^a-z0-9@_-]/gi, "_");
        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        const url = `${apiBaseUrl}/api/v1/chat/chat-token/${sanitizedId}`;
        const response = await axios.get(url);
        const { token } = response.data;
        if (!token) throw new Error("Token is missing");
        setToken(token);
      } catch (error) {
        console.error("Error fetching chat token:", error?.response || error);
      }
    };

    fetchToken();
  }, [isLoading, user]);

  if (!token && user) return <CustomLoader />;

  return <ChatContext.Provider value={token}>{children}</ChatContext.Provider>;
};

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChatProvider;
