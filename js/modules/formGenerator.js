export default class FormGenerator {
    _inputCount = 0;
    _fileUploads = [];

    constructor(jqContainer) {
        this._jqContainer = jqContainer;
    }

    setOperandCount = (count) => {
        this._inputCount = count;
    }

    getOperandValues = () => {
        if (this._fileUploads.length) {
            return this._fileUploads;
        } else {
            return $('#input-container').children().map(function () {
                return $(this).val();
            }).get();
        }
    }

    init = () => {
        const inputDiv = $('<div id="input-container"></div>');
        $(this._jqContainer).append(inputDiv);
        const runBtn = $('<button id="run">Решить</button>');
        $(this._jqContainer).append(runBtn);
    }

    reset = () => {
        $(this._jqContainer).empty();
        this._fileUploads = [];
    }

    resetResult = () => {
        const solution = $(this._jqContainer).find('.solution');
        if (solution) {
            solution.remove();
        }
        const error = $(this._jqContainer).find('#error');
        if (error) {
            error.remove();
        }
    }

    generateSolution = (solution) => {
        if (this._fileUploads.length) {
            const solutionImg = $(`<img class="solution"></img>`);
            solutionImg.addClass('preview');
            solutionImg.attr('src', solution);
            solutionImg.css('display', 'block');
            $(this._jqContainer).append(solutionImg);
        } else {
            const solutionSpan = $(`<span class="solution"></span>`);
            solutionSpan.text(solution);
            $(this._jqContainer).append(solutionSpan);
        }
    }

    generateError = (error) => {
        const errorDiv = $('<div id="error"></div>');
        errorDiv.text(error);
        $(this._jqContainer).append(errorDiv);
    }

    generateTextForm = () => {
        this.init();
        for (let i = 0; i < this._inputCount; i++) {
            const input = $('<input class="operand">');
            input.attr('placeholder', `x${i + 1}`);
            $('#input-container').append(input);
        }
    }

    generateImageForm = () => {
        this.init();
        for (let i = 0; i < this._inputCount; i++) {
            const input = $('<input class="operand">');
            input.attr('type', 'file');
            input.attr('accept', 'image/*');
            const fileIndex = i;
            input.on('change', (e) => {
                this.onImageUpload(e, fileIndex);
            })
            $('#input-container').append(input);
        }
        const previewDiv = $('<div id="preview-container"></div>');
        $(this._jqContainer).prepend(previewDiv);
    }

    onImageUpload = (e, i) => {
        const file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            const img = $('<img class="preview">');
            img.attr('src', e.target.result);
            if (this._fileUploads[i]) {
                this._fileUploads[i] = file;
                $('#preview-container').children().eq(i).replaceWith(img);
            } else {
                this._fileUploads.push(file);
                $('#preview-container').append(img);
            }
        }
        reader.readAsDataURL(file);
    }
}