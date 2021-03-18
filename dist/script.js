class InputCounter {
    constructor(counter) {
        this.counter = counter;
        const input = this.counter.querySelector('.input-counter-input');
        this.align = input.dataset.actionAlign;
        if (this.align) {
            this.counter.classList.add(this.align);
        }
        this.options = {
            min:  parseFloat(input.dataset.min),
            max: parseFloat(input.dataset.max),
            step: parseFloat(input.dataset.step) || 1,
            round: !isNaN(parseInt(input.dataset.round)) ? parseInt(input.dataset.round) : 2,
        };
        console.log(input, this.options);
        this.event_name = 'input_change';
        this.event = new CustomEvent(this.event_name);
        this.init();
    }

    init = () => {
        if (!this.counter.classList.contains('init')) {
            this.counter.addEventListener('input_change', this.calculate);
            if (this.options.actions) {
                if (this.align) {
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('input-counter-actions');
                    wrapper.insertAdjacentHTML('afterbegin', this.get_action_html('plus'));
                    wrapper.insertAdjacentHTML('beforeend', this.get_action_html('minus'));
                    switch (this.align) {
                        case "right":
                            this.counter.insertAdjacentElement('beforeend', wrapper);
                            break;
                        case "left":
                            this.counter.insertAdjacentElement('afterbegin', wrapper);
                            break;
                    }
                } else {
                    this.counter.insertAdjacentHTML('afterbegin', this.get_action_html('minus'));
                    this.counter.insertAdjacentHTML('beforeend', this.get_action_html('plus'));
                }
            }
            this.setActionEvents();
            this.setInputEvent();
            this.calculate();
            this.counter.classList.add('init');
        }
    }

    get_action_html = action => {
        return `<div class="input-counter-${action}">
                    ${action === 'minus' ? '-' : '+'}
                </div>`
    }

    setActionEvents = () => {
        this.counter.querySelectorAll('.input-counter-minus, .input-counter-plus').forEach(item => {
            item.addEventListener('click', event => {
                const target = event.currentTarget || event.target;
                const parent = target.closest('.input-counter');
                let custom_event = new CustomEvent(this.event_name,
                    {detail: target.classList.contains('input-counter-minus') ? '-' : '+'})
                if (parent) parent.dispatchEvent(custom_event);
            })
        })
    }

    setInputEvent = () => {
        this.counter.querySelectorAll('.input-counter-input').forEach(item => {
            item.addEventListener('change', event => {
                event.preventDefault();
                const target = event.currentTarget || event.target;
                const parent = target.closest('.input-counter');
                parent.dispatchEvent(this.event);
            })
            item.addEventListener('keydown', event => {
                if (event.keyCode === 13)
                {
                    event.preventDefault();
                    const target = event.currentTarget || event.target;
                    target.blur();
                }
            })
        })
    }

    check_input = () => {
        const input = this.counter.querySelector('input');
        const minus = this.counter.querySelector('.input-counter-minus');
        const plus = this.counter.querySelector('.input-counter-plus');
        const max = this.options.max;
        const min = this.options.min;
        let value = parseFloat(input.value);
        if (plus) plus.classList.remove('active');
        if (minus) minus.classList.remove('active');
        if (value > min || isNaN(min)) minus.classList.add('active');
        if (value < max || isNaN(max)) plus.classList.add('active');
    }

    calculate = event => {
        let target = this.counter;
        let action;
        if (event) {
            event.preventDefault();
            target = event.currentTarget || event.target;
            action = event.detail;
        }
        const input = target.querySelector('.input-counter-input');
        const max = this.options.max;
        const min = this.options.min;
        const step = this.options.step;
        let value = parseFloat(input.value);
        if (action === '+' && (isNaN(max) || value + step <= max)) {
            value = value + step;
        }
        if (action === '-' && (isNaN(min) || value - step >= min)) {
            value = value - step;
        }
        if (!action) {
            if (max !== null && value > max) {
                value = max;
            }
            if (min !== null && value < min) {
                value = min;
            }
            value = parseInt(value / step) * step;
        }
        input.value = parseFloat(value.toFixed(this.options.round));
        this.check_input();
    }

}

document.querySelectorAll('.input-counter').forEach(i => new InputCounter(i))
