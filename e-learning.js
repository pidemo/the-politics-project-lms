function codeToRun() {
  document.addEventListener("DOMContentLoaded", () => {
    window.$memberstackDom.getCurrentMember().then((member) => {
      const completedCourses = member?.data?.customFields["completed-courses"];
      const allStartedCourses = member?.data?.customFields["started-courses"];
      const completedSet = new Set(completedCourses || []);
      const filteredStartedCourses = (allStartedCourses || []).filter(
        (course) => !completedSet.has(course)
      );

      filteredStartedCourses.forEach((course) => {
        const courseTags = document.querySelectorAll(
          `[data-course-atid="${course}"][data-course-status="in-progress"]`
        );
        courseTags.forEach((tag) => {
          tag.classList.remove("is-hidden-onload");
          const button = tag
            .closest(".button-row")
            .querySelector(".component-button-text");
          if (button) button.innerText = "Continue Learning";
        });
      });
      completedCourses.forEach((course) => {
        const courseTags = document.querySelectorAll(
          `[data-course-atid="${course}"][data-course-status="completed"]`
        );
        courseTags.forEach((tag) => {
          tag.classList.remove("is-hidden-onload");
          const button = tag
            .closest(".button-row")
            .querySelector(".component-button-text");
          if (button) button.innerText = "Review Learnings";
        });
      });
    });
  });
}

window.$memberstackReady
  ? codeToRun()
  : document.addEventListener("memberstack.ready", codeToRun);
