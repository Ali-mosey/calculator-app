import { useState } from 'react';
import './Calculator.css';

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  function calculate(a, b, operator) {
    switch (operator) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
      default: return b;
    }
  }

  function handleDigit(digit) {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }

  function handleDecimal() {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) setDisplay(display + '.');
  }

  function handleOperator(operator) {
    const current = parseFloat(display);
    if (prev !== null && !waitingForOperand) {
      const result = calculate(prev, current, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(operator);
    setWaitingForOperand(true);
  }

  function handleEquals() {
    if (op === null || prev === null) return;
    const current = parseFloat(display);
    const result = calculate(prev, current, op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setWaitingForOperand(true);
  }

  function handleClear() {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setWaitingForOperand(false);
  }

  function handleToggleSign() {
    setDisplay(String(parseFloat(display) * -1));
  }

  function handlePercent() {
    setDisplay(String(parseFloat(display) / 100));
  }

  function handleButton(btn) {
    if ('0123456789'.includes(btn)) return handleDigit(btn);
    if (btn === '.') return handleDecimal();
    if (btn === '=') return handleEquals();
    if (btn === 'C') return handleClear();
    if (btn === '±') return handleToggleSign();
    if (btn === '%') return handlePercent();
    handleOperator(btn);
  }

  function isOperator(btn) {
    return ['÷', '×', '−', '+'].includes(btn);
  }

  return (
    <div className="calculator">
      <div className="display">
        <span className="display-text">{display}</span>
      </div>
      <div className="buttons">
        {BUTTONS.map((row, ri) => (
          <div key={ri} className="row">
            {row.map((btn) => (
              <button
                key={btn}
                className={`btn ${btn === '0' ? 'btn-zero' : ''} ${isOperator(btn) || btn === '=' ? 'btn-operator' : ''} ${btn === 'C' || btn === '±' || btn === '%' ? 'btn-function' : ''} ${op === btn ? 'btn-active' : ''}`}
                onClick={() => handleButton(btn)}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
