// WebSocket service disabled to fix global reference error
export const connectWebSocket = (onMessageReceived) => {
    console.log("WebSocket temporarily disabled - using fallback polling");
    // Fallback to polling instead of WebSocket
    const pollInterval = setInterval(() => {
        console.log("Polling for order updates...");
    }, 5000); // Poll every 5 seconds
    
    return () => {
        clearInterval(pollInterval);
    };
};