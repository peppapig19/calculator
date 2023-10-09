export default class CalcRunner {
    _operands = [];
    _result = {};

    constructor(id, operation, generateForm) {
        this._id = id;
        this._operation = operation;
        this._generateForm = generateForm;
    }

    setOperands = (operands) => {
        this._operands = operands;
    }

    getId = () => {
        return this._id;
    }

    getSolution = () => {
        return this._result.solution;
    }

    getError = () => {
        return this._result.error;
    }

    initForm = () => {
        this._generateForm();
    }

    run = async () => {
        this._result = await this._operation(this._operands);
    }
}