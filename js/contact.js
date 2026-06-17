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
  nameInput.setAttribute('placeholder',  'ej. Juan Pérez');
  phoneInput.setAttribute('type',         'tel');
  phoneInput.setAttribute('autocomplete', 'tel');
  phoneInput.setAttribute('placeholder',  'ej. +598 92 000 000');
  messageInput.setAttribute('autocomplete', 'off');
  messageInput.setAttribute('placeholder',  '¿Cómo te podemos ayudar?');
  messageInput.setAttribute('maxlength',    '1000');

  /* ── Character counter ── */
  const characterCounter = document.createElement('div');
  characterCounter.className = 'character-counter';
  characterCounter.textContent = '0/1000 caracteres';
  messageInput.parentNode.appendChild(characterCounter);

  function updateCharacterCounter() {
    const len = messageInput.value.length;
    characterCounter.textContent = `${len}/1000 caracteres`;
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

  const nameErrorMsg    = createErrorMessage(nameInput,    'Por favor ingresa tu nombre completo');
  const emailErrorMsg   = createErrorMessage(emailInput,   'Por favor ingresa un email válido');
  const phoneErrorMsg   = createErrorMessage(phoneInput,   'Por favor ingresa un número de teléfono válido');
  const messageErrorMsg = createErrorMessage(messageInput, 'Por favor ingresa un mensaje');

  const captchaErrorMsg = document.createElement('div');
  captchaErrorMsg.className   = 'captcha-error';
  captchaErrorMsg.textContent = 'Por favor completa el captcha';
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
    if (!this.value.trim())             { setValidity(this,false); showError(nameErrorMsg,'Por favor ingresa tu nombre'); }
    else if (this.value.length < 2)     { setValidity(this,false); showError(nameErrorMsg,'El nombre debe tener al menos 2 caracteres'); }
    else if (this.value.length > 50)    { setValidity(this,false); showError(nameErrorMsg,'El nombre no debe exceder los 50 caracteres'); }
    else if (!validateName(this.value)) { setValidity(this,false); showError(nameErrorMsg,'Solo letras, espacios, guiones o apóstrofes'); }
    else                                { setValidity(this,true);  hideError(nameErrorMsg); }
  });

  phoneInput.addEventListener('input', function () {
    const cursor  = this.selectionStart;
    const prevLen = this.value.length;
    this.value    = formatPhone(this.value);
    const diff    = this.value.length - prevLen;
    this.setSelectionRange(cursor + diff, cursor + diff);
    if (!this.value.trim())              { setValidity(this,false); showError(phoneErrorMsg,'Por favor ingresa un número de teléfono'); }
    else if (!validatePhone(this.value)) { setValidity(this,false); showError(phoneErrorMsg,'Por favor ingresa un número válido'); }
    else                                 { setValidity(this,true);  hideError(phoneErrorMsg); }
  });

  emailInput.addEventListener('input', function () {
    if (!this.value.trim())              { setValidity(this,false); showError(emailErrorMsg,'Por favor ingresa tu email'); }
    else if (!validateEmail(this.value)) { setValidity(this,false); showError(emailErrorMsg,'Por favor ingresa un email válido'); }
    else                                 { setValidity(this,true);  hideError(emailErrorMsg); }
  });

  messageInput.addEventListener('input', function () {
    updateCharacterCounter();
    if (!this.value.trim())                 { setValidity(this,false); showError(messageErrorMsg,'Por favor ingresa un mensaje'); }
    else if (this.value.trim().length < 10) { setValidity(this,false); showError(messageErrorMsg,'El mensaje debe tener al menos 10 caracteres'); }
    else if (this.value.length > 1000)      { setValidity(this,false); showError(messageErrorMsg,'El mensaje no debe exceder los 1000 caracteres'); }
    else                                    { setValidity(this,true);  hideError(messageErrorMsg); }
  });

  /* ── Full form validation ── */
  function validateForm() {
    let ok = true;
    if (!validateName(nameInput.value))      { setValidity(nameInput,false);    showError(nameErrorMsg,'Por favor ingresa un nombre válido');                       ok=false; }
    if (!validateEmail(emailInput.value))    { setValidity(emailInput,false);   showError(emailErrorMsg,'Por favor ingresa un email válido');                       ok=false; }
    if (!validatePhone(phoneInput.value))    { setValidity(phoneInput,false);   showError(phoneErrorMsg,'Por favor ingresa un teléfono válido');                    ok=false; }
    if (!validateMessage(messageInput.value)){ setValidity(messageInput,false); showError(messageErrorMsg,'Por favor ingresa un mensaje válido (10-1000 caracteres)'); ok=false; }
    if (!validateRecaptcha()) ok = false;
    return ok;
  }

  /* ── Submit ── */
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const origText       = submitButton.innerHTML;
    submitButton.innerHTML = 'Enviando...';
    submitButton.disabled  = true;

    emailjs.send('service_826nt3j', 'template_j30b93a', {
      name:                   sanitize(nameInput.value.trim()),
      email:                  sanitize(emailInput.value.trim()),
      phone:                  sanitize(phoneInput.value.trim()),
      message:                sanitize(messageInput.value.trim()),
      'g-recaptcha-response': grecaptcha.getResponse()
    }).then(function () {
      alert('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.');
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
      alert('Hubo un problema al enviar el mensaje. Por favor, inténtalo nuevamente.');
      submitButton.innerHTML = origText;
      submitButton.disabled  = false;
    });
  });
});
