document.addEventListener('DOMContentLoaded', function () {
    const firstOperandInput = document.getElementById('first-operand');
    const secondOperandInput = document.getElementById('second-operand');
    firstOperandInput.focus();

    const solveBtn = document.getElementById('solve');
    const solutionSpan = document.getElementById('solution');
    const errorDiv = document.getElementById('error');

    const numpad = document.getElementById('numpad');
    const decimalBtns = numpad.querySelectorAll('.numpad-decimal');
    const arrowBtn = numpad.querySelector('#numpad-arrow');

    const operationRadios = document.querySelectorAll('input[name="operation"]');
    const numericRadios = document.querySelectorAll('[data-operands="numbers"], [data-operands="arrays"]');
    const booleanRadios = document.querySelectorAll('[data-operands="boolean"]');
    const stringRadios = document.querySelectorAll('[data-operands="strings"]');

    let curInput = 1;

    function onOperationSelect() {
        solutionSpan.textContent = '';
        errorDiv.textContent = '';
    }

    function onNumericOperationSelect() {
        secondOperandInput.style.display = 'inline';
        numpad.style.display = 'grid';
    }

    function onBooleanOperationSelect() {
        secondOperandInput.style.display = 'none';
        numpad.style.display = 'none';
    }

    function onStringOperationSelect() {
        secondOperandInput.style.display = 'inline';
        numpad.style.display = 'none';
    }

    operationRadios.forEach(radio => {
        radio.addEventListener('change', onOperationSelect);
    });
    numericRadios.forEach(radio => {
        radio.addEventListener('change', onNumericOperationSelect);
    });
    booleanRadios.forEach(radio => {
        radio.addEventListener('change', onBooleanOperationSelect);
    });
    stringRadios.forEach(radio => {
        radio.addEventListener('change', onStringOperationSelect);
    });

    function onDecimalClick(event) {
        if (curInput === 1) {
            firstOperandInput.value += event.target.textContent;
        } else if (curInput === 2) {
            secondOperandInput.value += event.target.textContent;
        }
    }

    decimalBtns.forEach(btn => {
        btn.addEventListener('click', onDecimalClick);
    });

    function onOperandFocus(event) {
        if (event.target === firstOperandInput) {
            curInput = 1;
            arrowBtn.innerHTML = '&rarr;';
        } else if (event.target === secondOperandInput) {
            curInput = 2;
            arrowBtn.innerHTML = '&larr;';
        }
    }

    firstOperandInput.addEventListener('focus', onOperandFocus);
    secondOperandInput.addEventListener('focus', onOperandFocus);
    arrowBtn.addEventListener('click', function() {
        if (curInput === 1) {
            secondOperandInput.focus();
        } else if (curInput === 2) {
            firstOperandInput.focus();
        }
    });

    function isValidNumber(value) {
        const isValid = /^-?\d+([,\.]\d+)?$/.test(value);
        if (isValid) {
            errorDiv.textContent = '';
            return true;
        } else {
            solutionSpan.textContent = '';
            errorDiv.textContent = 'Введите корректные числа.';
            return false;
        }
    }

    function isValidBoolean(value) {
        const isValid = value === 'true' || value === 'false';
        if (isValid) {
            errorDiv.textContent = '';
            return true;
        } else {
            solutionSpan.textContent = '';
            errorDiv.textContent = 'Введите значение true/false.';
            return false;
        }
    }

    function isValidArray(value) {
        if (value instanceof Array && value.every(isValidNumber)) {
            errorDiv.textContent = '';
            return true;
        } else {
            solutionSpan.textContent = '';
            errorDiv.textContent = 'Введите через запятую числа (элементы массивов).';
            return false;
        }
    }

    function addNumbers(value1, value2) {
        if (isValidNumber(value1) && isValidNumber(value2)) {
            const a = parseFloat(value1);
            const b = parseFloat(value2);
            return a + b;
        } else {
            return NaN;
        }
    }

    function subtract(value1, value2) {
        if (isValidNumber(value1) && isValidNumber(value2)) {
            const a = parseFloat(value1);
            const b = parseFloat(value2);
            return a - b;
        } else {
            return NaN;
        }
    }

    function multiply(value1, value2) {
        if (isValidNumber(value1) && isValidNumber(value2)) {
            const a = parseFloat(value1);
            const b = parseFloat(value2);
            return a * b;
        } else {
            return NaN;
        }
    }

    function divide(value1, value2) {
        if (isValidNumber(value1) && isValidNumber(value2)) {
            const a = parseFloat(value1);
            const b = parseFloat(value2);
            return a / b;
        } else {
            return NaN;
        }
    }

    function negate(value1) {
        if (isValidBoolean(value1)) {
            const a = value1 === 'true' ? false : true;
            return a;
        } else {
            return null;
        }
    }

    function addStrings(value1, value2) {
        return value1.toString() + value2.toString();
    }

    function addArrays(value1, value2) {
        const a = value1.replace(/\s+/g, '').split(',');
        const b = value2.replace(/\s+/g, '').split(',');
        if (isValidArray(a) && isValidArray(b)) {
            let res = [];
            const maxLength = Math.max(a.length, b.length);
            for (let i = 0; i < maxLength; i++) {
                const el1 = +a[i] || 0;
                const el2 = +b[i] || 0;
                const sum = el1 + el2;
                res.push(+sum.toFixed(2));
            }
            return res.join(', ');
        } else {
            return null;
        }
    }

    solveBtn.addEventListener('click', function () {
        const operation = document.querySelector('input[name="operation"]:checked').id;
        let res;
        switch (operation) {
            case 'add-numbers':
                res = addNumbers(firstOperandInput.value, secondOperandInput.value);
                if (!isNaN(res)) {
                    solutionSpan.textContent = +res.toFixed(2);
                }
                break;
            case 'subtract':
                res = subtract(firstOperandInput.value, secondOperandInput.value);
                if (!isNaN(res)) {
                    solutionSpan.textContent = +res.toFixed(2);
                }
                break;
            case 'multiply':
                res = multiply(firstOperandInput.value, secondOperandInput.value);
                if (!isNaN(res)) {
                    solutionSpan.textContent = +res.toFixed(2);
                }
                break;
            case 'divide':
                res = divide(firstOperandInput.value, secondOperandInput.value);
                if (!isNaN(res) && isFinite(res)) {
                    solutionSpan.textContent = +res.toFixed(2);
                } else if (!isFinite(res)) {
                    solutionSpan.textContent = '';
                    errorDiv.textContent = 'На ноль делить нельзя.';
                }
                break;
            case 'negate':
                res = negate(firstOperandInput.value);
                if (res !== null) {
                    solutionSpan.textContent = res;
                }
                break;
            case 'add-strings':
                res = addStrings(firstOperandInput.value, secondOperandInput.value);
                solutionSpan.textContent = res;
                break;
            case 'add-arrays':
                res = addArrays(firstOperandInput.value, secondOperandInput.value);
                if (res !== null) {
                    solutionSpan.textContent = res;
                }
                break;
        }
    });
});