import Errors from './errors.js';

export default class Form {
    constructor(data, config={}) {
        this.originalData = data;
        this.isSubmitting = false;

        for (let field in data) {
            this[field] = data[field];
        }

        this.options = {
            clearOnSubmit: this.setOption(config.clearOnSubmit, false),
        };

        this.errors = new Errors();
    }

    setOption(option, defaultValue) {
        return (typeof option === 'undefined') ? defaultValue : option;
    }

    fill(data, _reset=true) {
        if (_reset) {
            this.reset();
        }
        for (let field in data) {
            this[field] = data[field];
        }
    }

    data() {
        let payload = {};

        for (let property in this.originalData) {
            payload[property] = this[property];
        }
        return payload;
    }

    reset() {
        for (let field in this.originalData) {
            this[field] = '';
        }

        this.errors.clear();
    }

    submit(method, url) {
        this.isSubmitting = true;
        return new Promise((resolve, reject) => {
            axios[method](url, this.data())
                .then(response => {
                    this.onSuccess(response.data);
                    //
                    resolve(response);
                    this.isSubmitting = false;
                })
                .catch(error => {
                    this.onFail(error.response.data);
                    //
                    reject(error);
                    this.isSubmitting = false;
                });
        });
    }

    put(url) {
        return this.submit('put', url);
    }

    patch(url) {
        return this.submit('patch', url);
    }

    post(url) {
        return this.submit('post', url);
    }

    delete(url) {
        return this.submit('delete', url);
    }

    onSuccess() {
        if(this.options.clearOnSubmit === true)
            this.reset();
        else
            this.errors.clear();
    }

    onFail(data) {
        this.errors.record(data.errors);
    }
}