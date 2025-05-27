import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import cors from 'cors';
import axios from 'axios';

const router = express.Router();

// Get all currencies
router.get('/currencies', async (req, res) => {
  try {
    const response = await axios.get('https://api.kucoin.com/api/v1/currencies');
    const currencyList = response.data.data;

    const filteredData = currencyList.map(currency => ({
      symbol: currency.name, // example: BTC
      name: currency.fullName || currency.name, // example: Bitcoin
      price: parseFloat((Math.random() * 1000).toFixed(2)), // dummy price
      change24h: parseFloat((Math.random() * 10 - 5).toFixed(2)), // dummy +/- 5%
      volume24h: Math.floor(Math.random() * 1_000_000),
      marketCap: Math.floor(Math.random() * 1_000_000_000),
      isFavorite: false
    }));

    res.status(200).json({ currencies: filteredData });
  } catch (error) {
    console.error('Failed to fetch from KuCoin API:', error.message);
    res.status(500).json({ error: 'Failed to fetch currency data' });
  }
});

router.get('/announcements', async (req, res) => {
  try {
    const response = await axios.get('https://api.kucoin.com/api/v3/announcements');
    const announcements = response.data.data.items || [];

    res.json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error.message);
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
});

router.get('/allTickers', async (req, res) => {
  try {
    const response = await axios.get('https://api.kucoin.com/api/v1/market/allTickers');
    const tickers = response.data.data.ticker || [];

    // Map and format data
    const formatted = tickers.map(item => ({
      symbol: item.symbol,
      name: item.symbolName || item.symbol,
      price: parseFloat(item.last),
      change24h: parseFloat(item.changeRate) * 100,
      volume24h: parseFloat(item.volValue),
      // marketCap: 0, // KuCoin does not return this
      isFavorite: false,
    }));

    res.json({ currencies: formatted });
  } catch (error) {
    console.error('Error fetching all tickers:', error.message);
    res.status(500).json({ message: 'Failed to fetch ticker data' });
  }
});


router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get('https://api.kucoin.com/api/v1/market/allTickers');
    const tickers = response.data?.data?.ticker;

    if (!tickers || !Array.isArray(tickers)) {
      return res.status(500).json({ error: 'Invalid data format from KuCoin' });
    }

    const trending = tickers
      .filter(ticker => ticker.symbol.endsWith('-USDT')) // Filter USDT pairs
      .map(ticker => ({
        symbol: ticker.symbol,
        price: parseFloat(ticker.last),
        change24h: parseFloat(ticker.changeRate) * 100,
        volume24h: parseFloat(ticker.volValue),
      }))
      .sort((a, b) => b.volume24h - a.volume24h) // Sort by volume descending
      .slice(0, 10); // Top 10

    res.json({ trending });
  } catch (error) {
    console.error('Error fetching trending data:', error);
    res.status(500).json({ error: 'Failed to fetch trending data' });
  }
});

// routes/marketRoutes.ts

router.get('/top-gainers', async (req, res) => {
  try {
    const response = await axios.get('https://api.kucoin.com/api/v1/market/allTickers');
    const tickers = response.data?.data?.ticker;

    if (!tickers || !Array.isArray(tickers)) {
      return res.status(500).json({ error: 'Invalid data format from KuCoin' });
    }

    const gainers = tickers
      .filter(t => t.symbol.endsWith('-USDT'))
      .map(t => ({
        symbol: t.symbol,
        price: parseFloat(t.last),
        change24h: parseFloat(t.changeRate) * 100,
        volume24h: parseFloat(t.volValue),
      }))
      .sort((a, b) => b.change24h - a.change24h) // Highest gainers
      .slice(0, 10); // Top 10

    res.json({ topGainers: gainers });
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    res.status(500).json({ error: 'Failed to fetch top gainers' });
  }
});

router.get('/top-losers', async (req, res) => {
  try {
    const response = await axios.get('https://api.kucoin.com/api/v1/market/allTickers');
    const tickers = response.data?.data?.ticker;

    if (!tickers || !Array.isArray(tickers)) {
      return res.status(500).json({ error: 'Invalid data format from KuCoin' });
    }

    const losers = tickers
      .filter(t => t.symbol.endsWith('-USDT'))
      .map(t => ({
        symbol: t.symbol,
        price: parseFloat(t.last),
        change24h: parseFloat(t.changeRate) * 100,
        volume24h: parseFloat(t.volValue),
      }))
      .sort((a, b) => a.change24h - b.change24h) // Most negative change first
      .slice(0, 10); // Top 10 losers

    res.json({ topLosers: losers });
  } catch (error) {
    console.error('Error fetching top losers:', error);
    res.status(500).json({ error: 'Failed to fetch top losers' });
  }
});


//get spot 
router.get('/api/v1/market', async (req, res) => {
  try {
    const response = await axios.get('https://api.kucoin.com/api/v1/market/allTickers');
    const data = response.data.data.ticker;

    const filtered = data.filter(item =>
      !item.symbol.includes('SWAP') &&
      !item.symbol.includes('M') &&
      item.symbol.includes('-')
    );

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching spot data:', error);
    res.status(500).json({ error: 'Failed to fetch spot data' });
  }
});


// Get market statistics
router.get('/stats', async (req, res, next) => {
  try {
    // In a real app, this would fetch data from the KuCoin API or your database
    const stats = {
      btcDominance: '51.2%',
      ethDominance: '18.7%',
      totalMarketCap: '$2.3T',
      tradingVolume24h: '$87.6B'
    };
    
    res.status(200).json({ stats });
  } catch (error) {
    next(error);
  }
});

router.get('/markets', async (req, res) => {
  try {
    const response = await axios.get('https://api.kucoin.com/api/v1/markets');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching KuCoin markets:', error.message);
    console.error('Axios error details:', error.response?.data);
    res.status(500).json({ error: 'Failed to fetch markets from KuCoin' });
  }
});



// Add to favorites (authenticated)
router.post('/favorites', authenticateToken, async (req, res, next) => {
  try {
    const { symbol } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.addToFavorites(symbol);
    
    res.status(200).json({ 
      message: `${symbol} added to favorites`,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
});

// Remove from favorites (authenticated)
router.delete('/favorites/:symbol', authenticateToken, async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.removeFromFavorites(symbol);
    
    res.status(200).json({ 
      message: `${symbol} removed from favorites`,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
});

// Get user favorites (authenticated)
router.get('/favorites', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    next(error);
  }
});

export default router;