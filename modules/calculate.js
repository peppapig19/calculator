export default async function performOperation(operation, values) {
    if (values instanceof Array) {
        switch (operation) {
            case 'add-numbers':
                return addNumbers(values);
            case 'subtract':
                return subtract(values);
            case 'multiply':
                return multiply(values);
            case 'divide':
                return divide(values);
            case 'negate':
                return negate(values);
            case 'add-strings':
                return addStrings(values);
            case 'add-arrays':
                return addArrays(values);
            case 'add-images':
                return await addImages(values);
        }
    }
}

function isValidNumber(value) {
    const isValid = /^-?\d+([,\.]\d+)?$/.test(value);
    if (isValid) {
        return true;
    } else {
        throw new Error('Введите корректные числа.');
    }
}

function isValidBoolean(value) {
    const isValid = value === 'true' || value === 'false';
    if (isValid) {
        return true;
    } else {
        throw new Error('Введите значение true/false.');
    }
}

function isValidArray(value) {
    if (value instanceof Array && value.every(isValidNumber)) {
        return true;
    } else {
        throw new Error('Введите через запятую числа (элементы массивов).');
    }
}

function addNumbers(values) {
    if (values.every(isValidNumber)) {
        let res = 0;
        values.forEach(value => {
            res += parseFloat(value);
        })
        return +res.toFixed(2);
    } else {
        return NaN;
    }
}

function subtract(values) {
    if (values.every(isValidNumber)) {
        let res = values[0] - values[1];
        return +res.toFixed(2);
    } else {
        return NaN;
    }
}

function multiply(values) {
    if (values.every(isValidNumber)) {
        let res = 1;
        values.forEach(value => {
            res *= parseFloat(value);
        })
        return +res.toFixed(2);
    } else {
        return NaN;
    }
}

function divide(values) {
    if (values.every(isValidNumber)) {
        let res = values[0] / values[1];
        if (!isFinite(res)) {
            throw new Error('На ноль делить нельзя.');
        }
        return +res.toFixed(2);
    } else {
        return NaN;
    }
}

function negate(values) {
    if (isValidBoolean(values[0])) {
        const a = values[0] === 'true' ? false : true;
        return a;
    } else {
        return null;
    }
}

function addStrings(values) {
    let res = '';
    values.forEach(value => {
        res += value.toString();
    })
    return res;
}

function addArrays(values) {
    const arrs = [];
    values.forEach(value => {
        arrs.push(value.replace(/\s+/g, '').split(','));
    })
    if (arrs.every(isValidArray)) {
        const lengths = arrs.map(a => a.length);
        const maxLength = Math.max(...lengths);
        let res = [];
        for (let i = 0; i < maxLength; i++) {
            let sum = 0;
            arrs.forEach(arr => {
                sum += +arr[i] || 0;
            })
            res.push(+sum.toFixed(2));
        }
        return res.join(', ');
    } else {
        return NaN;
    }
}

function addImages(values) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const loadPromises = [];
        values.forEach((value) => {
            const image = new Image();
            image.src = URL.createObjectURL(value);
            const loadPromise = new Promise((resolve) => {
                image.onload = () => {
                    URL.revokeObjectURL(image.src);
                    resolve(image);
                }
                image.onerror = () => {
                    URL.revokeObjectURL(image.src);
                    reject(new Error('Не удалось загрузить изображение.'));
                }
            });
            loadPromises.push(loadPromise);
        })
        Promise.all(loadPromises).then(images => {
            const widths = images.map(i => i.width);
            const heights = images.map(i => i.height);
            canvas.width = Math.max(...widths);
            canvas.height = Math.max(...heights);
            ctx.globalCompositeOperation = 'lighter';
            /*const resultData = ctx.createImageData(canvas.width, canvas.height);
            const imagesData = [];*/
            images.forEach(image => {
                ctx.drawImage(image, 0, 0);
                /*const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                imagesData.push(imageData);
                ctx.clearRect(0, 0, canvas.width, canvas.height);*/
            })
            /*imagesData.forEach(imageData => {
                for (let i = 0; i < resultData.data.length; i += 4) {
                    resultData.data[i] += imageData.data[i];
                    resultData.data[i + 1] += imageData.data[i + 1];
                    resultData.data[i + 2] += imageData.data[i + 2];
                    resultData.data[i + 3] = 255;
                }
            });
            ctx.putImageData(resultData, 0, 0);*/
            resolve(canvas.toDataURL());
        });
    });
}