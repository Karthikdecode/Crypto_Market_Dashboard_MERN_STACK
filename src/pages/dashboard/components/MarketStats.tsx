


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FolderSearch, AlertCircle } from 'lucide-react';

// const MarketStats = () => {
//   const [markets, setMarkets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//   const fetchMarkets = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/markets/markets');
//       setMarkets(response.data.data);
//     } catch (err) {
//       setError('Failed to fetch market data.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchMarkets();
// }, []);


//   if (loading) {
//     return <p className="text-gray-600">Loading market stats...</p>;
//   }

//   if (error) {
//     return (
//       <div className="text-red-600 flex items-center gap-2">
//         <AlertCircle className="w-5 h-5" /> {error}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//       {markets.map((market, index) => (
//         <div
//           key={index}
//           className="bg-white dark:bg-dark-300 p-4 rounded-lg shadow flex items-center justify-between"
//         >
//           <div>
//             <p className="text-sm text-gray-500 dark:text-gray-400">Market Category</p>
//             <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
//               {market}
//             </p>
//           </div>
//           <div className="p-3 rounded-full bg-gray-100 dark:bg-dark-200">
//             <FolderSearch className="h-6 w-6 text-primary-500" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MarketStats;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const MarketStats = () => {
//   const [trending, setTrending] = useState([]);
//   const [gainers, setGainers] = useState([]);
//   const [losers, setLosers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMarketData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/v1/market/trending?t=${Date.now()}`);
//         const data = response.data;

//         // Ensure the data structure is valid
//         setTrending((data.trending || []).slice(0, 3));
//         setGainers((data.gainers || []).slice(0, 3));
//         setLosers((data.losers || []).slice(0, 3));
//       } catch (error) {
//         console.error('Error fetching trending data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMarketData();
//   }, []);

//   const renderCard = (title, data, onMore, color) => (
//     <div className="bg-white p-4 rounded-lg shadow w-full">
//       <div className="flex justify-between items-center mb-3">
//         <h3 className="font-semibold text-gray-800">{title}</h3>
//         <button onClick={onMore} className="text-sm text-blue-500 hover:underline">
//           More →
//         </button>
//       </div>
//       <ul className="space-y-2">
//         {data.map((item, idx) => {
//           const last = parseFloat(item.last);
//           const changeRate = parseFloat(item.changeRate);

//           const formattedPrice = !isNaN(last) ? `$${last.toFixed(4)}` : '$0.0000';
//           const formattedChange = !isNaN(changeRate) ? `${(changeRate * 100).toFixed(2)}%` : '0.00%';
//           const changeColor = !isNaN(changeRate) && changeRate > 0 ? 'text-green-600' : 'text-red-600';

//           return (
//             <li key={idx} className="flex justify-between items-center text-sm">
//               <div className="flex items-center gap-2">
//                 <span className="font-medium">{item.symbol || 'N/A'}</span>
//                 <span className="text-gray-500">{formattedPrice}</span>
//               </div>
//               <span className={`font-medium ${changeColor}`}>
//                 {formattedChange}
//               </span>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );

//   if (loading) return <p className="text-gray-500">Loading market data...</p>;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//       {renderCard('🔥 Trending', trending, () => navigate('/trending'), 'red')}
//       {renderCard('📈 Top Gainers', gainers, () => navigate('/gainers'), 'green')}
//       {renderCard('📉 Top Losers', losers, () => navigate('/toplosers'), 'red')}
//     </div>
//   );
// };

// export default MarketStats;

//working code
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MarketStats = () => {
  const [trending, setTrending] = useState([]);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const [trendingRes, gainersRes, losersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/market/trending?t=${Date.now()}`),
          axios.get(`http://localhost:5000/api/v1/market/top-gainers?t=${Date.now()}`),
          axios.get(`http://localhost:5000/api/v1/market/top-losers?t=${Date.now()}`)
        ]);

         console.log("Trending:", trendingRes.data);
      console.log("Gainers:", gainersRes.data);
      console.log("Losers:", losersRes.data);

        // Defensive check + slice
        setTrending((trendingRes.data?.trending || []).slice(0, 3));
setGainers((gainersRes.data?.topGainers || []).slice(0, 3));
setLosers((losersRes.data?.topLosers || []).slice(0, 3));
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const renderCard = (title, data, onMore, color) => (
    <div className="bg-white p-4 rounded-lg shadow w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <button onClick={onMore} className="text-sm text-blue-500 hover:underline">
          More →
        </button>
      </div>
      <ul className="space-y-2">
        {data.map((item, idx) => {
          const last = parseFloat(item.last);
          const changeRate = parseFloat(item.changeRate);

          const formattedPrice = !isNaN(last) ? `$${last.toFixed(4)}` : '$0.0000';
          const formattedChange = !isNaN(changeRate) ? `${(changeRate * 100).toFixed(2)}%` : '0.00%';
          const changeColor = !isNaN(changeRate) && changeRate > 0 ? 'text-green-600' : 'text-red-600';

          return (
            <li key={idx} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.symbol || 'N/A'}</span>
                <span className="text-gray-500">{formattedPrice}</span>
              </div>
              <span className={`font-medium ${changeColor}`}>
                {formattedChange}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  if (loading) return <p className="text-gray-500">Loading market data...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {renderCard('🔥 Trending', trending, () => navigate('/trending'), 'red')}
      {renderCard('📈 Top Gainers', gainers, () => navigate('/gainers'), 'green')}
      {renderCard('📉 Top Losers', losers, () => navigate('/toplosers'), 'red')}
    </div>
  );
};

export default MarketStats;


