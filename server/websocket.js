// import { WebSocketServer } from 'ws';

// export const setupWebSocket = (server) => {
//   const wss = new WebSocketServer({ server });

//   wss.on('connection', (ws) => {
//     console.log('Client connected');

//     // Send initial welcome message
//     ws.send(JSON.stringify({
//       type: 'info',
//       message: 'Connected to CryptoMarket WebSocket server'
//     }));

//     // Mock ticker data
//     startSendingTickerData(ws);

//     ws.on('message', (message) => {
//       try {
//         const data = JSON.parse(message);
        
//         // Handle subscribe/unsubscribe messages
//         if (data.type === 'subscribe') {
//           console.log(`Client subscribed to: ${data.topic}`);
//           // In a real app, we would store the subscription
//         } else if (data.type === 'unsubscribe') {
//           console.log(`Client unsubscribed from: ${data.topic}`);
//           // In a real app, we would remove the subscription
//         }
//       } catch (error) {
//         console.error('Error processing message:', error);
//       }
//     });

//     ws.on('close', () => {
//       console.log('Client disconnected');
//     });
//   });

//   return wss;
// };

// // Mock function to simulate ticker data
// const startSendingTickerData = (ws) => {
//   // Sample currency pairs
//   const pairs = [
//     'BTC-USDT', 'ETH-USDT', 'BNB-USDT', 'SOL-USDT', 'ADA-USDT',
//     'XRP-USDT', 'DOT-USDT', 'DOGE-USDT', 'AVAX-USDT', 'LINK-USDT',
//     'MATIC-USDT', 'UNI-USDT'
//   ];

//   // Initial prices
//   const prices = {
//     'BTC-USDT': 60123.45,
//     'ETH-USDT': 3045.67,
//     'BNB-USDT': 452.89,
//     'SOL-USDT': 102.34,
//     'ADA-USDT': 0.58,
//     'XRP-USDT': 0.63,
//     'DOT-USDT': 6.78,
//     'DOGE-USDT': 0.12,
//     'AVAX-USDT': 34.56,
//     'LINK-USDT': 13.45,
//     'MATIC-USDT': 0.89,
//     'UNI-USDT': 7.82,
//   };

//   // Send ticker updates every 3 seconds
//   const interval = setInterval(() => {
//     if (ws.readyState !== ws.OPEN) {
//       clearInterval(interval);
//       return;
//     }

//     // Update 1-3 random pairs
//     const updateCount = Math.floor(Math.random() * 3) + 1;
    
//     for (let i = 0; i < updateCount; i++) {
//       const pairIndex = Math.floor(Math.random() * pairs.length);
//       const pair = pairs[pairIndex];
      
//       // Create price movement (-0.5% to +0.5%)
//       const priceChange = prices[pair] * (Math.random() * 0.01 - 0.005);
//       prices[pair] += priceChange;
      
//       // Calculate 24h change (-5% to +5%)
//       const change24h = (Math.random() * 10 - 5).toFixed(2);
      
//       // Send ticker update
//       ws.send(JSON.stringify({
//         type: 'message',
//         topic: '/market/ticker',
//         subject: 'ticker',
//         data: {
//           symbol: pair,
//           price: prices[pair].toFixed(8),
//           changeRate: (change24h / 100).toString(),
//           time: Date.now()
//         }
//       }));
//     }
//   }, 3000);

//   ws.on('close', () => {
//     clearInterval(interval);
//   });
// };
