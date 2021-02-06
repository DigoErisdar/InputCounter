class InputCounter {
    constructor(counter) {
        this.counter = counter;
        const input = this.counter.querySelector('.input-counter-input');
        this.options = {
            min: parseFloat(input.dataset.min) || 1,
            max: parseFloat(input.dataset.max) || 999,
        };
        this.event = new CustomEvent('input_change');
        this.init();
    }

    init = () => {
        if (!this.counter.classList.contains('init')) {
            this.counter.addEventListener('input_change', this.calculate);
            this.counter.insertAdjacentHTML('afterbegin', this.get_action_html('minus'));
            this.counter.insertAdjacentHTML('beforeend', this.get_action_html('plus'));
            this.setActionEvents();
            this.setInputEvent();
            this.check_input();
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
                let custom_event = new CustomEvent('input_change',
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
        if (value > min) minus.classList.add('active');
        if (value < max) plus.classList.add('active');
    }

    calculate = event => {
        event.preventDefault();
        const target = event.currentTarget || event.target;
        const input = target.querySelector('.input-counter-input');
        const max = this.options.max;
        const min = this.options.min;
        let action = event.detail;
        let value = parseFloat(input.value);
        if (action === '+' && value + 1 <= max) {
            input.value = parseFloat(value) + 1;
        }
        if (action === '-' && value - 1 >= min) {
            input.value = parseFloat(value) - 1;
        }

        if (!action) {
            if (value > max) {
                input.value = max;
            }
            if (value < min) {
                input.value = min;
            }
        }
        this.check_input();
    }

}

document.querySelectorAll('.input-counter').forEach(i => new InputCounter(i))
