const validation = (value, rules, form) => {
  let valid = true;

  for (let rule in rules) {
    switch (rule) {
      case 'isRequired':
        valid = valid && validateRequired(value);
        // console.log(valid);
        break;
      case 'isEmail':
        valid = valid && validateEmail(value);
        // console.log(valid);
        break;
      case 'minLength':
        valid = valid && validateMinLength(value, rules[rule]);
        // console.log(valid);
        break;
      case 'confirmPassword':
        valid =
          valid && // rules.confirmPassword에는 'password'가 저장되어있음.
          validateConfirmPassword(value, form[rules.confirmPassword].value);
        // console.log(valid);
        break;
      default:
        valid = true;
    }
  }
  return valid;
};

const validateConfirmPassword = (confirmPassword, password) => {
  return confirmPassword === password;
};

const validateMinLength = (value, ruleValue) => {
  if (value.length >= ruleValue) {
    return true;
  }
  return false;
};

// 이메일 형식이어야 valid함
const validateEmail = (value) => {
  const expression =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return expression.test(String(value).toLocaleLowerCase());
};

const validateRequired = (value) => {
  if (value !== '') {
    return true;
  }
  return false;
};

export default validation;
