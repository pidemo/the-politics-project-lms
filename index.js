const CONFIG = {
  hook: "4asr83ylmqj6mowy34uc18jdg8y2ot8a",
  selectors: {
    // basic part
    pageAtidAttribute: "page-atid",
    pageTypeAttribute: "page-type",
    pageLoader: "#page-loader",
    memberAtid: "#member-atid",
    memberMsid: "#member-msid",
    trackingTriggers: '[target-tracking="true"]',
    visualProgressBar: '[visual-progress="progress-bar"]',
    visualProgressPercentage: '[visual-progress="percentage"]',
    visualProgressConfetti: '[visual-progress="confetti"]',
    visualProgressTypeAttribute: "visual-progress-type",
    visualProgressWrapper: "[visual-progress-wrapper]",
    // quiz part
    form: "#quiz-form",
    submit: "#quiz-submit",
    submitSuccessMessage: "Answers Saved!",
    notification: "#quiz-notification",
    loader: "#quiz-loader",
  },
};

const revealAnswers = (removeRadios = false) => {
  const answers = document.querySelectorAll(".detailed-answer");
  answers.forEach((answer) => {
    answer.classList.remove("is-hidden-onload");
  });

  const options = document.querySelectorAll("[data-option-tf]");
  options.forEach((option) => {
    const optionState = option.getAttribute("data-option-tf");
    const optionChildRadio = option.querySelector(".w-radio-input");
    const isChecked = optionChildRadio.classList.contains(
      "w--redirected-checked"
    );
    if (optionState === "true") {
      // always show correct state for correct answer
      option.classList.add("is-correct");
    } else if (optionState === "false" && isChecked) {
      // show incorrect state if answer is incorrect AND checked
      option.classList.add("is-incorrect");
    }
    if (removeRadios) {
      const radio = option.querySelector(".w-radio-input");
      if (radio) radio.remove();
      option.style.paddingLeft = "0px";
    }
  });
};

const showFormLoader = (boolean) => {
  const quizLoader = document.querySelector(CONFIG.selectors.loader);
  boolean
    ? quizLoader.classList.remove("is-hidden-onload")
    : quizLoader.classList.add("is-hidden-onload");
};

const removeUnusedFields = (form) => {
  const unusedFields = form.querySelectorAll(".w-condition-invisible");
  unusedFields.forEach((field) => field.remove());
};

const sendQuizNotification = (message, duration) => {
  const quizNotification = document.querySelector(
    CONFIG.selectors.notification
  );
  quizNotification.textContent = message;
  quizNotification.classList.remove("is-hidden-onload");
  setTimeout(() => {
    quizNotification.classList.add("is-hidden-onload");
  }, duration);
};

const setQuizOptions = () => {
  const questions = document.querySelectorAll("[data-question-atid]");
  const optionsWrapper = document.querySelector("#quiz-options-wrapper");

  // loop through questions
  questions.forEach((question) => {
    const questionAtid = question.getAttribute("data-question-atid");
    const questionName = question.getAttribute("data-question-name");
    const options = document.querySelectorAll(
      `[data-parent-question-atid="${questionAtid}"]`
    );

    // Process and append only the options that will be nested
    options.forEach((option) => {
      const radioInput = option.querySelector('input[type="radio"]');
      const optionAtid = option.getAttribute("data-option-atid");
      const optionName = option.getAttribute("data-option-name");
      const optionTrueFalse = option
        .querySelector(".radio-group")
        .getAttribute("data-option-tf");
      if (radioInput) {
        radioInput.name = questionName;
        radioInput.value = `${optionName} ${
          optionTrueFalse === "false" ? "❌" : "✅"
        }`;
        radioInput.id = optionAtid;
        radioInput.required = true;
      }
      question.appendChild(option);
    });
  });

  // remove unused options wrapper
  if (optionsWrapper) optionsWrapper.remove();
};

const setSurveyOptions = (form) => {
  const questions = form.querySelectorAll("[data-input-name]");

  questions.forEach((question) => {
    const questionName = question.getAttribute("data-input-name");
    question.name = questionName;
  });
};

const handleFormSubmission = () => {
  const quizForm = document.querySelector(CONFIG.selectors.form);
  const quizSubmit = document.querySelector(CONFIG.selectors.submit);

  // If either the form or submit button is not found, do nothing
  if (!quizForm || !quizSubmit) return;

  const formType = quizSubmit.getAttribute("target-type");
  const targetAtid = quizSubmit.getAttribute("target-atid");

  if (formType === "survey") {
    removeUnusedFields(quizForm);
    setSurveyOptions(quizForm);
  }

  quizSubmit.addEventListener("click", (event) => {
    // prevent default form submission
    event.preventDefault();

    // Prevent click if button is disabled
    if (quizSubmit.classList.contains("is-disabled")) {
      return;
    }

    // Check form validity before proceeding
    if (!quizForm.checkValidity()) {
      sendQuizNotification("Please fill out all required fields!", 3000);
      return;
    }

    // Disable submit button to prevent double submission
    disableButton(quizSubmit);
    showFormLoader(true);
    quizSubmit.innerText = "Saving Answers...";

    // get all form elements
    const formElements = quizForm.elements;

    // create an object to store the form data
    const formData = {};

    // Add form type to the data
    formData["form-type"] = formType;
    formData["target-atid"] = targetAtid;

    const targetType = formType === "quiz" ? "sub-module" : "module";

    // Add target-stage if formType is survey
    if (formType === "survey") {
      const targetStage = quizSubmit.getAttribute("target-stage");
      if (targetStage) {
        formData["target-stage"] = targetStage;
      }
      const courseAtid = quizSubmit.getAttribute("target-course-atid");
      if (courseAtid) {
        formData["course-atid"] = courseAtid;
      }
    }

    // loop through all form elements and add their values to the formData object
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];

      // skip buttons, elements without a name, and cf-turnstile-response
      if (
        element.name &&
        element.name !== "cf-turnstile-response" &&
        element.type !== "button" &&
        element.type !== "submit"
      ) {
        // handle checkboxes and radio buttons
        if (element.type === "checkbox" || element.type === "radio") {
          if (element.checked) {
            // If we already have this field and it's an array, add to it
            if (
              formData[element.name] &&
              Array.isArray(formData[element.name])
            ) {
              formData[element.name].push(element.value);
            }
            // If we already have this field but it's not an array, convert to array
            else if (formData[element.name]) {
              formData[element.name] = [formData[element.name], element.value];
            } else {
              formData[element.name] = element.value;
            }
          }
        }
        // Handle select multiple
        else if (element.type === "select-multiple") {
          const selectedValues = Array.from(element.selectedOptions).map(
            (option) => option.value
          );
          formData[element.name] = selectedValues;
        }
        // Handle all other input types
        else {
          formData[element.name] = element.value;
        }
      }
    }

    // Create a filtered copy of formData for the string version (excluding specified fields)
    const filteredFormData = {};
    for (const key in formData) {
      if (
        key !== "member-atid" &&
        key !== "target-atid" &&
        key !== "form-type" &&
        key !== "target-stage" &&
        key !== "course-atid"
      ) {
        filteredFormData[key] = formData[key];
      }
    }

    // Create a custom formatted string for the formData value
    let formattedString = "";
    for (const key in filteredFormData) {
      formattedString += `${key}\n${filteredFormData[key]}\n\n`;
    }

    if (formattedString.length > 0) {
      formattedString = formattedString.slice(0, -2);
    }

    // Add both formatted string and JSON string under different keys
    formData.formData = formattedString;
    formData.formDataJson = JSON.stringify(filteredFormData);

    // console.log(formData);

    const hookNoPass =
      "https://hook.eu2.make.com/34ctid9hval5iv8ltk72lwnmgysvzhu4";

    fetch(hookNoPass, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((responseText) => {
        if (responseText !== "success") {
          throw new Error("Response was not successful");
        }
        updateVisualProgress(targetAtid, targetType);
        // Hide Loader
        showFormLoader(false);
        // Show notification
        sendQuizNotification("Answers saved successfully!", 3000);
        // reveal answers
        if (formType === "quiz") revealAnswers();
        setButtonSuccessText(quizSubmit);
        // enable prerequisites
        enablePrerequisites(targetAtid);
        enablePrevNext();
      })
      .catch((error) => {
        console.error("Error:", error);
        // Hide Loader
        showFormLoader(false);
        quizSubmit.innerText = "Error..";
        // Show notification
        sendQuizNotification(
          "There was a problem saving your Answers.. Please try again!",
          3000
        );
      });
  });
};

const hidePageLoader = () => {
  const loader = document.querySelector(CONFIG.selectors.pageLoader);
  if (loader) loader.remove();
};

const confettis = () => {
  // kill switch
  // return;

  // Create and trigger confetti animation
  const duration = 3000; // 3 seconds duration
  const particleCount = 100;
  const colors = ["#e63a11", "#303D87", "#3c405d"];

  // Create and animate confetti particles with staggered timing
  for (let i = 0; i < particleCount; i++) {
    // Add random delay for each particle
    setTimeout(() => {
      const particle = document.createElement("div");
      particle.style.position = "fixed";
      particle.style.width = "10px";
      particle.style.height = "10px";
      particle.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * 100 + "vw";
      particle.style.top = "-10px";
      particle.style.zIndex = "9999";
      document.body.appendChild(particle);

      // Animate each particle
      const animation = particle.animate(
        [
          {
            transform: "translate(0, 0) rotate(0deg)",
            opacity: 1,
          },
          {
            transform: `translate(${Math.random() * 200 - 100}px, ${
              window.innerHeight
            }px) rotate(${Math.random() * 360}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: duration,
          easing: "ease-out",
        }
      );

      // Remove particle after animation
      animation.onfinish = () => particle.remove();
    }, Math.random() * 1000); // Random delay between 0-1000ms
  }
};

const processVisualProgress = (element, withConfettiTF) => {
  const confetti = element.querySelector(
    CONFIG.selectors.visualProgressConfetti
  );
  const percentage = element.querySelector(
    CONFIG.selectors.visualProgressPercentage
  );
  const progressBar = element.querySelector(CONFIG.selectors.visualProgressBar);
  const type = element.getAttribute(
    CONFIG.selectors.visualProgressTypeAttribute
  );

  const totalItems = document.querySelectorAll(`[data-progress="${type}"]`);
  const totalCount = totalItems.length;

  const completedItems = document.querySelectorAll(
    `[data-progress="${type}"].is-complete`
  );
  const completedCount = completedItems.length;

  const progressPercentage = Number(
    ((completedCount / totalCount) * 100).toFixed(2)
  );

  progressBar.style.width = `${progressPercentage}%`;
  percentage.innerText = progressPercentage;
  if (progressPercentage === 100) {
    console.log("Progress is 100%", withConfettiTF);
    confetti.classList.remove("is-hidden-onload");
    if (withConfettiTF) confettis();
    const pageType = document.body.getAttribute("page-type");
    if (type === "sub-module" && pageType === "module") {
      const pageAtid = document.body.getAttribute("page-atid");
      const completeButton = document.querySelector(
        `[target-atid="${pageAtid}"][target-type="module"]`
      );
      completeButton.classList.remove("is-hidden-onload", "is-disabled");
    }
  }
};

const setupVisualProgress = () => {
  const visualTrackers = document.querySelectorAll(
    CONFIG.selectors.visualProgressWrapper
  );
  visualTrackers.forEach(function (tracker) {
    processVisualProgress(tracker, false);
  });
};

const updateVisualProgress = (targetAtid, targetType) => {
  const checkbox = document.getElementById(targetAtid);
  if (checkbox) checkbox.classList.add("is-complete");

  // also need to update visual progress bar
  const visualTracker = document.querySelector(
    `[visual-progress-type="${targetType}"]`
  );
  console.log("visualTracker", visualTracker);
  if (visualTracker) processVisualProgress(visualTracker, true);
};

const disableButton = (element) => {
  element.style.pointerEvents = "none";
  element.style.cursor = "not-allowed";
  element.style.opacity = "0.6";
  element.setAttribute("tabindex", "-1");
};

const enableButton = (element) => {
  element.style.pointerEvents = "auto";
  element.style.cursor = "pointer";
  element.style.opacity = "1";
  element.setAttribute("tabindex", "0");
};

const setButtonSuccessText = (element) => {
  const completedText = element.getAttribute("target-success-text");
  if (completedText) element.innerText = completedText;
};

const setupPrerequsites = (modulesIdsArray, subModulesIdsArray) => {
  const links = document.querySelectorAll(
    '[prerequisite-atid]:not([prerequisite-atid=""])'
  );
  links.forEach((element) => {
    const prerequisiteAtid = element.getAttribute("prerequisite-atid");
    const prerequisiteType = element.getAttribute("prerequisite-type");
    const idsArray =
      prerequisiteType === "module" ? modulesIdsArray : subModulesIdsArray;

    if (!idsArray?.includes(prerequisiteAtid)) {
      disableButton(element);
      setButtonSuccessText(element);
    }
  });
};

const enablePrerequisites = (targetAtid) => {
  const links = document.querySelectorAll(
    `[prerequisite-atid="${targetAtid}"]`
  );
  links.forEach((element) => {
    enableButton(element);
  });
};

const addVisibleClass = (idsArray) => {
  if (Array.isArray(idsArray)) {
    idsArray.forEach(function (id) {
      // check boxes in CMS Lists
      const element = document.getElementById(id);
      if (element) element.classList.add("is-complete");

      // Set button text and style if there is a "Mark as Complete" button
      const buttons = document.querySelectorAll(`[target-atid="${id}"]`);
      buttons.forEach(function (button) {
        const type = button.getAttribute("target-type");

        if (type === "quiz") revealAnswers(true);

        disableButton(button);
        setButtonSuccessText(button);
      });
    });
  } else {
    console.warn("Expected an array, but got:", idsArray);
  }
};

const pageCompletedLoader = (modulesIdsArray) => {
  const pageAtid = document.body.getAttribute(
    CONFIG.selectors.pageAtidAttribute
  );
  const pageType = document.body.getAttribute(
    CONFIG.selectors.pageTypeAttribute
  );

  if (modulesIdsArray?.includes(pageAtid)) {
    enablePrevNext();
    if (pageType === "survey") {
      const veil = document.querySelector("#disabled-overlay");
      if (veil) {
        const targetAtid = veil.getAttribute("disabled-atid");
        if (modulesIdsArray?.includes(targetAtid)) {
          veil.classList.remove("is-hidden");
        }
      }
    }
  }
};

const enablePrevNext = () => {
  const prevNext = document.querySelector("#prev-next");
  if (prevNext) prevNext.classList.remove("is-hidden-onload");
};

const saveProgressRequest = (element) => {
  const targetAtid = element.getAttribute("target-atid");
  const targetType = element.getAttribute("target-type");
  const memberAtid = document.querySelector(CONFIG.selectors.memberAtid).value;

  const url = `https://hook.eu2.make.com/${CONFIG.hook}?memberATID=${memberAtid}&targetATID=${targetAtid}&targetType=${targetType}`;

  // Send data using fetch
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.text(); // Treat response as text
      }
      throw new Error("Network response was not ok.");
    })

    .then(() => {
      console.log(targetType);
      updateVisualProgress(targetAtid, targetType);

      disableButton(element);
      setButtonSuccessText(element);

      // enable prerequisites
      enablePrerequisites(targetAtid);
      enablePrevNext();

      if (targetType === "module") confettis();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const setupTrackingTriggers = () => {
  const trackingTriggers = document.querySelectorAll(
    CONFIG.selectors.trackingTriggers
  );

  trackingTriggers.forEach((element) => {
    element.addEventListener("click", function (event) {
      saveProgressRequest(element);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // make sure rich text links open in new tab
  document.querySelectorAll(".rich-text a").forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer"); // safer for security/performance
  });

  window.$memberstackDom.getCurrentMember().then((member) => {
    const completedModules = member?.data?.customFields["completed-modules"];
    const completedSubModules =
      member?.data?.customFields["completed-submodules"];

    addVisibleClass(completedModules);
    addVisibleClass(completedSubModules);
    pageCompletedLoader(completedModules);
    pageCompletedLoader(completedSubModules);
    setupPrerequsites(completedModules, completedSubModules);
    setupTrackingTriggers();
    setupVisualProgress();
    setQuizOptions();
    handleFormSubmission();
    hidePageLoader();
  });
});
