/***************************************************************************
 * Data
 ****************************************************************************/

// Error messages database
const errMessages = {
  empty: "This field cannot be empty",
  email: "This is not a valid email adress",
  tel: "Please use only digits and spaces",
};

// Validation types database (Key should be a proper form type parameter(e.g. email, tel, number))
const validationTypes = {
  email: (emailField) =>
    emailField.value.match(/^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+$/im),
  tel: (phoneField) => phoneField.value.match(/^[0-9+\s]+$/g),
};

/***************************************************************************
 * DOM management
 ****************************************************************************/

// Get all form elements from <form name="contact">
const formFields = document.forms.contact.elements;

// Add event listners for form elements
for (const element of formFields) {
  if (element.getAttribute("type") !== "submit") {
    // Validate fields live for every field other than submit button
    element.addEventListener("focusout", () =>
      validateElement(validationTypes, element)
    );
  } else {
    // Finall validation and sending the form data
    element.addEventListener("click", (e) => {
      e.preventDefault();
      submitAction(formFields);
    });
  }
}

// Make object containing contact form data
function formDataReducer(formValues, field) {
  if (field.type !== "submit") {
    formValues[field.name] = field.value;
  }
  return formValues;
}

// Form submit action
function submitAction(fields) {
  const formData = Object.values(fields).reduce(formDataReducer, {});
  let success = true;
  for (const field of fields) {
    if (field.type !== "submit" && !validateElement(validationTypes, field)) {
      success = false;
    }
  }
  if (!success) {
    console.error("Validation error! Check the fields outlined in red!");
    return false;
  }
  console.info("Success! Sent form data: " + JSON.stringify(formData));
  modal.style.display = "block";
  return true;
}

/***************************************************************************
 * Validation section
 ****************************************************************************/

// Form fields validation function
const validateElement = (validationType, field) => {
  for (const key in validationType) {
    if (field.getAttribute("type") === key) {
      if (validationType[key](field)) {
        rmErr(field);
        return true;
      } else if (field.value) {
        setErr(field, errMessages[key]);
        return false;
      } else {
        if (field.hasAttribute("required")) {
          setErr(field, errMessages.empty);
          return false;
        } else {
          rmErr(field);
          return true;
        }
      }
    } else if (!validationType[field.getAttribute("type")]) {
      if (field.hasAttribute("required")) {
        if (field.value) {
          rmErr(field);
          return true;
        } else {
          setErr(field, errMessages.empty);
          return false;
        }
      } else {
        rmErr(field);
        return true;
      }
    }
  }
};

/***************************************************************************
 * Error indication mangement
 ****************************************************************************/

// Set error message/indication
const setErr = (field, errMessage) => {
  const errContainerHTML = `<small id="error-${field.name}" class="errorText">${errMessage}</small>`,
    errContainer = document.getElementById("error-" + field.name);
  field.classList.add("errorInput");
  if (errContainer) {
    errContainer.innerText = errMessage;
  } else {
    field.insertAdjacentHTML("beforebegin", errContainerHTML);
  }
};

// Remove error message/indication
const rmErr = (field) => {
  const errContainer = document.getElementById("error-" + field.name);
  field.classList.remove("errorInput");
  if (errContainer) {
    field.parentNode.removeChild(errContainer);
  }
};

/***************************************************************************
 * Modal
 ****************************************************************************/
const modal = document.getElementById("contact-modal"),
  closeButton = document.getElementsByClassName("close")[0];

closeButton.addEventListener("click", () => (modal.style.display = "none"));

window.addEventListener("click", (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
});
