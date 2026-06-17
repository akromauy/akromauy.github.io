document.addEventListener('DOMContentLoaded', function () {
  emailjs.init("V0viZiGwRhS9vRhZN");

  const contactForm        = document.getElementById('contact-form');
  const nameInput          = document.getElementById('name');
  const emailInput         = document.getElementById('email');
  const phoneInput         = document.getElementById('phone');
  const messageInput       = document.getElementById('message');
  const submitButton       = document.getElementById('button');
  const recaptchaContainer = document.querySelector('.g-recaptcha');

  /* ── Input parent spacing ── */
  document.querySelectorAll('.form-control').forEach(el => {
    el.parentNode.style.position     = 'relative';
    el.parentNode.style.marginBottom = '25px';
  });

  /* ── Attribute setup ── */
  nameInput.setAttribute('autocomplete', 'name');
  nameInput.setAttribute('placeholder',  'e.g. John Smith');
  phoneInput.setAttribute('type',         'tel');
  phoneInput.setAttribute('autocomplete', 'tel');
  phoneInput.setAttribute('placeholder',  'e.g. +1 234 567 8901');
  messageInput.setAttribute('autocomplete', 'off');
  messageInput.setAttribute('placeholder',  'How can we help you?');
  messageInput.setAttribute('maxlength',    '1000');

  /* ── Character counter ── */
  const characterCounter = document.createElement('div');
  characterCounter.className = 'character-counter';
  characterCounter.textContent = '0/1000 characters';
  messageInput.parentNode.appendChild(characterCounter);

  function updateCharacterCounter() {
    const len = messageInput.value.length;
    characterCounter.textContent = `${len}/1000 characters`;
    characterCounter.style.color = len > 900 ? '#ffc107' : len >= 10 ? '#28a745' : 'white';
  }
  updateCharacterCounter();

  /* ── Error messages ── */
  function createErrorMessage(input, message) {
    const el = document.createElement('div');
    el.className   = 'invalid-feedback';
    el.textContent = message;
    input.insertAdjacentElement('afterend', el);
    return el;
  }

  const nameErrorMsg    = createErrorMessage(nameInput,    'Please enter your full name');
  const emailErrorMsg   = createErrorMessage(emailInput,   'Please enter a valid email address');
  const phoneErrorMsg   = createErrorMessage(phoneInput,   'Please enter a valid phone number');
  const messageErrorMsg = createErrorMessage(messageInput, 'Please enter a message');

  const captchaErrorMsg = document.createElement('div');
  captchaErrorMsg.className   = 'captcha-error';
  captchaErrorMsg.textContent = 'Please complete the captcha';
  recaptchaContainer.parentNode.insertBefore(captchaErrorMsg, recaptchaContainer.nextSibling);

  /* ── Validation ── */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateEmail(v)   { return emailRegex.test(v); }
  function validateName(v)    { return /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/.test(v); }
  function validatePhone(v)   { const d = v.replace(/\D/g,''); return d.length >= 7 && d.length <= 15; }
  function validateMessage(v) { const t = v.trim(); return t.length >= 10 && t.length <= 1000; }

  function validateRecaptcha() {
    const ok = grecaptcha.getResponse().length !== 0;
    captchaErrorMsg.classList.toggle('visible', !ok);
    return ok;
  }

  function sanitize(s) {
    return s.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  /* ── Formatting ── */
  function formatName(val)  { return val.replace(/\b\w/g, c => c.toUpperCase()); }

  function formatPhone(val) {
    const plus   = val.startsWith('+');
    const digits = val.replace(/\D/g,'');
    let result   = plus ? '+' : '';
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 3 === 0) result += ' ';
      result += digits[i];
    }
    return result;
  }

  /* ── Error display ── */
  function showError(el, msg) { el.textContent = msg; el.classList.add('visible'); }
  function hideError(el)      { el.classList.remove('visible'); }
  function setValidity(input, valid) {
    input.classList.toggle('is-valid',   valid);
    input.classList.toggle('is-invalid', !valid);
  }

  /* ── Live validation ── */
  nameInput.addEventListener('input', function () {
    const cursor    = this.selectionStart;
    const prevLen   = this.value.length;
    const formatted = formatName(this.value);
    if (this.value !== formatted) {
      this.value = formatted;
      const diff = this.value.length - prevLen;
      this.setSelectionRange(cursor + diff, cursor + diff);
    }
    if (!this.value.trim())             { setValidity(this,false); showError(nameErrorMsg,'Please enter your name'); }
    else if (this.value.length < 2)     { setValidity(this,false); showError(nameErrorMsg,'Name must contain at least 2 characters'); }
    else if (this.value.length > 50)    { setValidity(this,false); showError(nameErrorMsg,'Name must not exceed 50 characters'); }
    else if (!validateName(this.value)) { setValidity(this,false); showError(nameErrorMsg,'Only letters, spaces, hyphens, or apostrophes'); }
    else                                { setValidity(this,true);  hideError(nameErrorMsg); }
  });

  phoneInput.addEventListener('input', function () {
    const cursor  = this.selectionStart;
    const prevLen = this.value.length;
    this.value    = formatPhone(this.value);
    const diff    = this.value.length - prevLen;
    this.setSelectionRange(cursor + diff, cursor + diff);
    if (!this.value.trim())              { setValidity(this,false); showError(phoneErrorMsg,'Please enter your phone number'); }
    else if (!validatePhone(this.value)) { setValidity(this,false); showError(phoneErrorMsg,'Please enter a valid phone number'); }
    else                                 { setValidity(this,true);  hideError(phoneErrorMsg); }
  });

  emailInput.addEventListener('input', function () {
    if (!this.value.trim())              { setValidity(this,false); showError(emailErrorMsg,'Please enter your email address'); }
    else if (!validateEmail(this.value)) { setValidity(this,false); showError(emailErrorMsg,'Please enter a valid email address'); }
    else                                 { setValidity(this,true);  hideError(emailErrorMsg); }
  });

  messageInput.addEventListener('input', function () {
    updateCharacterCounter();
    if (!this.value.trim())                 { setValidity(this,false); showError(messageErrorMsg,'Please enter a message'); }
    else if (this.value.trim().length < 10) { setValidity(this,false); showError(messageErrorMsg,'Message must contain at least 10 characters'); }
    else if (this.value.length > 1000)      { setValidity(this,false); showError(messageErrorMsg,'Message must not exceed 1000 characters'); }
    else                                    { setValidity(this,true);  hideError(messageErrorMsg); }
  });

  /* ── Full form validation ── */
  function validateForm() {
    let ok = true;
    if (!validateName(nameInput.value))      { setValidity(nameInput,false);    showError(nameErrorMsg,'Please enter a valid name');                              ok=false; }
    if (!validateEmail(emailInput.value))    { setValidity(emailInput,false);   showError(emailErrorMsg,'Please enter a valid email address');                    ok=false; }
    if (!validatePhone(phoneInput.value))    { setValidity(phoneInput,false);   showError(phoneErrorMsg,'Please enter a valid phone number');                     ok=false; }
    if (!validateMessage(messageInput.value)){ setValidity(messageInput,false); showError(messageErrorMsg,'Please enter a valid message (10–1000 characters)');   ok=false; }
    if (!validateRecaptcha()) ok = false;
    return ok;
  }

  /* ── Submit ── */
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const origText       = submitButton.innerHTML;
    submitButton.innerHTML = 'Sending...';
    submitButton.disabled  = true;

    emailjs.send('service_826nt3j', 'template_j30b93a', {
      name:                   sanitize(nameInput.value.trim()),
      email:                  sanitize(emailInput.value.trim()),
      phone:                  sanitize(phoneInput.value.trim()),
      message:                sanitize(messageInput.value.trim()),
      'g-recaptcha-response': grecaptcha.getResponse()
    }).then(function () {
      alert('Message sent successfully! We will contact you shortly.');
      contactForm.reset();
      grecaptcha.reset();
      updateCharacterCounter();
      document.querySelectorAll('.is-valid,.is-invalid').forEach(el => el.classList.remove('is-valid','is-invalid'));
      document.querySelectorAll('.invalid-feedback').forEach(el => el.classList.remove('visible'));
      captchaErrorMsg.classList.remove('visible');
      submitButton.innerHTML = origText;
      submitButton.disabled  = false;
    }, function (err) {
      console.error('EmailJS error:', err);
      alert('There was an issue sending your message. Please try again.');
      submitButton.innerHTML = origText;
      submitButton.disabled  = false;
    });
  });
});
