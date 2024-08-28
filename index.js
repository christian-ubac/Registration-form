const regionSelect = document.getElementById("region");
const provinceSelect = document.getElementById("province");
const cityMunicipalitySelect = document.getElementById("cityMunicipality");
const barangaySelect = document.getElementById("barangay");
const registrationForm = document.getElementById("registrationForm");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const modal = document.getElementById("customModal");
const modalMessage = document.getElementById("modalMessage");
const closeModal = document.querySelector(".close");

function showModal(message) {
  modalMessage.textContent = message;
  modal.style.display = "block";
}

closeModal.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  fetchRegions();
});

function fetchRegions() {
  fetch("https://psgc.gitlab.io/api/regions/")
    .then((response) => response.json())
    .then((data) => {
      populateDropdown(regionSelect, data, "regionName", "code");
    })
    .catch((error) => console.error("Error fetching regions:", error));
}

regionSelect.addEventListener("change", () => {
  const regionCode = regionSelect.value;
  if (regionCode) {
    fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`)
      .then((response) => response.json())
      .then((data) => {
        populateDropdown(provinceSelect, data, "name", "code");
        resetDropdown(cityMunicipalitySelect);
        resetDropdown(barangaySelect);
      })
      .catch((error) => console.error("Error fetching provinces:", error));
  } else {
    resetDropdown(provinceSelect);
    resetDropdown(cityMunicipalitySelect);
    resetDropdown(barangaySelect);
  }
});

provinceSelect.addEventListener("change", () => {
  const provinceCode = provinceSelect.value;
  if (provinceCode) {
    fetch(
      `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`
    )
      .then((response) => response.json())
      .then((data) => {
        populateDropdown(cityMunicipalitySelect, data, "name", "code");
        resetDropdown(barangaySelect);
      })
      .catch((error) =>
        console.error("Error fetching cities/municipalities:", error)
      );
  } else {
    resetDropdown(cityMunicipalitySelect);
    resetDropdown(barangaySelect);
  }
});

cityMunicipalitySelect.addEventListener("change", () => {
  const cityMunicipalityCode = cityMunicipalitySelect.value;
  if (cityMunicipalityCode) {
    fetch(
      `https://psgc.gitlab.io/api/cities-municipalities/${cityMunicipalityCode}/barangays/`
    )
      .then((response) => response.json())
      .then((data) => {
        populateDropdown(barangaySelect, data, "name", "code");
      })
      .catch((error) => console.error("Error fetching barangays:", error));
  } else {
    resetDropdown(barangaySelect);
  }
});

function populateDropdown(dropdown, data, textKey, valueKey) {
  resetDropdown(dropdown);
  data.forEach((item) => {
    const option = document.createElement("option");
    option.text = item[textKey];
    option.value = item[valueKey];
    dropdown.add(option);
  });
}

function resetDropdown(dropdown) {
  dropdown.innerHTML = '<option value="">Select an option</option>';
}

registrationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password !== confirmPassword) {
    showModal("Passwords do not match.");
    return;
  }

  if (registrationForm.checkValidity()) {
    showModal("You have registered Successfully.");
    registrationForm.reset();
    resetDropdown(provinceSelect);
    resetDropdown(cityMunicipalitySelect);
    resetDropdown(barangaySelect);
  } else {
    showModal("Please fill out all required fields.");
  }
});
