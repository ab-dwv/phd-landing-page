// Frontend-only flow: personal details are never stored or sent automatically.
const form = document.querySelector('#enquiry-form');
const nextStep = document.querySelector('#enquiry-next');
const states = ['Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];
for (const state of states) document.querySelector('#state').add(new Option(state, state));
const messages = {name:'Please enter your full name.',email:'Please enter a valid email address.',phone:'Enter a 10-digit mobile number starting with 6–9.',state:'Please select your state or union territory.',area:'Please choose a research area.',consent:'Please agree to be contacted to continue.'};
const controls = [...form.querySelectorAll('input, select')];
function validate(control) {
  let valid = control.type === 'checkbox' ? control.checked : Boolean(control.value.trim());
  if (valid && control.name === 'name') valid = control.value.trim().length >= 2;
  if (valid && control.name === 'email') valid = control.validity.valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value.trim());
  if (valid && control.name === 'phone') valid = /^[6-9]\d{9}$/.test(control.value);
  const error = document.getElementById(`${control.name}-error`);
  error.textContent = valid ? '' : messages[control.name]; error.hidden = valid;
  control.setAttribute('aria-invalid', String(!valid)); return valid;
}
for (const control of controls) {
  control.addEventListener('blur', () => {if (control.value || control.dataset.touched) validate(control); control.dataset.touched = 'true';});
  for (const event of ['input','change']) control.addEventListener(event, () => {if (control.getAttribute('aria-invalid') === 'true') validate(control);});
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const valid = controls.map(validate).every(Boolean);
  if (!valid) {controls.find(control => control.getAttribute('aria-invalid') === 'true').focus(); return;}
  const data = Object.fromEntries(new FormData(form));
  const body = `Dear Ph.D. Admissions Team,\n\nI would like guidance on Ph.D. admissions at Sharda University.\n\nName: ${data.name.trim()}\nEmail: ${data.email.trim()}\nMobile: +91 ${data.phone}\nState / UT: ${data.state}\nResearch interest: ${data.area}\n\nPlease share the available research areas, eligibility requirements and upcoming intake details.\n\nI agree to be contacted by Sharda University about my enquiry.\n\nThank you,\n${data.name.trim()}`;
  document.querySelector('#email-enquiry').href = `mailto:phd.rdc@sharda.ac.in?subject=${encodeURIComponent('Ph.D. admissions enquiry — ' + data.name.trim())}&body=${encodeURIComponent(body)}`;
  form.hidden = true; nextStep.hidden = false; nextStep.focus({preventScroll:true});
});
document.querySelector('#edit-enquiry').addEventListener('click', () => {nextStep.hidden = true; form.hidden = false; document.querySelector('#full-name').focus({preventScroll:true});});
document.querySelector('.story-cta').addEventListener('click', () => {requestAnimationFrame(() => (form.hidden ? nextStep : document.querySelector('#full-name')).focus({preventScroll:true}));});
