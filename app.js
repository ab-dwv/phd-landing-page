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

const enquiryForm = document.getElementById("enquiry-form");
const confirmation = document.getElementById("confirmation");
const enquiryPanel = document.querySelector(".enquiry");

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;
  enquiryPanel.style.minHeight = enquiryPanel.offsetHeight + "px";
  enquiryForm.hidden = true;
  confirmation.hidden = false;
  confirmation.querySelector("h3").focus();
});

document.getElementById("edit-enquiry").addEventListener("click", () => {
  confirmation.hidden = true;
  enquiryForm.hidden = false;
  enquiryPanel.style.minHeight = "";
  document.getElementById("full-name").focus();
});