import React, { useState, useEffect } from 'react';
import DutchingInput from './DutchingInput';
import DutchingResults from './DutchingResults';

const DutchingCalculator = () => {
  // --- STATE ---
  const [totalStake, setTotalStake] = useState(100);
  
  // We initialize with two empty outcome rows
  const [outcomes, setOutcomes] = useState([
    { id: 1, odds: '' },
    { id: 2, odds: '' },
  ]);

  // Derived state for the rows (merging input odds with calculated stakes)
  const [calculatedRows, setCalculatedRows] = useState([]);
  
  // Derived state for the final summary numbers
  const [summary, setSummary] = useState({
    totalReturn: 0,
    totalProfit: 0,
  });

  // --- ACTIONS ---
  const addOutcome = () => {
    const newId = outcomes.length > 0 ? Math.max(...outcomes.map(o => o.id)) + 1 : 1;
    setOutcomes([...outcomes, { id: newId, odds: '' }]);
  };

  const removeOutcome = (id) => {
    if (outcomes.length <= 1) return; 
    setOutcomes(outcomes.filter((item) => item.id !== id));
  };

  const handleOddsChange = (id, value) => {
    const newOutcomes = outcomes.map((item) => {
      if (item.id === id) return { ...item, odds: value };
      return item;
    });
    setOutcomes(newOutcomes);
  };

  // --- CALCULATION EFFECT ---
  useEffect(() => {
    // 1. Filter valid odds to avoid math errors
    const validOutcomes = outcomes.map(o => ({
      ...o,
      numericOdds: parseFloat(o.odds)
    })).filter(o => !isNaN(o.numericOdds) && o.numericOdds > 0);

    // If no valid data, reset everything
    if (validOutcomes.length === 0) {
      setCalculatedRows(outcomes.map(o => ({ ...o, stake: 0, return: 0 })));
      setSummary({ totalReturn: 0, totalProfit: -totalStake });
      return;
    }

    // 2. Sum of implied probabilities (1/odds)
    const sumImpliedProb = validOutcomes.reduce((acc, curr) => acc + (1 / curr.numericOdds), 0);

    // 3. Calculate stake for each row
    const calculated = outcomes.map((outcome) => {
      const odds = parseFloat(outcome.odds);
      // If odds are invalid, stake is 0
      if (!odds || odds <= 0) return { ...outcome, stake: 0, return: 0 };

      const impliedProb = 1 / odds;
      const stake = (impliedProb / sumImpliedProb) * totalStake;
      const potentialReturn = stake * odds;
      
      return {
        ...outcome,
        stake: stake,
        return: potentialReturn
      };
    });

    setCalculatedRows(calculated);

    // 4. Calculate Totals (Grab the return from the first valid row since they are equalized)
    const firstValid = calculated.find(r => r.stake > 0);
    const projectedReturn = firstValid ? firstValid.return : 0;

    setSummary({
      totalReturn: projectedReturn,
      totalProfit: projectedReturn - totalStake
    });

  }, [totalStake, outcomes]);

  return (
    <div className="dutching-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Dutching Calculator</h1>
      
      {/* Input Section: Handles inputs AND displays row-level results */}
      <DutchingInput 
        totalStake={totalStake}
        setTotalStake={setTotalStake}
        rows={calculatedRows}
        onAdd={addOutcome}
        onRemove={removeOutcome}
        onOddsChange={handleOddsChange}
      />

      {/* Results Section: Handles the high-level summary */}
      <DutchingResults 
        totalStake={totalStake}
        totalReturn={summary.totalReturn}
        totalProfit={summary.totalProfit}
      />
    </div>
  );
};

export default DutchingCalculator;