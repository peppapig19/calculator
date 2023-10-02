export let uploads = [];
let calcDiv;
let inputDiv;
let previewDiv;

export function setContainer(value) {
    calcDiv = value;
}

export function generateInputs(inputType, count) {
    removeResults();
    let i = 0;
    if (!inputDiv) {
        inputDiv = $('<div id="input-container"></div>');
        $(calcDiv).prepend(inputDiv);
    } else {
        const inputs = $(inputDiv).find('input');
        if ($(inputs[0]).attr('type') === inputType) {
            if (inputs.length === count) {
                return;
            }
            if (inputs.length > count) {
                for (let i = count; i < inputs.length; i++) {
                    $(inputs[i]).remove();
                    if (previewDiv) {
                        uploads.splice(i, 1);
                        $(previewDiv).children().eq(i).remove();
                    }
                }
                return;
            }
            i = inputs.length;
        } else {
            inputs.each(function () {
                $(this).remove();
            });
        }
    }
    while (i < count) {
        const input = $('<input class="operand">');
        input.attr('type', inputType);
        if (inputType === 'file') {
            input.attr('accept', 'image/*');
            const fileIndex = i;
            input.on('change', function (e) {
                onImageUpload(e, fileIndex);
            });
        } else {
            input.attr('placeholder', `x${i + 1}`);
        }
        $(inputDiv).append(input);
        i++;
    }
}

function onImageUpload(e, i) {
    if (uploads[i]) {
        uploads[i] = e.target.files[0];
        generateImagePreview(e, i);
        removeResults();
    } else {
        uploads.push(e.target.files[0]);
        generateImagePreview(e);
    }
}

export function generateSolutionElement(value, tag) {
    const solutionEl = $(`<${tag} class="solution"></${tag}>`);
    if (tag === 'span') {
        solutionEl.text(value);
    }
    if (tag === 'img') {
        solutionEl.addClass('preview');
        solutionEl.attr('src', value);
        solutionEl.css('display', 'block');
    }
    $(calcDiv).append(solutionEl);
}

export function generateErrorDiv(text) {
    const errorDiv = $('<div id="error"></div>');
    errorDiv.text(text);
    $(calcDiv).append(errorDiv);
}

export function generateOperandOptions(countSelect, optionCount) {
    const curOptionCount = countSelect.children.length;
    if (curOptionCount !== optionCount) {
        countSelect.html('');
        const allowSingleInput = +optionCount === 1;
        for (let i = allowSingleInput ? 1 : 2; i <= optionCount; i++) {
            let option = $(`<option value="${i}">${i}</option>`);
            countSelect.append(option);
        }
    }
}

export function removeResults() {
    const solution = $('.solution');
    const error = $('#error');
    if (solution.length) {
        solution.remove();
    }
    if (error.length) {
        error.remove();
    }
}

export function removePreviews() {
    if (previewDiv) {
        $(previewDiv).remove();
        previewDiv = null;
    }
    uploads = [];
}

function generateImagePreview(e, i = null) {
    if (!previewDiv) {
        previewDiv = $('<div id="preview-container"></div>');
        $(calcDiv).prepend(previewDiv);
    }
    const file = e.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            const img = $('<img class="preview">');
            img.attr('src', e.target.result);
            if (i !== null) {
                $(previewDiv).children().eq(i).replaceWith(img);
            } else {
                $(previewDiv).append(img);
            }
        };
        reader.readAsDataURL(file);
    }
}