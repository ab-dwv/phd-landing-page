const qualifications = ['Four-year bachelor’s degree with research', 'Master’s degree', 'M.Phil.', 'Other'];
const disciplines = ['Engineering & science', 'Basic sciences', 'Humanities & social sciences', 'Other / to be confirmed'];
const states = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'];
const options = values => values.map(value => `<option value="${value}">${value}</option>`).join('');
function renderForm(container) {
  const id = container.dataset.enquiryForm;
  const field = (name, label, control, full = false) => `<div class="field${full ? ' full' : ''}"><label for="${id}-${name}">${label} *</label>${control}<p class="error" id="${id}-${name}-error" hidden></p></div>`;
  const input = (name, type, autocomplete, placeholder, extra = '') => `<input id="${id}-${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" placeholder="${placeholder}" aria-describedby="${id}-${name}-error" required ${extra}>`;
  const select = (name, placeholder, values, autocomplete = 'off') => `<select id="${id}-${name}" name="${name}" autocomplete="${autocomplete}" aria-describedby="${id}-${name}-error" required><option value="" selected disabled>${placeholder}</option>${options(values)}</select>`;
  container.innerHTML = `<form novalidate>
    <div class="form-grid">
      ${field('name','Full name',input('name','text','name','Your full name'),true)}
      ${field('mobile','Mobile number',input('mobile','tel','tel-national','10-digit mobile number','inputmode="numeric" maxlength="10"'))}
      ${field('email','Email address',input('email','email','email','you@example.com'))}
      ${field('state','State',select('state','Select state',states,'address-level1'))}
      ${field('city','City',input('city','text','address-level2','Your city'))}
    </div>
    <label class="consent" for="${id}-consent"><input id="${id}-consent" name="consent" type="checkbox" aria-describedby="${id}-consent-error" required><span>I Authorize Sharda University to send notifications via SMS/RCS/Call/Email/Whatsapp and agree to Terms & Conditions and Privacy Policy.</span></label><p class="error" id="${id}-consent-error" hidden></p> 
    <p class="form-integration-note">Online submission is not connected yet. <a href="tel:+911204570000">Call admissions</a> or <a href="mailto:phd.rdc@sharda.ac.in">email the Ph.D. Cell</a>.</p>
    <button class="button button-red form-submit" type="submit">Apply Now <span aria-hidden="true">↗</span></button><p class="form-status" role="status" aria-live="polite"></p>
  </form>`;
  const form = container.querySelector('form');
  const messages = {name:'Please enter your full name.',mobile:'Enter a valid 10-digit Indian mobile number starting with 6–9.',email:'Enter a valid email address.',qualification:'Please select your highest qualification.',discipline:'Please select a research discipline.',state:'Please select your state.',city:'Please enter your city.',consent:'Please provide your consent.'};
  function validate(control) {
    let valid = control.type === 'checkbox' ? control.checked : Boolean(control.value.trim());
    if (valid && control.name === 'mobile') valid = /^[6-9]\d{9}$/.test(control.value.trim());
    if (valid && control.name === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value.trim());
    const error = form.querySelector(`#${id}-${control.name}-error`);
    error.textContent = valid ? '' : messages[control.name];
    error.hidden = valid;
    control.setAttribute('aria-invalid', String(!valid));
    return valid;
  }
  form.querySelectorAll('input,select').forEach(control => {
    control.addEventListener('blur', () => { if (control.dataset.touched) validate(control); });
    control.addEventListener('input', () => { control.dataset.touched = 'true'; if (control.getAttribute('aria-invalid') === 'true') validate(control); });
    control.addEventListener('change', () => { control.dataset.touched = 'true'; if (control.getAttribute('aria-invalid') === 'true') validate(control); });
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const controls = [...form.querySelectorAll('input,select')];
    const valid = controls.map(control => { control.dataset.touched = 'true'; return validate(control); }).every(Boolean);
    if (!valid) { controls.find(control => control.getAttribute('aria-invalid') === 'true')?.focus(); return; }
    const button = form.querySelector('button');
    const status = form.querySelector('.form-status');
    button.disabled = true; button.textContent = 'Sending…'; status.textContent = '';
    try {
      await submitEnquiry(Object.fromEntries(new FormData(form)));
      form.reset(); status.textContent = 'Thank you. Your enquiry has been received.';
    } catch (error) {
      status.textContent = error.message || 'We could not send your enquiry. Please try again or call us.';
    } finally { button.disabled = false; button.innerHTML = 'Submit enquiry <span aria-hidden="true">↗</span>'; }
  });
}
// TODO: Connect this function to the approved Sharda admissions endpoint. Never report success before a confirmed server response.
async function submitEnquiry(data) {
  void data;
  throw new Error('Online enquiry is not yet connected. Please call +91 120 457 0000.');
}
document.querySelectorAll('[data-enquiry-form]').forEach(renderForm);
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), {passive:true});
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.08});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

// The imagery is decorative; the pause control prevents motion from becoming a barrier.
const slideshow = document.querySelector('.hero-slideshow');
const slideshowButton = document.querySelector('.slideshow-toggle');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (slideshow && slideshowButton) {
  const slides = [...slideshow.querySelectorAll('.hero-slide')];
  let index = 0;
  let timer = null;
  let paused = false;
  function stopSlideshow() { if (timer !== null) window.clearInterval(timer); timer = null; }
  function startSlideshow() {
    stopSlideshow();
    if (paused || motionPreference.matches || document.hidden || slides.length < 2) return;
    timer = window.setInterval(() => {
      slides[index].classList.remove('is-active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('is-active');
    }, 6000);
  }
  function syncSlideshow() {
    slideshowButton.hidden = motionPreference.matches || slides.length < 2;
    slideshowButton.setAttribute('aria-pressed', String(paused));
    slideshowButton.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    slideshowButton.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
    startSlideshow();
  }
  slideshowButton.addEventListener('click', () => { paused = !paused; syncSlideshow(); });
  document.addEventListener('visibilitychange', startSlideshow);
  motionPreference.addEventListener('change', syncSlideshow);
  syncSlideshow();
}


// Accessible mobile section navigation.
const menuToggle = document.querySelector('.menu-toggle');
const sectionNav = document.querySelector('.section-nav');
if (menuToggle && sectionNav) {
  menuToggle.addEventListener('click', () => { const open = sectionNav.classList.toggle('is-open'); menuToggle.setAttribute('aria-expanded', String(open)); });
  sectionNav.addEventListener('click', e => { if (e.target.closest('a')) { sectionNav.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && sectionNav.classList.contains('is-open')) { sectionNav.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.focus(); } });
}
