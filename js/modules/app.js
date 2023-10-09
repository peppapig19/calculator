import FormGenerator from './formGenerator.js'
import CalcRunner from './calcRunner.js'
import CalcOperations from './calcOperations.js'

export default class App {
    _jqContainer = $('#calculation-container');
    _form = new FormGenerator(this._jqContainer);
    _operations = [
        new CalcRunner('add-numbers', CalcOperations.addNumbers, this._form.generateTextForm),
        new CalcRunner('subtract', CalcOperations.subtract, this._form.generateTextForm),
        new CalcRunner('multiply', CalcOperations.multiply, this._form.generateTextForm),
        new CalcRunner('divide', CalcOperations.divide, this._form.generateTextForm),
        new CalcRunner('negate', CalcOperations.negate, this._form.generateTextForm),
        new CalcRunner('add-strings', CalcOperations.addStrings, this._form.generateTextForm),
        new CalcRunner('add-arrays', CalcOperations.addArrays, this._form.generateTextForm),
        new CalcRunner('add-images', CalcOperations.addImages, this._form.generateImageForm)
    ];
    _selectedOperation = this._operations[0];
    _jqOperationRadios = $('input[name="operation"]');
    _jqOperandCountSelect = $('#operand-count');
    _jqNumpad = $('#numpad');
    _jqDecimalBtns = this._jqNumpad.find('.numpad-decimal');
    _jqArrowBtn = $('#numpad-arrow');
    _jqCurInput = null;

    getOperations = () => {
        return this._operations;
    }

    getSelectedOperation = () => {
        return this._selectedOperation;
    }

    onOperationChange = (e) => {
        const inputType = $(e.target).attr('data-operand');
        this.changeNumpadVisibility(inputType);
        const maxOperands = $(e.target).attr('data-maxOperands') || 10;
        this.changeMaxOperands(maxOperands);
        const operationId = $(e.target).attr('id');
        const oper = this._operations.find(o => o.getId() === operationId);
        if (oper) {
            this._selectedOperation = oper;
            this._form.reset();
            oper.initForm();
        }
    }

    onOperandCountChange = (e) => {
        this._form.setOperandCount($(e.target).val());
        this._form.reset();
        this._selectedOperation.initForm();
        this._jqCurInput = this._jqContainer.find('input').first();
    }

    onNumpadInput = (e) => {
        this._jqCurInput.val(this._jqCurInput.val() + $(e.target).text());
    }

    changeNumpadVisibility = (inputType) => {
        if (inputType === 'number') {
            this._jqNumpad.css('display', 'grid');
        } else {
            this._jqNumpad.css('display', 'none');
        }
    }

    changeMaxOperands = (maxOperands) => {
        this._jqOperandCountSelect.empty();
        if (+maxOperands === 1) {
            let option = $(`<option value="1">1</option>`);
            this._jqOperandCountSelect.append(option);
        } else {
            for (let i = 2; i <= maxOperands; i++) {
                let option = $(`<option value="${i}">${i}</option>`);
                this._jqOperandCountSelect.append(option);
            }
        }
        this._jqOperandCountSelect.trigger('change');
    }

    onOperationRun = async () => {
        const operands = this._form.getOperandValues();
        const oper = this.getSelectedOperation();
        oper.setOperands(operands);
        await oper.run();
        this._form.resetResult();
        const error = oper.getError();
        if (error) {
            this._form.generateError(error);
        } else {
            this._form.generateSolution(oper.getSolution);
        }
    }

    init = () => {
        this._jqOperationRadios.each((_, element) => {
            $(element).on('change', this.onOperationChange);
        })
        this._jqOperandCountSelect.on('change', this.onOperandCountChange)
        this._jqContainer.on('click', '#run', this.onOperationRun)
        this._jqContainer.on('focusin', '.operand', (e) => {
            this._jqCurInput = $(e.target);
        })
        this._jqDecimalBtns.each((_, element) => {
            $(element).on('click', this.onNumpadInput)
        })
        this._jqArrowBtn.on('click', () => {
            this._jqCurInput.val(this._jqCurInput.val().slice(0, -1));
        })
    }

    run = () => {
        this.changeMaxOperands(10);
        this._jqOperandCountSelect.trigger('change');
    }
}