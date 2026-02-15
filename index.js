console.log("index.js loaded");

function codeToRun() {
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

  // Text defaults for internationalization (English and Welsh) - to finish
  const TEXT_DEFAULTS = {
    submitStart: {
      en: "Submit Answers & Start Course",
      cy: "Cyflwyno atebion & dechrau'r cwrs",
    },
    submitFinish: {
      en: "Submit Answers & Finish Course",
      cy: "Cyflwyno atebion & gorffen y cwrs",
    },
    saving: {
      en: "Saving Answers...",
      cy: "Arbed atebion…",
    },
    error: {
      en: "Error..",
      cy: "[CY] Error..",
    },
    validationError: {
      en: "Please fill out all required fields!",
      cy: "Atebwch bob cwestiwn, os gwelwch yn dda!",
    },
    redirecting: {
      en: "You will be redirected shortly..",
      cy: "Byddwch yn cael eich allgyfeirio yn fuan..",
    },
    answersSaved: {
      en: "Answers saved successfully!",
      cy: "Atebion wedi'u harbed!",
    },
    saveError: {
      en: "There was a problem saving your Answers.. Please try again!",
      cy: "Roedd yna broblem wrth arbed eich atebion. Rhowch gynnig ar all arni, os gwelwch yn dda!",
    },
  };

  // Helper function to get current language
  const getLanguage = () => {
    const isWelsh = document.body.getAttribute("data-is-welsh");
    return isWelsh === "true" || isWelsh === true ? "cy" : "en";
  };

  // Helper function to get text with attribute priority
  // Priority: 1) element attribute with language suffix, 2) element base attribute, 3) TEXT_DEFAULTS
  const getText = (element, attributeBase, configKey) => {
    if (!element) {
      const lang = getLanguage();
      return TEXT_DEFAULTS[configKey]?.[lang] || "";
    }

    const lang = getLanguage();
    const langAttribute = `${attributeBase}-${lang}`;
    const baseAttribute = attributeBase;

    // Priority 1: Check for language-specific attribute (e.g., text-saving-cy)
    const langValue = element.getAttribute(langAttribute);
    if (langValue) return langValue;

    // Priority 2: Check for base attribute (backward compatibility)
    const baseValue = element.getAttribute(baseAttribute);
    if (baseValue) return baseValue;

    // Priority 3: Fallback to TEXT_DEFAULTS
    return TEXT_DEFAULTS[configKey]?.[lang] || "";
  };

  const setCourseBackLink = () => {
    const courseBackLink = document.querySelectorAll("[data-course-slug]");
    if (courseBackLink)
      courseBackLink.forEach((link) => {
        link.setAttribute(
          "href",
          `/courses/${link.getAttribute("data-course-slug")}`,
        );
      });
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
        "w--redirected-checked",
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

  const autoCompleteTarget = () => {
    const completeButton = document.querySelector("#module-complete-button");
    if (completeButton) completeButton.click();
  };

  const sendQuizNotification = (message, duration) => {
    const quizNotification = document.querySelector(
      CONFIG.selectors.notification,
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
        `[data-parent-question-atid="${questionAtid}"]`,
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
      const surveyStage = quizSubmit.getAttribute("target-stage");
      if (surveyStage === "end") {
        quizSubmit.innerText = getText(
          quizSubmit,
          "text-final",
          "submitFinish",
        );
      } else if (surveyStage === "start") {
        quizSubmit.innerText = getText(
          quizSubmit,
          "text-initial",
          "submitStart",
        );
      }
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
        const quizNotification = document.querySelector(
          CONFIG.selectors.notification,
        );
        sendQuizNotification(
          getText(quizNotification, "text-validation-error", "validationError"),
          3000,
        );
        return;
      }

      // Disable submit button to prevent double submission
      disableButton(quizSubmit);
      showFormLoader(true);
      quizSubmit.innerText = getText(quizSubmit, "text-saving", "saving");

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
                formData[element.name] = [
                  formData[element.name],
                  element.value,
                ];
              } else {
                formData[element.name] = element.value;
              }
            }
          }
          // Handle select multiple
          else if (element.type === "select-multiple") {
            const selectedValues = Array.from(element.selectedOptions).map(
              (option) => option.value,
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

          // If survey, set notif & auto redirect to next module after 3 seconds
          if (formType === "survey") {
            const quizNotification = document.querySelector(
              CONFIG.selectors.notification,
            );
            sendQuizNotification(
              getText(quizNotification, "text-redirect", "redirecting"),
              3000,
            );
            navigateNextItem(2000);
          }

          // if quiz, set notif & reveal answers
          if (formType === "quiz") {
            const quizNotification = document.querySelector(
              CONFIG.selectors.notification,
            );
            sendQuizNotification(
              getText(quizNotification, "text-success", "answersSaved"),
              3000,
            );
            revealAnswers();
          }
          setButtonSuccessText(quizSubmit);
          // enable prerequisites
          enablePrerequisites(targetAtid);
          enablePrevNext();

          if (formType === "quiz") {
            setAutoCompleteLink();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Hide Loader
          showFormLoader(false);
          quizSubmit.innerText = getText(quizSubmit, "text-error", "error");
          // Show notification
          const quizNotification = document.querySelector(
            CONFIG.selectors.notification,
          );
          sendQuizNotification(
            getText(quizNotification, "text-error", "saveError"),
            3000,
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
          },
        );

        // Remove particle after animation
        animation.onfinish = () => particle.remove();
      }, Math.random() * 1000); // Random delay between 0-1000ms
    }
  };

  const finalConfettis = () => {
    const colors = ["#e63a11", "#303D87", "#3c405d"];

    const totalParticles = 220;
    const cannonParticles = 140;
    const showerParticles = totalParticles - cannonParticles;

    const rand = (min, max) => Math.random() * (max - min) + min;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // TEMP: don’t block for reduced motion while you’re testing
    // const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // if (prefersReducedMotion) return;

    const makeParticle = ({ x, y, size, shape, color, z = 9999 }) => {
      const el = document.createElement("div");
      el.style.position = "fixed";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.backgroundColor = color;
      el.style.zIndex = String(z);
      el.style.pointerEvents = "none";
      el.style.willChange = "transform, opacity";
      el.style.transform = "translate3d(0,0,0)";

      if (shape === "dot") el.style.borderRadius = "999px";
      if (shape === "streamer") {
        el.style.width = `${Math.max(2, Math.round(size * 0.35))}px`;
        el.style.height = `${Math.round(size * 2.2)}px`;
        el.style.borderRadius = "3px";
      }

      document.body.appendChild(el);
      return el;
    };

    const animatePhysicsParticle = (p) => {
      const start = performance.now();
      let last = start;

      const tick = (now) => {
        const dt = Math.min(32, now - last);
        last = now;
        const t = dt / 16.6667;

        p.vy += p.g * t;

        const wind =
          p.windBase + Math.sin((now + p.windPhase) * p.windFreq) * p.windAmp;
        p.vx += wind * t;

        p.vx *= Math.pow(p.drag, t);
        p.vy *= Math.pow(p.drag, t);

        p.vx +=
          Math.sin((p.rot + now * 0.004) * p.flutterFreq) * p.flutterAmp * t;

        p.x += p.vx * t;
        p.y += p.vy * t;

        p.rot += p.omega * t;

        const age = now - start;
        const fadeStart = p.life * 0.7;
        const opacity =
          age < fadeStart
            ? 1
            : Math.max(0, 1 - (age - fadeStart) / (p.life - fadeStart));

        p.el.style.opacity = opacity.toFixed(3);
        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;

        const offscreen =
          p.y0 + p.y > window.innerHeight + 200 ||
          p.x0 + p.x < -200 ||
          p.x0 + p.x > window.innerWidth + 200;

        if (age >= p.life || offscreen || opacity <= 0.001) {
          p.el.remove();
          return;
        }

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const spawnCannon = (side) => {
      const fromLeft = side === "left";
      const dir = fromLeft ? 1 : -1;

      const baseX = fromLeft ? 0 : window.innerWidth;
      const baseY = Math.round(window.innerHeight * 0.74);

      const perSide = cannonParticles / 2;

      for (let i = 0; i < perSide; i++) {
        const delay = rand(0, 350);

        setTimeout(() => {
          const shape = pick(["square", "square", "dot", "streamer"]);
          const size = Math.round(rand(6, 12));
          const color = pick(colors);

          const x0 = baseX + (fromLeft ? rand(10, 30) : rand(-30, -10));
          const y0 = baseY + rand(-20, 20);

          const el = makeParticle({ x: x0, y: y0, size, shape, color });

          const speed = rand(18, 28);
          const angle = rand(-70, -35) * (Math.PI / 180);

          const vx = Math.cos(angle) * speed * dir + rand(0, 3) * dir;
          const vy = Math.sin(angle) * speed + rand(-2, 1);

          const p = {
            el,
            x0,
            y0,
            x: 0,
            y: 0,
            vx,
            vy,
            g: shape === "streamer" ? rand(0.35, 0.55) : rand(0.45, 0.75),
            drag:
              shape === "streamer" ? rand(0.965, 0.985) : rand(0.955, 0.975),
            windBase: rand(-0.02, 0.02),
            windAmp: rand(0.02, 0.06),
            windFreq: rand(0.0012, 0.0025),
            windPhase: rand(0, 10000),
            flutterAmp: shape === "dot" ? rand(0.01, 0.03) : rand(0.02, 0.06),
            flutterFreq: rand(0.8, 1.6),
            rot: rand(0, 360),
            omega:
              (shape === "streamer" ? rand(8, 18) : rand(12, 30)) *
              (dir * rand(0.6, 1.4)),
            life: rand(3200, 4600),
          };

          // IMPORTANT: translate is relative, so we keep base position via left/top
          // (already set in makeParticle). Physics uses translate only.
          animatePhysicsParticle(p);
        }, delay);
      }
    };

    const spawnTopShower = () => {
      const waveDelayBase = 1100;

      for (let i = 0; i < showerParticles; i++) {
        const delay = waveDelayBase + rand(0, 900);

        setTimeout(() => {
          const shape = pick(["square", "dot", "streamer"]);
          const size = Math.round(rand(5, 10));
          const color = pick(colors);

          const x = rand(window.innerWidth * 0.2, window.innerWidth * 0.8);
          const y = -20;

          const el = makeParticle({ x, y, size, shape, color });

          const sway1 = rand(-70, 70);
          const sway2 = rand(-140, 140);
          const spin = rand(360, 1100);

          const animation = el.animate(
            [
              {
                transform: "translate3d(0,0,0) rotate(0deg)",
                opacity: 1,
                offset: 0,
              },
              {
                transform: `translate3d(${sway1}px, ${window.innerHeight * 0.45}px, 0) rotate(${spin * 0.45}deg)`,
                opacity: 1,
                offset: 0.55,
              },
              {
                transform: `translate3d(${sway2}px, ${window.innerHeight + 80}px, 0) rotate(${spin}deg)`,
                opacity: 0,
                offset: 1,
              },
            ],
            { duration: 3600, easing: "ease-out", fill: "forwards" },
          );

          animation.onfinish = () => el.remove();
        }, delay);
      }
    };

    spawnCannon("left");
    spawnCannon("right");
    spawnTopShower();
  };

  const processVisualProgress = (element, withConfettiTF) => {
    const confetti = element.querySelector(
      CONFIG.selectors.visualProgressConfetti,
    );
    const percentage = element.querySelector(
      CONFIG.selectors.visualProgressPercentage,
    );
    const progressBar = element.querySelector(
      CONFIG.selectors.visualProgressBar,
    );
    const type = element.getAttribute(
      CONFIG.selectors.visualProgressTypeAttribute,
    );

    const totalItems = document.querySelectorAll(`[data-progress="${type}"]`);
    const totalCount = totalItems.length;

    const completedItems = document.querySelectorAll(
      `[data-progress="${type}"].is-complete`,
    );
    const completedCount = completedItems.length;

    const progressPercentage = Number(
      ((completedCount / totalCount) * 100).toFixed(2),
    );

    progressBar.style.width = `${progressPercentage}%`;
    percentage.innerText = progressPercentage;
    if (progressPercentage === 100) {
      confetti.classList.remove("is-hidden-onload");
      if (withConfettiTF) confettis();
      const pageType = document.body.getAttribute("page-type");
      if (type === "sub-module" && pageType === "module") {
        const pageAtid = document.body.getAttribute("page-atid");
        const completeButton = document.querySelector(
          `[target-atid="${pageAtid}"][target-type="module"]`,
        );
        completeButton.classList.remove("is-hidden-onload", "is-disabled");
      }
    }
  };

  const setupVisualProgress = () => {
    const visualTrackers = document.querySelectorAll(
      CONFIG.selectors.visualProgressWrapper,
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
      `[visual-progress-type="${targetType}"]`,
    );
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
    const lang = getLanguage();
    // Priority 1: Check for language-specific attribute (e.g., text-success-cy)
    const langAttribute = `text-success-${lang}`;
    const langValue = element.getAttribute(langAttribute);
    if (langValue) {
      element.innerText = langValue;
      return;
    }
    // Priority 2: Check for English-specific attribute
    const enValue = element.getAttribute("text-success-en");
    if (enValue) {
      element.innerText = enValue;
      return;
    }
    // Priority 3: Fallback to old attribute names (backward compatibility)
    const oldFinalLangValue = element.getAttribute(`target-final-text-${lang}`);
    if (oldFinalLangValue) {
      element.innerText = oldFinalLangValue;
      return;
    }
    const oldFinalEnValue = element.getAttribute("target-final-text-en");
    if (oldFinalEnValue) {
      element.innerText = oldFinalEnValue;
      return;
    }
    const oldSuccessLangValue = element.getAttribute(
      `target-success-text-${lang}`,
    );
    if (oldSuccessLangValue) {
      element.innerText = oldSuccessLangValue;
      return;
    }
    const oldSuccessEnValue = element.getAttribute("target-success-text-en");
    if (oldSuccessEnValue) {
      element.innerText = oldSuccessEnValue;
      return;
    }
    // Priority 4: Fallback to base attribute (backward compatibility)
    const baseValue = element.getAttribute("target-success-text");
    if (baseValue) element.innerText = baseValue;
  };

  const setupPrerequsites = (modulesIdsArray, subModulesIdsArray) => {
    const links = document.querySelectorAll(
      '[prerequisite-atid]:not([prerequisite-atid=""])',
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
      `[prerequisite-atid="${targetAtid}"]`,
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
      CONFIG.selectors.pageAtidAttribute,
    );
    const pageType = document.body.getAttribute(
      CONFIG.selectors.pageTypeAttribute,
    );

    if (modulesIdsArray?.includes(pageAtid)) {
      enablePrevNext();
      if (pageType === "survey") {
        const veil = document.querySelector("#disabled-overlay");
        const form = document.querySelector("#form-wrapper");
        if (veil && form) {
          const targetAtid = veil.getAttribute("disabled-atid");
          if (modulesIdsArray?.includes(targetAtid)) {
            veil.classList.remove("is-hidden-onload");
            form.classList.add("is-hidden");
          }
        }
      }
    }
  };

  const enablePrevNext = () => {
    const prevNext = document.querySelector("#prev-next");
    if (prevNext) {
      const link = prevNext.querySelector('[fs-list-element="next-item"] a');
      if (link) prevNext.classList.remove("is-hidden-onload");
    }
  };

  const navigateNextItem = (delay = 0) => {
    const prevNext = document.querySelector("#prev-next");
    if (prevNext) {
      const nextItemLink = prevNext.querySelector(
        '[fs-list-element="next-item"] a',
      );

      // Check if we'll actually redirect before showing notification
      let willRedirect = false;
      let redirectHref = null;

      if (nextItemLink) {
        willRedirect = true;
        redirectHref = nextItemLink.getAttribute("href");
      } else {
        // if no next item found, redirect to course page
        const courseLink = document.querySelector("a.breadcrumb-link");
        if (courseLink) {
          willRedirect = true;
          redirectHref = courseLink.getAttribute("href") + "?confettis";
        }
      }

      // Show redirect notification immediately if we're going to redirect
      if (willRedirect && redirectHref) {
        const redirectionNotification = document.querySelector(
          "#redirection-notification",
        );
        if (redirectionNotification)
          redirectionNotification.classList.remove("is-hidden-onload");

        // Wait for delay before actually redirecting
        setTimeout(() => {
          window.location.href = redirectHref;
        }, delay);
      }
    }
  };

  const setAutoCompleteLink = () => {
    const completeModuleButton = document.querySelector(
      "#complete-module-button",
    );
    if (completeModuleButton) {
      const isAutoComplete = completeModuleButton.getAttribute(
        "target-auto-complete",
      );
      if (isAutoComplete)
        completeModuleButton.href = !completeModuleButton.href.includes(
          "?auto-complete",
        )
          ? completeModuleButton.href + "?auto-complete"
          : completeModuleButton.href;
    }
  };

  const saveProgressRequest = (element) => {
    const targetAtid = element.getAttribute("target-atid");
    const targetType = element.getAttribute("target-type");
    const memberAtid = document.querySelector(
      CONFIG.selectors.memberAtid,
    ).value;

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
        updateVisualProgress(targetAtid, targetType);

        disableButton(element);
        setButtonSuccessText(element);

        // enable prerequisites
        enablePrerequisites(targetAtid);
        enablePrevNext();
        navigateNextItem(2000);

        if (targetType === "module") confettis();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const setupTrackingTriggers = () => {
    const trackingTriggers = document.querySelectorAll(
      CONFIG.selectors.trackingTriggers,
    );

    trackingTriggers.forEach((element) => {
      element.addEventListener("click", function (event) {
        saveProgressRequest(element);
      });
    });
  };

  const checkParams = () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Check for auto-complete in URL params and execute autoCompleteTarget if present
    if (urlParams.has("auto-complete")) {
      autoCompleteTarget();
    }

    // Check for confettis in URL params
    if (urlParams.has("confettis")) {
      // Check if the current page is in the course folder
      // Assumption: course pages have '/course/' in the URL path
      const pathname = window.location.pathname;
      if (pathname.includes("/courses/")) {
        // convert next steps rich text buttons to buttons
        nextStepsRTButtonConversion();

        // unhide next steps section
        const nextSteps = document.querySelector("#next-steps");
        if (nextSteps) nextSteps.classList.remove("is-hidden-onload");

        // fire final confettis
        finalConfettis();
      } else {
        confettis();
      }
    }
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
      setAutoCompleteLink();
      handleFormSubmission();
      setCourseBackLink();
      checkParams();
      hidePageLoader();
    });
  });
}

const nextStepsRTButtonConversion = () => {
  const nextStepsRichText = document.querySelector("#next-steps-rich-text");
  if (nextStepsRichText) {
    nextStepsRichText.querySelectorAll("a").forEach((link) => {
      link.classList.add("btn");
    });
  }
};

if (window.$memberstackReady) {
  // Run the code immediately if Memberstack is already ready
  codeToRun();
} else {
  // Wait for Memberstack to be ready if it's not already
  document.addEventListener("memberstack.ready", codeToRun);
}
