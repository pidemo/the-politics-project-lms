/*
We have 4 parameters :
target-atid -> to know which element to track
target-type -> to know which type of element are we tracking
target-source -> to know if we're tracking resources or events
target-tracking -> only used to target elements to run click event on
target-consent -> used to know if we need to capture user consent to be contacted or not

Need to update automation so that member-atid is properly synced to memberstack

Might also need to update script on /all-resources page, so that it only runs if member is logged in
*/

// might need to time it better for when link is local (since it opens in the same tab)

document.addEventListener("DOMContentLoaded", () => {
  window.$memberstackDom
    .getCurrentMember()
    .then(({ data: member }) => {
      if (member) {
        // get member data for recording inputs
        const memberAtid = document.querySelector("#member-atid").value;
        const memberMsid = document.querySelector("#member-msid").value;

        // select all elements with an attribute of target-tracking="true" & run tracking function on those elements
        const triggers = document.querySelectorAll('[target-tracking="true"]');

        // Iterate over the NodeList and log each element
        triggers.forEach((element) => {
          element.addEventListener("click", function (event) {
            // Get relevant data & add them as params to Webhook
            const targetType = element.getAttribute("target-type");
            const targetSource = element.getAttribute("target-source");
            const targetAtid = element.getAttribute("target-atid");
            const pageUrl = window.location.href;

            const hookSlug = `993n16yk8xif1ncd50s8wol6e7sfgffb?memberATID=${memberAtid}&memberMSID=${memberMsid}&targetATID=${targetAtid}&targetType=${targetType}&targetSource=${targetSource}&sourcePage=${pageUrl}`;

            // Send data using fetch
            fetch(`https://hook.eu2.make.com/${hookSlug}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error checking member status:", error);
    });
});
