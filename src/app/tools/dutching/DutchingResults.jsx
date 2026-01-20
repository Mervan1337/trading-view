import React from 'react';

const DutchingResults = ({ totalStake, totalReturn, totalProfit }) => {
  
  const formatCurrency = (num) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  const isProfitable = totalProfit >= 0;

  return (
    <div className="dutching-results" style={{ marginTop: '30px', padding: '20px', background: '#333', color: 'white', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #555', paddingBottom: '10px' }}>
        Result Summary
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginTop: '15px' }}>
        
        {/* Metric 1: Total Stake */}
        <div>
          <div style={{ fontSize: '0.9em', color: '#ccc' }}>Total Wagered</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{formatCurrency(totalStake)}</div>
        </div>

        {/* Metric 2: Total Return */}
        <div>
          <div style={{ fontSize: '0.9em', color: '#ccc' }}>Total Return</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{formatCurrency(totalReturn)}</div>
        </div>

        {/* Metric 3: Profit */}
        <div>
          <div style={{ fontSize: '0.9em', color: '#ccc' }}>Net Profit</div>
          <div style={{ 
            fontSize: '1.5em', 
            fontWeight: 'bold', 
            color: isProfitable ? '#4ade80' : '#ff6b6b' 
          }}>
            {formatCurrency(totalProfit)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DutchingResults;