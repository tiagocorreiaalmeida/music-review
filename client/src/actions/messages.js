export const setMessages = (messages = {}) => ({
    type: "SET_MESSAGES",
    messages
});

export const setMessagesToDefault = () => ({
    type: "SET_DEFAULT"
});
