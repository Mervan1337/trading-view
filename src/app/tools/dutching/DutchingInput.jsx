import React from 'react';
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

  // --- STYLES ---
  
  // Style for the labels
  const labelStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '5px',
    fontWeight: 'bold', 
    marginBottom: '8px',
    color: '#e5e7eb' // Light gray text for readability on dark
  };

  // Style for the Input Fields (Dark Mode)
  const inputStyle = {
    padding: '10px',
    width: '100%',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #4b5563', // Dark border
    background: '#374151',        // Dark Gray background
    color: '#ffffff'              // White text
  };

  // Style for the Read-Only result boxes
  const readOnlyStyle = {
    padding: '10px',
    borderRadius: '6px',
    background: '#1f2937',        // Very dark gray (almost black)
    color: '#ffffff',             // White text
    border: '1px solid #374151',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div className="dutching-input">
      
      {/* --- Global Stake Input --- */}
      <div style={{ marginBottom: '25px', padding: '15px', background: '#262626', borderRadius: '8px', border: '1px solid #404040' }}>
        <div style={labelStyle}>
          Total Stake to Invest ($)
          <Tooltip text="The total budget you want to split across all your different bets." />
        </div>
        <div style={{ maxWidth: '200px' }}>
            <input
            type="number"
            value={totalStake}
            onChange={(e) => setTotalStake(parseFloat(e.target.value) || 0)}
            style={inputStyle}
            />
        </div>
      </div>

      {/* --- The Betting Table --- */}
      <div style={{ marginBottom: '20px' }}>
        
        {/* Table Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', paddingBottom: '10px', borderBottom: '1px solid #404040', marginBottom: '15px' }}>
          <div style={labelStyle}>
            Decimal Odds
            <Tooltip text="Enter the decimal odds (e.g., 2.50)." />
          </div>
          <div style={labelStyle}>
            Calculated Stake
            <Tooltip text="Amount to bet on this selection." />
          </div>
          <div style={labelStyle}>
            Potential Return
            <Tooltip text="Payout if this selection wins." />
          </div>
          <div></div> 
        </div>

        {/* Rows */}
        {rows.map((row) => (
          <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'center', marginBottom: '12px' }}>
            
            {/* 1. Odds Input */}
            <input
              type="number"
              placeholder="e.g. 2.00"
              value={row.odds}
              onChange={(e) => onOddsChange(row.id, e.target.value)}
              style={inputStyle}
            />

            {/* 2. Calculated Stake (Read Only) */}
            <div style={readOnlyStyle}>
              {row.stake ? formatCurrency(row.stake) : '-'}
            </div>

            {/* 3. Row Return (Read Only) */}
            <div style={readOnlyStyle}>
              {row.return ? formatCurrency(row.return) : '-'}
            </div>

            {/* 4. Remove Button */}
            <button 
              onClick={() => onRemove(row.id)}
              style={{ 
                background: '#ef4444', 
                color: 'white', 
                border: 'none', 
                padding: '0 15px', 
                height: '42px', // Match input height
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '16px'
            }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={onAdd}
        style={{ 
            background: '#3b82f6', // Bright Blue
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontSize: '14px',
            fontWeight: '600'
        }}
      >
        + Add Selection
      </button>
    </div>
  );
};

export default DutchingInput;