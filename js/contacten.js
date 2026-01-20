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
  
  // Set position relative for input containers and add more spacing
  const inputContainers = document.querySelectorAll('.form-control');
  inputContainers.forEach(container => {
    // Set all containers to relative positioning for proper error message placement
    container.parentNode.style.position = 'relative';
    
    // Reduce the bottom margin of inputs to make room for error messages
    container.style.marginBottom = '8px';
    
    // Increase the bottom margin of the parent element to accommodate the error message
    if (container.parentNode) {
      container.parentNode.style.marginBottom = '25px';
    }
  });
  
  // Set name input attributes for better experience
  nameInput.setAttribute('autocomplete', 'name');
  nameInput.setAttribute('placeholder', 'e.g. John Smith');
  nameInput.setAttribute('type', 'text');
  nameInput.style.textAlign = 'left';
  nameInput.style.paddingLeft = '5px';
  
  // Set phone input attributes for better mobile experience
  phoneInput.setAttribute('type', 'tel');
  phoneInput.setAttribute('autocomplete', 'tel');
  phoneInput.setAttribute('placeholder', 'e.g. +1 234 567 8901');
  phoneInput.style.textAlign = 'left';
  phoneInput.style.paddingLeft = '5px';
  
  // Set message input attributes
  messageInput.setAttribute('autocomplete', 'off');
  messageInput.setAttribute('placeholder', 'How can we help you?');
  messageInput.setAttribute('maxlength', '1000');
  messageInput.style.textAlign = 'left';
  messageInput.style.paddingLeft = '5px';
  
  // Set email input attributes
  emailInput.style.textAlign = 'left';
  emailInput.style.paddingLeft = '5px';
  
  // Add CSS for placeholder styling and text color
  const style = document.createElement('style');
  style.textContent = `
    ::placeholder {
      color: #666666 !important;
      opacity: 1;
      text-align: left;
      padding-left: 5px;
    }
    :-ms-input-placeholder {
      color: #666666 !important;
      text-align: left;
      padding-left: 5px;
    }
    ::-ms-input-placeholder {
      color: #666666 !important;
      text-align: left;
      padding-left: 5px;
    }
    .form-control {
      color: #0e0927 !important;
      position: relative;
      text-align: left;
      padding-left: 5px !important;
    }
    input.form-control, textarea.form-control {
      margin-bottom: 8px !important;
    }
    /* Fix for error messages causing height changes */
    .invalid-feedback {
      position: absolute !important;
      bottom: -22px !important;
      width: 100% !important;
      height: 22px !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transition: opacity 0.2s ease !important;
      margin: 0 !important;
      padding: 0 !important;
      z-index: 5 !important;
      letter-spacing: 0.2px !important;
    }
    /* Specific alignment for different error messages */
    #name + .invalid-feedback, 
    #email + .invalid-feedback, 
    #phone + .invalid-feedback {
      text-align: center !important;
      left: 0 !important;
    }
    #message + .invalid-feedback {
      text-align: left !important;
      left: 5px !important;
    }
    .invalid-feedback.visible {
      opacity: 1 !important;
      visibility: visible !important;
    }
    /* Add bottom margin to form fields to accommodate error messages */
    .form-group {
      margin-bottom: 25px !important;
      position: relative !important;
    }
    /* Fix for recaptcha error */
    .captcha-error {
      position: absolute !important;
      bottom: -22px !important;
      left: 5px !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transition: opacity 0.2s ease !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 22px !important;
      width: 100% !important;
      text-align: left !important;
    }
    .captcha-error.visible {
      opacity: 1 !important;
      visibility: visible !important;
    }
    /* Character counter positioning */
    .character-counter {
      position: absolute !important;
      right: 5px !important;
      bottom: -22px !important;
      margin-top: 2px !important;
      text-align: right !important;
      z-index: 10 !important;
    }
  `;
  document.head.appendChild(style);
  
  // Create character counter for message field
  const messageContainer = messageInput.parentNode;
  const characterCounter = document.createElement('div');
  characterCounter.className = 'character-counter';
  characterCounter.style.color = 'white';
  characterCounter.style.fontSize = '0.8rem';
  characterCounter.style.textAlign = 'right';
  characterCounter.style.position = 'absolute';
  characterCounter.style.right = '0';
  characterCounter.style.bottom = '-22px';
  characterCounter.style.zIndex = '10';
  characterCounter.textContent = '0/1000 characters';
  messageContainer.appendChild(characterCounter);
  
  // Create error messages with white text for all fields (positioned absolutely)
  function createErrorMessage(input, message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'invalid-feedback';
    errorMsg.textContent = message;
    errorMsg.style.color = 'white';
    errorMsg.style.fontSize = '0.8rem';
    
    // Special handling for name, email, and phone fields
    if (input.id === 'name' || input.id === 'email' || input.id === 'phone') {
      errorMsg.style.textAlign = 'center';
    } else {
      errorMsg.style.textAlign = 'left';
    }
    
    errorMsg.style.padding = '2px 0';
    errorMsg.style.position = 'absolute';
    errorMsg.style.bottom = '-22px';
    errorMsg.style.left = '0';
    errorMsg.style.width = '100%';
    errorMsg.style.zIndex = '10';
    
    // Add !important to crucial styles
    const importantStyles = `
      .invalid-feedback {
        position: absolute !important;
        bottom: -22px !important;
        z-index: 10 !important;
      }
      #name + .invalid-feedback, #email + .invalid-feedback, #phone + .invalid-feedback {
        text-align: center !important;
        left: 0 !important;
      }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = importantStyles;
    document.head.appendChild(styleEl);
    
    // Insert right after input
    input.insertAdjacentElement('afterend', errorMsg);
    return errorMsg;
  }
  
  // Create error messages for all fields
  const nameErrorMsg = createErrorMessage(nameInput, 'Please enter your full name');
  const emailErrorMsg = createErrorMessage(emailInput, 'Please enter a valid email address');
  const phoneErrorMsg = createErrorMessage(phoneInput, 'Please enter a valid phone number');
  const messageErrorMsg = createErrorMessage(messageInput, 'Please enter a message');
  
  // Create captcha error message
  const captchaErrorMsg = document.createElement('div');
  captchaErrorMsg.className = 'captcha-error';
  captchaErrorMsg.textContent = 'Please complete the captcha';
  captchaErrorMsg.style.color = 'white';
  captchaErrorMsg.style.fontSize = '0.8rem';
  captchaErrorMsg.style.padding = '2px 0';
  captchaErrorMsg.style.letterSpacing = '0.2px';
  captchaErrorMsg.style.textAlign = 'left';
  captchaErrorMsg.style.position = 'absolute';
  captchaErrorMsg.style.bottom = '-22px';
  captchaErrorMsg.style.left = '5px';
  captchaErrorMsg.style.width = '100%';
  captchaErrorMsg.style.zIndex = '10';
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
      captchaErrorMsg.classList.add('visible');
    } else {
      captchaErrorMsg.classList.remove('visible');
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
    characterCounter.textContent = `${currentLength}/${maxLength} characters`;
    
    // Change color based on length (updated to be more visible)
    if (currentLength > maxLength * 0.9) {
      // Getting close to limit - make it yellow
      characterCounter.style.color = '#ffc107';
    } else if (currentLength < 10) {
      // Too short - keep it white but user knows it's not valid
      characterCounter.style.color = 'white';
    } else {
      // Good length - make it green
      characterCounter.style.color = '#28a745';
    }
    
    // Ensure the counter stays outside the textarea
    characterCounter.style.bottom = '-22px';
  }
  
  // Modified function to show error messages
  function showErrorMessage(errorMsg, message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('visible');
    
    // Ensure proper positioning based on input type
    if (errorMsg.previousElementSibling) {
      const inputId = errorMsg.previousElementSibling.id;
      if (inputId === 'name' || inputId === 'email' || inputId === 'phone') {
        errorMsg.style.textAlign = 'center';
        errorMsg.style.left = '0';
      } else if (inputId === 'message') {
        errorMsg.style.textAlign = 'left';
        errorMsg.style.left = '5px';
      }
    }
  }
  
  // Modified function to hide error messages
  function hideErrorMessage(errorMsg) {
    errorMsg.classList.remove('visible');
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
      showErrorMessage(nameErrorMsg, 'Please enter your name');
    } else if (this.value.length < 2) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      showErrorMessage(nameErrorMsg, 'Name must contain at least 2 characters');
    } else if (this.value.length > 50) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      showErrorMessage(nameErrorMsg, 'Name must not exceed 50 characters');
    } else if (!validateName(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      showErrorMessage(nameErrorMsg, 'Name may only contain letters, spaces, hyphens, or apostrophes');
    } else {
      this.classList.add('is-valid');
      this.classList.remove('is-invalid');
      hideErrorMessage(nameErrorMsg);
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
      showErrorMessage(phoneErrorMsg, 'Please enter your phone number');
    } else if (!validatePhone(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      showErrorMessage(phoneErrorMsg, 'Please enter a valid phone number');
    } else {
      this.classList.add('is-valid');
      this.classList.remove('is-invalid');
      hideErrorMessage(phoneErrorMsg);
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
      showErrorMessage(messageErrorMsg, 'Please enter a message');
    } else if (this.value.trim().length < 10) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      showErrorMessage(messageErrorMsg, 'Message must contain at least 10 characters');
    } else if (this.value.length > 1000) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      showErrorMessage(messageErrorMsg, 'Message must not exceed 1000 characters');
    } else {
      this.classList.add('is-valid');
      this.classList.remove('is-invalid');
      hideErrorMessage(messageErrorMsg);
    }
  });
  
  // Special validation for email (required + format)
  emailInput.addEventListener('input', function() {
    if (!validateRequired(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      showErrorMessage(emailErrorMsg, 'Please enter your email address');
    } else if (!validateEmail(this.value)) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
      showErrorMessage(emailErrorMsg, 'Please enter a valid email address');
    } else {
      this.classList.add('is-valid');
      this.classList.remove('is-invalid');
      hideErrorMessage(emailErrorMsg);
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
      showErrorMessage(nameErrorMsg, 'Please enter a valid name');
      isValid = false;
    }
    
    // Validate email
    if (!validateRequired(emailInput.value) || !validateEmail(emailInput.value)) {
      emailInput.classList.add('is-invalid');
      showErrorMessage(emailErrorMsg, 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate phone
    if (!validateRequired(phoneInput.value) || !validatePhone(phoneInput.value)) {
      phoneInput.classList.add('is-invalid');
      showErrorMessage(phoneErrorMsg, 'Please enter a valid phone number');
      isValid = false;
    }
    
    // Validate message
    if (!validateRequired(messageInput.value) || !validateMessage(messageInput.value)) {
      messageInput.classList.add('is-invalid');
      showErrorMessage(messageErrorMsg, 'Please enter a valid message (10–1000 characters)');
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
    button.innerHTML = 'Sending...';
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
        alert('Message sent successfully! We will contact you shortly.');
        contactForm.reset(); // Reset the form
        
        // Reset reCAPTCHA
        grecaptcha.reset();
        
        // Reset character counter
        updateCharacterCounter();
        
        // Remove validation classes and hide error messages
        document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
          el.classList.remove('is-valid', 'is-invalid');
        });
        
        document.querySelectorAll('.invalid-feedback').forEach(el => {
          el.classList.remove('visible');
        });
        
        // Hide captcha error message
        captchaErrorMsg.classList.remove('visible');
        
        // Reset button
        button.innerHTML = originalButtonText;
        button.disabled = false;
      }, function(error) {
        // Error handling
        console.log('Error:', error);
        alert('There was an issue sending your message. Please try again.');
        
        // Reset button
        button.innerHTML = originalButtonText;
        button.disabled = false;
      });
  });
});

/**
 * Add this JavaScript to fix the tools section circle on mobile
 * This should be added to your existing JavaScript files
 */
document.addEventListener('DOMContentLoaded', function() {
  // Check if mobile view
  function isMobile() {
    return window.innerWidth <= 991;
  }
  
  // The original animation function reference
  let originalAnimateBoxes = null;
  
  // Function to stop circle animation on mobile
  function handleMobileView() {
    const boxes = document.querySelectorAll('.despliegue-info-box');
    
    if (isMobile()) {
      // Capture the original function if we haven't already
      if (!originalAnimateBoxes && window.animateBoxes) {
        originalAnimateBoxes = window.animateBoxes;
      }
      
      // Override the animation function
      window.animateBoxes = function() {
        // Do nothing on mobile
      };
      
      // Force position static on all boxes
      boxes.forEach(box => {
        box.style.position = 'static';
        box.style.left = 'auto';
        box.style.top = 'auto';
        box.style.transform = 'none';
      });
    } else {
      // Restore original function if available
      if (originalAnimateBoxes) {
        window.animateBoxes = originalAnimateBoxes;
        
        // Run it once
        window.animateBoxes();
      }
    }
  }
  
  // Run on page load
  handleMobileView();
  
  // Run on window resize
  window.addEventListener('resize', handleMobileView);
});


document.addEventListener('DOMContentLoaded', function() {
  // Function to check viewport width and update arrow
  function updateArrow() {
    const arrowElement = document.querySelector('.somosv-arrow');
    if (arrowElement) {
      if (window.innerWidth <= 991) {
        // Mobile view - downward arrow
        arrowElement.textContent = '↓';
      } else {
        // Desktop view - rightward arrow
        arrowElement.textContent = '→';
      }
    }
  }
  
  // Run on page load
  updateArrow();
  
  // Run when window is resized
  window.addEventListener('resize', updateArrow);
});

// TITULOS CHETOS

document.addEventListener('DOMContentLoaded', function() {
  // Select all console title elements
  const titles = document.querySelectorAll('.titulo-console');
  
  // Set up Intersection Observer to detect when titles are visible
  setupScrollObserver();
  
  // Handle window resize
  window.addEventListener('resize', function() {
      titles.forEach(title => {
          if (window.innerWidth <= 991) {
              title.style.fontSize = '1.1rem';
          } else {
              title.style.fontSize = '1.4rem';
          }
      });
  });
});

// Function to set up the Intersection Observer
function setupScrollObserver() {
  const options = {
      root: null, // use viewport
      rootMargin: '0px',
      threshold: 0.3 // trigger when 30% of the element is visible
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          // Check if element is intersecting (visible)
          if (entry.isIntersecting) {
              const title = entry.target;
              
              // If the element hasn't been animated yet
              if (!title.dataset.animated || title.dataset.animated === 'false') {
                  // Animate the title
                  animateTitle(title, 500);
                  
                  // Mark as animated
                  title.dataset.animated = 'true';
              }
              
              // Optional: unobserve if you only want to animate once
              // observer.unobserve(title);
          }
      });
  }, options);
  
  // Observe all titles
  document.querySelectorAll('.titulo-console').forEach(title => {
      observer.observe(title);
  });
}

// Function to reset animations
function resetAnimation() {
  const titles = document.querySelectorAll('.titulo-console');
  
  titles.forEach(title => {
      // Clear any existing intervals for this element
      if (title.blinkIntervalId) {
          clearInterval(title.blinkIntervalId);
          title.blinkIntervalId = null;
      }
      
      title.innerHTML = '';
      title.classList.remove('titulo-cursor-blink');
      
      // Reset the animated state
      title.dataset.animated = 'false';
  });
  
  // Re-observe all titles
  setupScrollObserver();
}

// Function to animate a title
function animateTitle(title, delay) {
  if (!title) return;
  
  // Get the text from data attribute
  const fullText = title.getAttribute('data-text');
  
  // Extract the important part based on the id
  let importantPart = '';
  let pathPart = '';
  let extensionPart = '';
  
  switch(title.id) {
      case 'sobre-akroma':
          pathPart = 'cat /home/akroma/';
          importantPart = 'About_Akroma';
          extensionPart = '.txt';
          break;
      case 'future': // Changed from 'futuro' to 'future'
          pathPart = 'cat /home/akroma/';
          importantPart = 'Future';
          extensionPart = '.txt';
          break;
      case 'soporte':
          pathPart = 'C:\\services\\';
          importantPart = 'Support and Implementation';
          extensionPart = '.xlsx';
          break;
      case 'despliegue':
          pathPart = 'C:\\services\\';
          importantPart = 'Deployment of IT Solutions and Tools';
          extensionPart = '.exe';
          break;
      case 'consultoria':
          pathPart = 'C:\\servicios\\';
          importantPart = 'Consultoría Informática y Capacitación';
          extensionPart = '.docx';
          break;
  }
  
  // Clear any existing content and intervals
  title.innerHTML = '';
  if (title.blinkIntervalId) {
      clearInterval(title.blinkIntervalId);
      title.blinkIntervalId = null;
  }
  title.classList.remove('titulo-cursor-blink');
  
  // Set base font-weight to 200
  title.style.fontWeight = '200';
  
  // Start animation after delay
  setTimeout(() => {
      // Create elements for each part
      const pathElement = document.createElement('span');
      const importantElement = document.createElement('span');
      const extensionElement = document.createElement('span');
      
      // Set styles
      pathElement.style.fontWeight = '200';
      importantElement.style.fontWeight = '700'; // Bold weight for important part
      extensionElement.style.fontWeight = '200';
      
      // Append elements to title
      title.appendChild(pathElement);
      title.appendChild(importantElement);
      title.appendChild(extensionElement);
      
      // Type path part
      let pathIndex = 0;
      const typePath = setInterval(() => {
          if (pathIndex < pathPart.length) {
              pathElement.textContent += pathPart.charAt(pathIndex);
              pathIndex++;
          } else {
              clearInterval(typePath);
              
              // Type important part (bold)
              let importantIndex = 0;
              const typeImportant = setInterval(() => {
                  if (importantIndex < importantPart.length) {
                      importantElement.textContent += importantPart.charAt(importantIndex);
                      importantIndex++;
                  } else {
                      clearInterval(typeImportant);
                      
                      // Type extension part
                      let extensionIndex = 0;
                      const typeExtension = setInterval(() => {
                          if (extensionIndex < extensionPart.length) {
                              extensionElement.textContent += extensionPart.charAt(extensionIndex);
                              extensionIndex++;
                          } else {
                              clearInterval(typeExtension);
                              
                              // Add blinking cursor class once typing is complete
                              title.classList.add('titulo-cursor-blink');
                              
                              // Count blinks and remove cursor after 10 blinks
                              let blinkCount = 0;
                              title.blinkIntervalId = setInterval(() => {
                                  blinkCount++;
                                  
                                  if (blinkCount >= 10) {
                                      clearInterval(title.blinkIntervalId);
                                      title.classList.remove('titulo-cursor-blink');
                                  }
                              }, 800); // Each blink is about 800ms (full cycle)
                          }
                      }, 50);
                  }
              }, 50);
          }
      }, 50);
  }, delay);
}
