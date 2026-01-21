import React from 'react';
// Make sure you import your Tooltip component here
import Tooltip from "@/app/components/ui/Tooltip"

const DutchingInput = ({ 
  totalStake, 
  setTotalStake, 
  rows, 
  onAdd, 
  onRemove, 
  onOddsChange 
}) => {
  
  const formatCurrency = (num) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  // Helper style for aligning text with the tooltip
  const labelStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '5px', // Space between text and tooltip
    fontWeight: 'bold', 
    marginBottom: '5px' 
  };

  return (
    <div className="dutching-input">
      {/* Global Stake Input */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={labelStyle}>
          Total Stake to Invest ($)
          <Tooltip text="The total budget you want to split across all your different bets." />
        </div>
        <input
          type="number"
          value={totalStake}
          onChange={(e) => setTotalStake(parseFloat(e.target.value) || 0)}
          style={{ padding: '10px', width: '100%', maxWidth: '200px', fontSize: '16px' }}
        />
      </div>

      {/* The Betting Table */}
      <div style={{ marginBottom: '20px' }}>
        {/* Table Headers with Tooltips */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
          
          <div style={labelStyle}>
            Decimal Odds
            <Tooltip text="Enter the decimal odds for this selection (e.g., 2.50 or 3.00)." />
          </div>
          
          <div style={labelStyle}>
            Calculated Stake
            <Tooltip text="The exact amount you need to bet on this selection to equal profit." />
          </div>
          
          <div style={labelStyle}>
            Potential Return
            <Tooltip text="The total payout if this specific selection wins. In Dutching, this should be the same for all rows." />
          </div>
          
          <div></div> {/* Empty column for delete button */}
        </div>

        {/* Rows */}
        {rows.map((row) => (
          <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
            {/* 1. Odds Input */}
            <input
              type="number"
              placeholder="e.g. 2.00"
              value={row.odds}
              onChange={(e) => onOddsChange(row.id, e.target.value)}
              style={{ padding: '8px', fontSize: '15px' }}
            />

            {/* 2. Calculated Stake (Read Only) */}
            <div style={{ background: '#eef', padding: '8px', borderRadius: '4px' }}>
              {row.stake ? formatCurrency(row.stake) : '-'}
            </div>

            {/* 3. Row Return (Read Only) */}
            <div style={{ background: '#eef', padding: '8px', borderRadius: '4px' }}>
              {row.return ? formatCurrency(row.return) : '-'}
            </div>

            {/* 4. Remove Button */}
            <button 
              onClick={() => onRemove(row.id)}
              style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={onAdd}
        style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
      >
        + Add Selection
      </button>
    </div>
  );
};

export default DutchingInput;