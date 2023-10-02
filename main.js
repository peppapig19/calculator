import * as gen from './modules/generate.js';
import calc from './modules/calculate.js';

document.addEventListener('DOMContentLoaded', function () {
    const calcDiv = document.getElementById('calculation-container');
    gen.setContainer(calcDiv);

    const countSelect = document.getElementById('operand-count');
    gen.generateOperandOptions(countSelect, 10);

    const solveBtn = document.getElementById('solve');
    const numpad = document.getElementById('numpad');
    const decimalBtns = numpad.querySelectorAll('.numpad-decimal');
    const arrowBtn = numpad.querySelector('#numpad-arrow');
    const operationRadios = document.querySelectorAll('input[name="operation"]');

    let curInput;
    let curInputCount;
    let curInputType;

    calcDiv.addEventListener('focusin', function (e) {
        if (e.target.className === 'operand') {
            curInput = e.target;
        }
    });

    countSelect.addEventListener('change', function (e) {
        curInputCount = e.target.value;
        gen.generateInputs(curInputType ?? 'text', curInputCount);
        const firstOperandInput = document.getElementById('input-container').querySelector('input');
        firstOperandInput.focus();
        firstOperandInput.dispatchEvent(new Event('focusin', { bubbles: true }));
    });

    countSelect.value = 2;
    countSelect.dispatchEvent(new Event('change'));

    function onOperationSelect(e) {
        curInputType = e.target.getAttribute('data-operand');
        if (curInputType === 'number') {
            numpad.style.display = 'grid';
            curInputType = 'text';
        } else {
            numpad.style.display = 'none';
        }
        const optionCount = e.target.getAttribute('data-inputCount') ?? 10;
        gen.generateOperandOptions(countSelect, optionCount);
        if (+curInputCount === 1 && optionCount !== 1) {
            countSelect.value = 2;
        } else {
            countSelect.value = Math.min(curInputCount, optionCount);
        }
        countSelect.dispatchEvent(new Event('change'));
        gen.removePreviews();
        solveBtn.removeAttribute('disabled');
    }

    operationRadios.forEach(radio => {
        radio.addEventListener('change', onOperationSelect);
    });

    function onDecimalClick(e) {
        curInput.value += e.target.textContent;
    }

    decimalBtns.forEach(btn => {
        btn.addEventListener('click', onDecimalClick);
    });

    arrowBtn.addEventListener('click', function () {
        curInput.value = curInput.value.slice(0, -1);
    });

    solveBtn.addEventListener('click', async function () {
        gen.removeResults();
        const operation = document.querySelector('input[name="operation"]:checked').id;
        try {
            let values, tag;
            if (operation === 'add-images') {
                values = gen.uploads;
                tag = 'img';
            } else {
                const inputDiv = document.getElementById('input-container');
                values = Array.from(inputDiv.querySelectorAll('input')).map(i => i.value);
                tag = 'span';
            }
            const res = await calc(operation, values);
            gen.generateSolutionElement(res, tag);
        } catch (e) {
            gen.generateErrorDiv(e.message);
        }
    });
});