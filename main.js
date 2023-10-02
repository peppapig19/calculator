import * as gen from './modules/generate.js';
import calc from './modules/calculate.js';

$(document).ready(function () {
    const calcDiv = $('#calculation-container');
    gen.setContainer(calcDiv);

    const countSelect = $('#operand-count');
    gen.generateOperandOptions(countSelect, 10);

    const solveBtn = $('#solve');
    const numpad = $('#numpad');
    const decimalBtns = numpad.find('.numpad-decimal');
    const arrowBtn = $('#numpad-arrow');
    const operationRadios = $('input[name="operation"]');

    let curInput;
    let curInputCount;
    let curInputType;

    calcDiv.on('focusin', '.operand', function (e) {
        curInput = $(e.target);
    });

    countSelect.on('change', function (e) {
        curInputCount = e.target.value;
        gen.generateInputs(curInputType || 'text', curInputCount);
        const firstOperandInput = $('#input-container').find('input').first();
        firstOperandInput.focus();
        firstOperandInput.trigger('focusin');
    });

    countSelect.val(2);
    countSelect.trigger('change');

    function onOperationSelect(e) {
        curInputType = $(e.target).attr('data-operand');
        if (curInputType === 'number') {
            numpad.css('display', 'grid');
            curInputType = 'text';
        } else {
            numpad.css('display', 'none');
        }
        const optionCount = $(e.target).attr('data-inputCount') || 10;
        gen.generateOperandOptions(countSelect, optionCount);
        if (+curInputCount === 1 && optionCount !== '1') {
            countSelect.val(2);
        } else {
            countSelect.val(Math.min(curInputCount, optionCount));
        }
        countSelect.trigger('change');
        solveBtn.removeAttr('disabled');
        gen.removeResults();
        gen.removePreviews();
    }

    operationRadios.each(function () {
        $(this).on('change', onOperationSelect);
    });

    function onDecimalClick(e) {
        curInput.val(curInput.val() + $(e.target).text());
    }

    decimalBtns.each(function () {
        $(this).on('click', onDecimalClick);
    });

    arrowBtn.on('click', function () {
        curInput.val(curInput.val().slice(0, -1));
    });

    solveBtn.on('click', async function () {
        gen.removeResults();
        const operation = $('input[name="operation"]:checked').attr('id');
        try {
            let values, tag;
            if (operation === 'add-images') {
                values = gen.uploads;
                tag = 'img';
            } else {
                const inputDiv = $('#input-container');
                values = inputDiv.find('input').map(function () {
                    return $(this).val();
                }).get();
                tag = 'span';
            }
            const res = await calc(operation, values);
            gen.generateSolutionElement(res, tag);
        } catch (e) {
            gen.generateErrorDiv(e.message);
        }
    });
});