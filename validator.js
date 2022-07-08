// validation library

function Validator(options) {
    
    var selectorRules = {};

    // Hàm thực hiện Validate
    function Validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
                    
        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rule và kiếm tra
        // Nếu có lỗi thì dừng kiểm tra (Lấy message lỗi đầu tiên nhận được để hiển thị)
        for(var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if(errorMessage) { //errorMessage = Vui long nhap truong nay ==> true
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else { //errorMessage = undefined ==> false
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }

        return !errorMessage;

    }

    //  Lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    if(formElement) {

        // Xử lý validate tất cả khi nhấn submit
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = Validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            var enableInputs = formElement.querySelectorAll('[name]');

            var formValue = Array.from(enableInputs).reduce(function(values, input) {
                // return (values[input.name] = input.name) && values;
                values[input.name] = input.name;
                return values;
            }, {});

            console.log(formValue);

            // if(isFormValid) {
            //     if (typeof options.onSubmit === 'function') {

                    
            //         options.onSubmit(formValue);
            //     }
            // } else {
            //     console.log('Có lỗi');
            // }
        }

        // Lặp qua mỗi rule và xử lý
        options.rules.forEach(function(rule) {
            
            // Lưu lại các rules cho mỗi input
            
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] =  [rule.test];
            }
            
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                // Xử lý trương hợp blur khỏi input
                inputElement.onblur = function () {
                    // value: inputElement.value
                    // test: rule.test()

                    Validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid'); 
                }
            }

        });
    }

}

// Định nghĩa rules
// Nguyên tắc của rules:
// Khi có lỗi => Trả ra message lỗi
// Khi thành công => không trả ra gì cả (undefined)
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    }
}

Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Mật khẩu phải bao gồm ${min} kí tự`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}