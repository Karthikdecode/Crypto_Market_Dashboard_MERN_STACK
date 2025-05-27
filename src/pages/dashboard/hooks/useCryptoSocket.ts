import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

interface PriceData {
  [symbol: string]: {
    price: number;
    change?: number;
    lastUpdate: number;
  };
}

export const useCryptoSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [prices, setPrices] = useState<PriceData>({});
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.example.com/ws'; // Replace with actual WebSocket URL
    
    // For demo purposes, we're not actually connecting to a WebSocket
    // In a real application, you'd connect to the actual KuCoin socket API
    
    // Mock WebSocket connection
    setTimeout(() => {
      setIsConnected(true);
      
      // Simulate receiving price updates
      const mockPriceUpdate = setInterval(() => {
        setPrices(prev => {
          const symbols = [
            'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 
            'XRPUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'LINKUSDT',
            'MATICUSDT', 'UNIUSDT'
          ];
          
          const updates: PriceData = { ...prev };
          
          // Update 1-3 random symbols
          const updateCount = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < updateCount; i++) {
            const symbolIndex = Math.floor(Math.random() * symbols.length);
            const symbol = symbols[symbolIndex];
            
            const currentPrice = prev[symbol]?.price || getInitialPrice(symbol);
            const priceChange = currentPrice * (Math.random() * 0.002 - 0.001); // -0.1% to +0.1%
            const newPrice = currentPrice + priceChange;
            
            updates[symbol] = {
              price: newPrice,
              change: prev[symbol]?.change || getRandomChange(),
              lastUpdate: Date.now()
            };
          }
          
          return updates;
        });
      }, 3000);
      
      // Cleanup
      return () => {
        clearInterval(mockPriceUpdate);
        setIsConnected(false);
      };
    }, 1500);
    
    // Initialize with mock data
    setPrices({
      'BTCUSDT': { price: 60123.45, change: 2.5, lastUpdate: Date.now() },
      'ETHUSDT': { price: 3045.67, change: 1.8, lastUpdate: Date.now() },
      'BNBUSDT': { price: 452.89, change: -0.7, lastUpdate: Date.now() },
      'SOLUSDT': { price: 102.34, change: 3.2, lastUpdate: Date.now() },
      'ADAUSDT': { price: 0.58, change: -1.2, lastUpdate: Date.now() },
      'XRPUSDT': { price: 0.63, change: 0.5, lastUpdate: Date.now() },
      'DOTUSDT': { price: 6.78, change: -2.1, lastUpdate: Date.now() },
      'DOGEUSDT': { price: 0.12, change: 5.6, lastUpdate: Date.now() },
      'AVAXUSDT': { price: 34.56, change: 2.8, lastUpdate: Date.now() },
      'LINKUSDT': { price: 13.45, change: 1.1, lastUpdate: Date.now() },
      'MATICUSDT': { price: 0.89, change: -0.9, lastUpdate: Date.now() },
      'UNIUSDT': { price: 7.82, change: 0.3, lastUpdate: Date.now() },
    });
    
    // In a real app, this would be actual WebSocket connection code:
    /*
    socketRef.current = new WebSocket(wsUrl);
    
    socketRef.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
      
      // Subscribe to ticker channel
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'subscribe',
          topic: '/market/ticker:all',
          privateChannel: false,
          response: true
        }));
      }
    };
    
    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message' && data.subject === 'ticker') {
          const { symbol, price, changeRate } = data.data;
          
          setPrices(prev => ({
            ...prev,
            [symbol]: {
              price: parseFloat(price),
              change: parseFloat(changeRate) * 100,
              lastUpdate: Date.now()
            }
          }));
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    socketRef.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      
      // Attempt to reconnect
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connect();
      }, 5000);
    };
    
    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection to market data failed. Retrying...');
    };
    */
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      /*
      if (socketRef.current) {
        socketRef.current.close();
      }
      */
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    
    return () => {
      cleanup();
    };
  }, [connect]);

  return { isConnected, prices };
};

// Helper functions for mock data
const getInitialPrice = (symbol: string) => {
  const prices: Record<string, number> = {
    'BTCUSDT': 60123.45,
    'ETHUSDT': 3045.67,
    'BNBUSDT': 452.89,
    'SOLUSDT': 102.34,
    'ADAUSDT': 0.58,
    'XRPUSDT': 0.63,
    'DOTUSDT': 6.78,
    'DOGEUSDT': 0.12,
    'AVAXUSDT': 34.56,
    'LINKUSDT': 13.45,
    'MATICUSDT': 0.89,
    'UNIUSDT': 7.82,
  };
  
  return prices[symbol] || 100;
};

const getRandomChange = () => {
  return (Math.random() * 10 - 5).toFixed(2);
};