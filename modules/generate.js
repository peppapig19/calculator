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
        inputDiv = document.createElement('div');
        inputDiv.id = 'input-container';
        calcDiv.prepend(inputDiv);
    } else {
        const inputs = inputDiv.querySelectorAll('input');
        if (inputs[0].getAttribute('type') === inputType) {
            if (inputs.length === count) {
                return;
            }
            if (inputs.length > count) {
                for (let i = count; i < inputs.length; i++) {
                    inputs[i].remove();
                }
                return;
            }
            i = inputs.length;
        } else {
            inputs.forEach(input => {
                input.remove();
            })
        }
    }
    while (i < count) {
        const input = document.createElement('input');
        input.className = 'operand';
        input.type = inputType;
        if (inputType === 'file') {
            input.accept = 'image/*';
            const fileIndex = i;
            input.addEventListener('change', function (e) {
                onImageUpload(e, fileIndex);
            });
        } else {
            input.placeholder = `x${i + 1}`;
        }
        inputDiv.appendChild(input);
        i++;
    }
}

function onImageUpload(e, i) {
    if (uploads[i]) {
        uploads[i] = e.target.files[0];
        generateImagePreview(e, i);
    } else {
        uploads.push(e.target.files[0]);
        generateImagePreview(e);
    }
}

export function generateSolutionElement(value, tag) {
    const solutionEl = document.createElement(tag);
    solutionEl.className = 'solution';
    if (tag === 'span') {
        solutionEl.textContent = value;
    }
    if (tag === 'img') {
        solutionEl.classList.add('preview');
        solutionEl.src = value;
        solutionEl.style.display = 'block';
    }
    calcDiv.appendChild(solutionEl);
}

export function generateErrorDiv(text) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error';
    errorDiv.textContent = text;
    calcDiv.appendChild(errorDiv);
}

export function generateOperandOptions(countSelect, optionCount) {
    const curOptionCount = countSelect.querySelectorAll('option').length;
    if (curOptionCount !== optionCount) {
        countSelect.innerHTML = '';
        const allowSingleInput = +optionCount === 1;
        for (let i = allowSingleInput ? 1 : 2; i <= optionCount; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            countSelect.appendChild(option);
        }
    }
}

export function removeResults() {
    const solution = document.querySelector('.solution');
    const error = document.getElementById('error');
    if (solution) {
        solution.remove();
    }
    if (error) {
        error.remove();
    }
}

export function removePreviews() {
    if (previewDiv) {
        previewDiv.remove();
        previewDiv = null;
    }
    uploads = [];
}

function generateImagePreview(e, i = null) {
    if (!previewDiv) {
        previewDiv = document.createElement('div');
        previewDiv.id = 'preview-container';
        calcDiv.prepend(previewDiv);
    }
    const file = e.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            const previewDiv = document.getElementById('preview-container');
            const img = document.createElement('img');
            img.className = 'preview';
            img.src = e.target.result;
            if (i !== null) {
                previewDiv.replaceChild(img, previewDiv.children[i]);
            } else {
                previewDiv.appendChild(img);
            }
        }
        reader.readAsDataURL(file);
    }
}