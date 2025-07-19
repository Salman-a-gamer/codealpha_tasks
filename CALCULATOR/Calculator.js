document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button');
  const display = document.querySelector('.bar');
  const toggle = document.getElementById('toggle');

  let degrees = false;
  let ans = 0;

  // Factorial function
  function factorial(n) {
    n = Number(n);
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let fact = 1;
    for (let i = 2; i <= n; i++) fact *= i;
    return fact;
  }

  // Toggle Degrees / Radians
  toggle.addEventListener('change', () => {
    degrees = toggle.checked;
  });

  function evaluateExpression(exp) {
    try {
      // Replace constants with numeric values
      exp = exp.replace(/\bpi\b/gi, `(${Math.PI})`);
      exp = exp.replace(/\be\b/gi, `(${Math.E})`);
      exp = exp.replace(/\bAns\b/gi, `(${ans})`);

      // Replace math functions with Math.xxx
      exp = exp.replace(/sqrt\(/gi, 'Math.sqrt(');
      exp = exp.replace(/sin\(/gi, `Math.sin(`);
      exp = exp.replace(/cos\(/gi, `Math.cos(`);
      exp = exp.replace(/tan\(/gi, `Math.tan(`);
      exp = exp.replace(/log\(/gi, `Math.log10(`);
      exp = exp.replace(/ln\(/gi, `Math.log(`);

      // Handle exponentiation: a^b -> Math.pow(a,b)
      exp = exp.replace(
        /(\([^\)]+\)|[0-9.]+)\s*\^\s*(\([^\)]+\)|[0-9.]+)/g,
        (match, base, exponent) => {
          return `Math.pow(${base},${exponent})`;
        }
      );

      // Factorials: n! to factorial(n)
      exp = exp.replace(/(\d+)!/g, (match, n) => factorial(n));

      // Replace operators with JS equivalents
      exp = exp.replace(/×|x/gi, '*').replace(/÷/g, '/');
      // Modulo (%) is supported natively by JS, so leave as is

      // If degrees mode, convert trig function args from degrees to radians
      if (degrees) {
        exp = exp.replace(/Math\.sin\(([^)]+)\)/g, (match, val) => {
          return `Math.sin((${val})*Math.PI/180)`;
        });
        exp = exp.replace(/Math\.cos\(([^)]+)\)/g, (match, val) => {
          return `Math.cos((${val})*Math.PI/180)`;
        });
        exp = exp.replace(/Math\.tan\(([^)]+)\)/g, (match, val) => {
          return `Math.tan((${val})*Math.PI/180)`;
        });
      }

      // Evaluate expression safely
      let result = eval(exp);
      ans = result;
      return result;
    } catch (error) {
      return 'Error';
    }
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Use data-value attribute if present, otherwise text content
      const value =
        button.getAttribute('data-value') || button.textContent.trim();

      switch (value) {
        case '=':
          display.value = evaluateExpression(display.value);
          break;
        case 'AC':
          display.value = '';
          break;
        case 'B':
          display.value = display.value.slice(0, -1);
          break;
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'ln':
        case 'sqrt':
          display.value += `${value}(`;
          break;
        case '^':
          display.value += '^';
          break;
        case '!':
          display.value += '!';
          break;
        case 'pi':
          display.value += 'pi';
          break;
        case 'e':
        case 'EXP':
          display.value += 'e';
          break;
        case 'Ans':
          display.value += 'Ans';
          break;
        // Operators and other chars
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
        case '.':
        case '(':
        case ')':
          display.value += value;
          break;
        default:
          display.value += value;
          break;
      }
    });
  });
});