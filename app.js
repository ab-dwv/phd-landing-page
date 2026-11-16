const photoButtons = Array.from(document.querySelectorAll("[data-photo]"));
const scenes = document.querySelectorAll("[data-scene]");
const photoNumber = document.querySelector(".photo-count b");
const photoCaption = document.querySelector(".photo-caption");

function selectPhoto(button, index) {
  for (const scene of scenes) {
    scene.classList.toggle("is-active", scene.dataset.scene === button.dataset.photo);
  }
  for (const thumbnail of photoButtons) {
    thumbnail.setAttribute("aria-pressed", String(thumbnail === button));
  }
  photoNumber.textContent = String(index + 1).padStart(2, "0");
  photoCaption.textContent = button.dataset.caption;
}

photoButtons.forEach((button, index) => {
  button.addEventListener("click", () => selectPhoto(button, index));
  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + photoButtons.length) % photoButtons.length;
    photoButtons[nextIndex].focus();
    selectPhoto(photoButtons[nextIndex], nextIndex);
  });
});

// Programme names follow Sharda University's doctoral catalogue.
const specializationsByDiscipline = {
  "Computing Science & Engineering": ["Computer Science & Engineering", "Computer Science & Applications"],
  "Engineering and Science": [
    "Mechanical Engineering", "Civil Engineering", "Electrical & Electronics Engineering",
    "Electronics & Communication Engineering", "Physics", "Chemistry", "Biochemistry",
    "Mathematics", "Statistics", "Data Analytics", "Environmental Science"
  ],
  "Management": [
    "Business Economics", "Finance Management", "General Management", "Human Resource Management",
    "International Business", "Marketing and Brand Management", "Operations and Supply Chain Management"
  ],
  "Humanities & Social Sciences": ["Economics", "English", "History", "Political Science", "Psychology", "Sociology"],
  "Mass Communication": ["Mass Communication"],
  "Design": ["Design"],
  "Pharmacy": ["Pharmacy"],
  "Bio-Science and Technology": ["Life Science", "Biotechnology", "Food Science and Technology"],
  "Allied Health Sciences": ["Physiotherapy", "Forensic Science", "Nutrition and Dietetics", "Clinical Research"],
  "Law": ["Law"],
  "Dental": ["Dental Sciences"],
  "Nursing": ["Nursing"],
  "Medical": ["Anatomy", "Biochemistry"]
};

const applicationForm = document.getElementById("enquiry-form");
const fields = applicationForm.elements;

function linkDropdowns(parent, child, optionsByParent) {
  const placeholder = child.options[0];

  for (const name of Object.keys(optionsByParent)) {
    parent.add(new Option(name, name));
  }

  function updateChoices() {
    const choices = optionsByParent[parent.value] || [];
    child.replaceChildren(placeholder, ...choices.map(name => new Option(name, name)));
    child.value = "";
    child.disabled = choices.length === 0;
  }

  parent.addEventListener("change", updateChoices);
  updateChoices();
}

linkDropdowns(fields.state, fields.city, citiesByState);
linkDropdowns(fields.discipline, fields.specialization, specializationsByDiscipline);

applicationForm.addEventListener("submit", event => {
  event.preventDefault();
  applicationForm.querySelector(".application-status").textContent =
    "Applications for this intake are closed. No application has been submitted.";
});
