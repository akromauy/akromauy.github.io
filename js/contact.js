document.addEventListener('DOMContentLoaded', function() {
  // Initialize EmailJS with your User ID
  emailjs.init("V0viZiGwRhS9vRhZN");
  
  // Get the form element and input fields
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const submitButton = document.getElementById('button');

   // Add this line here
   const recaptchaContainer = document.querySelector('.g-recaptcha');
  
  // Set name input attributes for better experience
  nameInput.setAttribute('autocomplete', 'name');
  nameInput.setAttribute('placeholder', 'e.g., Juan Pérez');
  nameInput.setAttribute('type', 'text');
  
  // Set phone input attributes for better mobile experience
  phoneInput.setAttribute('type', 'tel');
  phoneInput.setAttribute('autocomplete', 'tel');
  phoneInput.setAttribute('placeholder', 'e.g., +1 234 567 8901');
  
  // Set message input attributes
  messageInput.setAttribute('autocomplete', 'off');
  messageInput.setAttribute('placeholder', '¿Cómo te podemos ayudar?');
  messageInput.setAttribute('maxlength', '1000');
  
  // Create character counter for message field
  const messageContainer = messageInput.parentNode;
  const characterCounter = document.createElement('div');
  characterCounter.className = 'character-counter';
  characterCounter.style.color = 'white';
  characterCounter.style.fontSize = '0.8rem';
  characterCounter.style.textAlign = 'right';
  characterCounter.style.marginTop = '5px';
  characterCounter.textContent = '0/1000 caracteres';
  messageContainer.appendChild(characterCounter);
  
  // Create error messages with white text for all fields
  function createErrorMessage(input, message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'invalid-feedback';
    errorMsg.textContent = message;
    errorMsg.style.color = 'white';
    errorMsg.style.fontWeight = 'bold';
    input.parentNode.appendChild(errorMsg);
    return errorMsg;
  }
  
  // Create error messages for all fields
  const nameErrorMsg = createErrorMessage(nameInput, 'Por favor ingresa tu nombre completo');
  const emailErrorMsg = createErrorMessage(emailInput, 'Por favor ingresa un email válido (debe contener @ y un dominio)');
  const phoneErrorMsg = createErrorMessage(phoneInput, 'Por favor ingresa un número de teléfono válido');
  const messageErrorMsg = createErrorMessage(messageInput, 'Por favor ingresa un mensaje');
  
  // Create captcha error message
  const captchaErrorMsg = document.createElement('div');
  captchaErrorMsg.className = 'captcha-error';
  captchaErrorMsg.textContent = 'Por favor completa el captcha';
  captchaErrorMsg.style.color = 'white';
  captchaErrorMsg.style.fontWeight = 'bold';
  captchaErrorMsg.style.display = 'none';
  recaptchaContainer.parentNode.insertBefore(captchaErrorMsg, recaptchaContainer.nextSibling);
  
  // Validation functions
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function validateRequired(value) {
    return value.trim() !== '';
  }
  
  function validateName(name) {
    // Allow letters, spaces, hyphens, apostrophes, and accented characters
    // Must be between 2 and 50 characters
    const hasValidChars = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/.test(name);
    const validLength = name.length >= 2 && name.length <= 50;
    return hasValidChars && validLength;
  }
  
  function validatePhone(phone) {
    // Allow international format with country code
    // Must have at least 7 digits total (not counting non-digits)
    const cleanedPhone = phone.replace(/\D/g, '');
    return cleanedPhone.length >= 7 && cleanedPhone.length <= 15;
  }
  
  function validateMessage(message) {
    // Message should be between 10 and 1000 characters
    return message.trim().length >= 10 && message.trim().length <= 1000;
  }
  
  function validateRecaptcha() {
    // Verify reCAPTCHA response
    const recaptchaResponse = grecaptcha.getResponse();
    const isValid = recaptchaResponse.length !== 0;
    
    if (!isValid) {
      captchaErrorMsg.style.display = 'block';
    } else {
      captchaErrorMsg.style.display = 'none';
    }
    
    return isValid;
  }
  
  function sanitizeInput(input) {
    // Basic sanitization to prevent XSS
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  // Format name with proper capitalization
  function formatName(input) {
    const value = input.value;
    
    if (!value) return '';
    
    // Capitalize first letter of each word
    return value.replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
  }
  
  // Format phone number for international readability
  function formatPhoneNumber(input) {
    let value = input.value;
    
    // Preserve the + at the beginning if it exists
    const startsWithPlus = value.startsWith('+');
    
    // Remove all non-digits (but keep the + if it exists)
    value = value.replace(/\D/g, '');
    
    // Add the + back if it was there
    if (startsWithPlus) {
      value = '+' + value;
    }
    
    // Format the number with spaces for readability
    let formattedNumber = '';
    let digitCount = 0;
    
    for (let i = 0; i < value.length; i++) {
      // If this is the first character and it's a +, just add it
      if (i === 0 && value[i] === '+') {
        formattedNumber += '+';
        continue;
      }
      
      // Add a space after every 3 digits, but not at the beginning
      if (digitCount > 0 && digitCount % 3 === 0) {
        formattedNumber += ' ';
      }
      
      formattedNumber += value[i];
      digitCount++;
    }
    
    return formattedNumber;
  }
  
  // Update character counter
  function updateCharacterCounter() {
    const currentLength = messageInput.value.length;
    const maxLength = messageInput.getAttribute('maxlength');
    characterCounter.textContent = `${currentLength}/${maxLength} caracteres`;
    
    // Change color based on length
    if (currentLength > maxLength * 0.9) {
      characterCounter.style.color = '#ffc107'; // Yellow warning when approaching limit
    } else if (currentLength < 10) {
      characterCounter.style.color = '#dc3545'; // Red for too short
    } else {
      characterCounter.style.color = 'white'; // Normal color
    }
  }
  
  // Name input handling
  nameInput.addEventListener('input', function() {
    // Store cursor position
    const cursorPos = this.selectionStart;
    const previousLength = this.value.length;
    
    // Format name with proper capitalization
    const formattedName = formatName(this);
    
    // Only update if there's a change to prevent cursor jumping
    if (this.value !== formattedName) {
      this.value = formattedName;
      
      // Adjust cursor position if the name got longer
      const lengthDiff = this.value.length - previousLength;
      this.setSelectionRange(cursorPos + lengthDiff, cursorPos + lengthDiff);
    }
    
    // Validate the name
    if (!validateRequired(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      nameErrorMsg.textContent = 'Por favor ingresa tu nombre';
    } else if (this.value.length < 2) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      nameErrorMsg.textContent = 'El nombre debe tener al menos 2 caracteres';
    } else if (this.value.length > 50) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      nameErrorMsg.textContent = 'El nombre no debe exceder los 50 caracteres';
    } else if (!validateName(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      nameErrorMsg.textContent = 'El nombre solo debe contener letras, espacios, guiones o apóstrofes';
    } else {
      this.classList.add('is-valid');
      this.classList.remove('is-invalid');
    }
  });
  
  // Phone input handling
  phoneInput.addEventListener('input', function() {
    // Store cursor position
    const cursorPos = this.selectionStart;
    const previousValue = this.value;
    
    // Format the phone number
    this.value = formatPhoneNumber(this);
    
    // Adjust cursor position based on added formatting characters
    const addedChars = this.value.length - previousValue.replace(/\D/g, '').length;
    this.setSelectionRange(cursorPos + addedChars, cursorPos + addedChars);
    
    // Validate the phone number
    if (!validateRequired(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      phoneErrorMsg.textContent = 'Por favor ingresa un número de teléfono';
    } else if (!validatePhone(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      phoneErrorMsg.textContent = 'Por favor ingresa un número de teléfono válido (mínimo 7 dígitos)';
    } else {
      this.classList.add('is-valid');
      this.classList.remove('is-invalid');
    }
  });
  
  // Message input handling
  messageInput.addEventListener('input', function() {
    // Update character counter
    updateCharacterCounter();
    
    // Validate the message
    if (!validateRequired(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      messageErrorMsg.textContent = 'Por favor ingresa un mensaje';
    } else if (this.value.trim().length < 10) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      messageErrorMsg.textContent = 'El mensaje debe tener al menos 10 caracteres';
    } else if (this.value.length > 1000) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      messageErrorMsg.textContent = 'El mensaje no debe exceder los 1000 caracteres';
    } else {
      this.classList.add('is-valid');
      this.classList.remove('is-invalid');
    }
  });
  
  // Special validation for email (required + format)
  emailInput.addEventListener('input', function() {
    if (!validateRequired(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      emailErrorMsg.textContent = 'Por favor ingresa tu email';
    } else if (!validateEmail(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      emailErrorMsg.textContent = 'Por favor ingresa un email válido (debe contener @ y un dominio)';
    } else {
      this.classList.add('is-valid');
      this.classList.remove('is-invalid');
    }
  });
  
  // Set initial character counter
  updateCharacterCounter();
  
  // Validate the entire form
  function validateForm() {
    let isValid = true;
    
    // Validate name
    if (!validateRequired(nameInput.value) || !validateName(nameInput.value)) {
      nameInput.classList.add('is-invalid');
      isValid = false;
    }
    
    // Validate email
    if (!validateRequired(emailInput.value) || !validateEmail(emailInput.value)) {
      emailInput.classList.add('is-invalid');
      isValid = false;
    }
    
    // Validate phone
    if (!validateRequired(phoneInput.value) || !validatePhone(phoneInput.value)) {
      phoneInput.classList.add('is-invalid');
      isValid = false;
    }
    
    // Validate message
    if (!validateRequired(messageInput.value) || !validateMessage(messageInput.value)) {
      messageInput.classList.add('is-invalid');
      isValid = false;
    }
    
    // Validate reCAPTCHA
    if (!validateRecaptcha()) {
      isValid = false;
    }
    
    return isValid;
  }
  
  // Add submit event listener to the form
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Validate all fields before submitting
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    
    // Get form data (trim whitespace and sanitize inputs)
    const name = sanitizeInput(nameInput.value.trim());
    const email = sanitizeInput(emailInput.value.trim());
    const phone = sanitizeInput(phoneInput.value.trim());
    const message = sanitizeInput(messageInput.value.trim());
    const recaptchaResponse = grecaptcha.getResponse();
    
    // Change button text while sending
    const button = document.getElementById('button');
    const originalButtonText = button.innerHTML;
    button.innerHTML = 'Enviando...';
    button.disabled = true;
    
    // Prepare template parameters
    const templateParams = {
      name: name,
      email: email,
      phone: phone,
      message: message,
      'g-recaptcha-response': recaptchaResponse
    };
    
    // Send email using EmailJS
    emailjs.send('service_826nt3j', 'template_j30b93a', templateParams)
      .then(function() {
        // Success message
        alert('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.');
        contactForm.reset(); // Reset the form
        
        // Reset reCAPTCHA
        grecaptcha.reset();
        
        // Reset character counter
        updateCharacterCounter();
        
        // Remove validation classes
        document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
          el.classList.remove('is-valid', 'is-invalid');
        });
        
        // Hide captcha error message
        captchaErrorMsg.style.display = 'none';
        
        // Reset button
        button.innerHTML = originalButtonText;
        button.disabled = false;
      }, function(error) {
        // Error handling
        console.log('Error:', error);
        alert('Hubo un problema al enviar el mensaje. Por favor, inténtalo nuevamente.');
        
        // Reset button
        button.innerHTML = originalButtonText;
        button.disabled = false;
      });
  });
});