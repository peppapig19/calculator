export default class CalcOperations {
    static init = () => {
        this._result = {
            solution: null,
            error: null
        };
    }

    static isValidNumber = (value) => {
        return /^-?\d+([,\.]\d+)?$/.test(value);
    }

    static isValidBoolean = (value) => {
        return value === 'true' || value === 'false';
    }

    static isValidArray = (value) => {
        return value instanceof Array && value.every(this.isValidNumber);
    }

    static addNumbers = (values) => {
        this.init();
        if (values.every(this.isValidNumber)) {
            let res = 0;
            values.forEach(value => {
                res += parseFloat(value.replace(',', '.'));
            })
            this._result.solution = +res.toFixed(2);
        } else {
            this._result.error = 'Введите корректные числа.';
        }
        return this._result;
    }

    static subtract = (values) => {
        this.init();
        if (values.every(this.isValidNumber)) {
            let res = parseFloat(values[0].replace(',', '.')) - parseFloat(values[1].replace(',', '.'));
            this._result.solution = +res.toFixed(2);
        } else {
            this._result.error = 'Введите корректные числа.';
        }
        return this._result;
    }

    static multiply = (values) => {
        this.init();
        if (values.every(this.isValidNumber)) {
            let res = 1;
            values.forEach(value => {
                res *= parseFloat(value.replace(',', '.'));
            })
            this._result.solution = +res.toFixed(2);
        } else {
            this._result.error = 'Введите корректные числа.';
        }
        return this._result;
    }

    static divide = (values) => {
        this.init();
        if (values.every(this.isValidNumber)) {
            let res = parseFloat(values[0].replace(',', '.')) / parseFloat(values[1].replace(',', '.'));
            if (isFinite(res)) {
                this._result.solution = +res.toFixed(2);
            } else {
                this._result.error = 'На ноль делить нельзя.';
            }
        } else {
            this._result.error = 'Введите корректные числа.';
        }
        return this._result;
    }

    static negate = (values) => {
        this.init();
        if (this.isValidBoolean(values[0])) {
            this._result.solution = values[0] === 'true' ? false : true;
        } else {
            this._result.error = 'Введите значение true/false.';
        }
        return this._result;
    }

    static addStrings = (values) => {
        this.init();
        this._result.solution = '';
        values.forEach(value => {
            this._result.solution += value.toString();
        })
        return this._result;
    }

    static addArrays = (values) => {
        this.init();
        const arrs = [];
        values.forEach(value => {
            arrs.push(value.replace(/\s+/g, '').split(','));
        })
        if (arrs.every(this.isValidArray)) {
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
            this._result.solution = res.join(', ');
        } else {
            this._result.error = 'Введите через запятую числа (элементы массивов).';
        }
        return this._result;
    }

    static addImages = (values) => {
        this.init();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        return new Promise((resolve, reject) => {
            const loadPromises = [];
            values.forEach((value) => {
                const image = new Image();
                if (value) {
                    image.src = URL.createObjectURL(value);
                } else {
                    this._result.error = 'Не удалось загрузить изображение.';
                    return this._result;
                }
                const loadPromise = new Promise((resolve) => {
                    image.onload = () => {
                        URL.revokeObjectURL(image.src);
                        resolve(image);
                    }
                    image.onerror = () => {
                        URL.revokeObjectURL(image.src);
                        this._result.error = 'Не удалось загрузить изображение.';
                        reject(this._result);
                    }
                });
                loadPromises.push(loadPromise);
            })
            Promise.all(loadPromises).then(images => {
                const widths = images.map(i => i.width);
                const heights = images.map(i => i.height);
                canvas.width = Math.max(...widths);
                canvas.height = Math.max(...heights);
                ctx.globalCompositeOperation = 'multiply';
                images.forEach(image => {
                    ctx.drawImage(image, 0, 0);
                })
                this._result.solution = canvas.toDataURL();
                resolve(this._result);
            });
        });
    }
}