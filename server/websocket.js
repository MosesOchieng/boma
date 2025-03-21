const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        ws.isAlive = true;

        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                if (data.type === 'auth') {
                    // Verify council member token
                    const token = data.token;
                    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                        if (err) {
                            ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
                            ws.terminate();
                        } else {
                            ws.councilMemberId = decoded.id;
                        }
                    });
                }
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        });
    });

    // Broadcast updates to all connected council members
    wss.broadcast = function(data) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    };

    return wss;
}

module.exports = setupWebSocket; 