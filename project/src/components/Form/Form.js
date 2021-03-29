import React, { Component } from 'react';

class Form extends Component {

    validate() {
        const formLength = this.formEl.length;

        if (this.formEl.checkValidity() === false) {
            for (let i = 0; i < formLength; i++) {
                const elem = this.formEl[i];
                const errorLabel = elem.parentNode.parentNode.querySelector(".invalid-feedback-placeholder");

                if (errorLabel && elem.nodeName.toLowerCase() !== "button" && elem.id !== "width_tmp_select") {
                    if (!elem.validity.valid) {
                        errorLabel.textContent = elem.validationMessage;
                    } else {
                        errorLabel.textContent = "";
                    }
                }
            }

            return false;
        } else {
            for (let i = 0; i < formLength; i++) {
                const elem = this.formEl[i];
                const errorLabel = elem.parentNode.parentNode.querySelector(".invalid-feedback-placeholder");
                if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
                    errorLabel.textContent = "";
                }
            }
            return true;
        }
    }

    submitHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        const { customValidation = () => true, onSubmit } = this.props;
        const isValid = customValidation();
        if(this.validate() && isValid && onSubmit)
            onSubmit();
    }

    render() {
        return <form ref={(form) => this.formEl = form} {...this.props}
            className={this.props.className}
            onSubmit={this.submitHandler.bind(this)}
            noValidate
        >
            {this.props.children}
        </form>
    }
}

export default Form;