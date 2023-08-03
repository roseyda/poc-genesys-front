document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("clickToDial").addEventListener("click", clickToDial);
  document
    .getElementById("addAssociation")
    .addEventListener("click", addAssociation);
  document
    .getElementById("addAttribute")
    .addEventListener("click", addAttribute);
  document
    .getElementById("addTransferContext")
    .addEventListener("click", addTransferContext);
  document
    .getElementById("updateUserStatus")
    .addEventListener("click", updateUserStatus);
  document
    .getElementById("pickupInteraction")
    .addEventListener("click", updateInteractionState);
  document
    .getElementById("securePauseInteraction")
    .addEventListener("click", updateInteractionState);
  document
    .getElementById("disconnectInteraction")
    .addEventListener("click", updateInteractionState);
  document
    .getElementById("holdInteraction")
    .addEventListener("click", updateInteractionState);
  document
    .getElementById("muteInteraction")
    .addEventListener("click", updateInteractionState);
  document
    .getElementById("updateAudioConfiguration")
    .addEventListener("click", updateAudioConfiguration);
  document
    .getElementById("sendCustomNotification")
    .addEventListener("click", sendCustomNotification);

  document
    .getElementById("view-interactionList")
    .addEventListener("click", setView);
  document.getElementById("view-calllog").addEventListener("click", setView);
  document
    .getElementById("view-newInteraction")
    .addEventListener("click", setView);
  document.getElementById("view-callback").addEventListener("click", setView);
  document.getElementById("view-settings").addEventListener("click", setView);
  document
    .getElementById("scroll-button")
    .addEventListener("click", scrollIframe);

  window.addEventListener("message", function (event) {
    let message;
    try {
      message = JSON.parse(event?.data);
      console.log("🚀 ~ file: example.js:55 ~ message:", message);
    } catch (error) {
      return;
    }
    const { type, data } = message;
    if (!type || !data) return;

    switch (type) {
      case "screenPop":
        console.log("🚀 ~ file: example.js:63 ~ screenPop:");
        document.getElementById("screenPopPayload").value = event.data;
        document.getElementById("myModal").classList.toggle("show");
        document.getElementById(
          "modalText"
        ).innerHTML = `Incomming call from ${data.data.searchString}`;
        break;
      case "processCallLog":
        document.getElementById("processCallLogPayLoad").value = event.data;
        break;
      case "openCallLog":
        document.getElementById("openCallLogPayLoad").value = event.data;
        break;
      case "interactionSubscription":
        document.getElementById("interactionSubscriptionPayload").value =
          event.data;
        break;
      case "userActionSubscription":
        document.getElementById("userActionSubscriptionPayload").value =
          event.data;
        break;
      case "notificationSubscription":
        document.getElementById("notificationSubscriptionPayload").value =
          event.data;
        console.log("🚀 ~ file: example.js:83 ~ event.data:", event.data);
        console.log(
          '🚀 ~ file: example.js:81 ~ document.getElementById("notificationSubscriptionPayload").value:',
          document.getElementById("notificationSubscriptionPayload").value
        );
        break;
      case "contactSearch":
        document.getElementById("searchText").innerHTML =
          ": " + message.data.searchString;
        sendContactSearch();
        break;

      default:
        break;
    }
  });

  function scrollIframe() {
    window.getElementById("softphone").contentWindow.scrollTo(5, 20);
  }

  function clickToDial() {
    console.log("process click to dial");
    document.getElementById("softphone").contentWindow.postMessage(
      JSON.stringify({
        type: "clickToDial",
        data: { number: "3172222222", autoPlace: true },
      }),
      "*"
    );
  }

  function addAssociation() {
    console.log("process add association");
    document.getElementById("softphone").contentWindow.postMessage(
      JSON.stringify({
        type: "addAssociation",
        data: JSON.parse(document.getElementById("associationPayload").value),
      }),
      "*"
    );
  }

  function addAttribute() {
    console.log("process add attribute");
    document.getElementById("softphone").contentWindow.postMessage(
      JSON.stringify({
        type: "addAttribute",
        data: JSON.parse(document.getElementById("attributePayload").value),
      }),
      "*"
    );
  }

  function addTransferContext() {
    console.log("process add Transfer Context");
    document.getElementById("softphone").contentWindow.postMessage(
      JSON.stringify({
        type: "addTransferContext",
        data: JSON.parse(
          document.getElementById("transferContextPayload").value
        ),
      }),
      "*"
    );
  }

  function sendContactSearch() {
    console.log("process add Search Context");
    document.getElementById("softphone").contentWindow.postMessage(
      JSON.stringify({
        type: "sendContactSearch",
        data: JSON.parse(document.getElementById("contactSearchPayload").value),
      }),
      "*"
    );
  }

  function updateUserStatus() {
    console.log("process user status update");
    document.getElementById("softphone").contentWindow.postMessage(
      JSON.stringify({
        type: "updateUserStatus",
        data: { id: document.getElementById("statusDropDown").value },
      }),
      "*"
    );
  }

  function updateInteractionState(event) {
    console.log("process interaction state change");
    console.log(
      "🚀 ~ file: example.js:191 ~ updateInteractionState ~ payload.event.target.outerText:",
      event.target.outerText
    );
    var lastInteractionPayload = JSON.parse(
      document.getElementById("interactionSubscriptionPayload").value
    );
    var interactionId;
    if (lastInteractionPayload.data.interaction.old) {
      interactionId = lastInteractionPayload.data.interaction.old.id;
    } else {
      interactionId = lastInteractionPayload.data.interaction.id;
    }
    let payload = {
      action: event.target.outerText,
      id: interactionId,
    };
    document.getElementById("softphone").contentWindow.postMessage(
      JSON.stringify({
        type: "updateInteractionState",
        data: payload,
      }),
      "*"
    );
  }

  function updateAudioConfiguration() {
    console.log("Update Audio Configuration");
    var payload = {
      call: document.getElementById("audio-call").checked,
      chat: document.getElementById("audio-chat").checked,
      email: document.getElementById("audio-email").checked,
      callback: document.getElementById("audio-callback").checked,
      message: document.getElementById("audio-message").checked,
      voicemail: document.getElementById("audio-voicemail").checked,
    };
    document.getElementById("softphone").contentWindow.postMessage(
      JSON.stringify({
        type: "updateAudioConfiguration",
        data: payload,
      }),
      "*"
    );
  }

  function setView(event) {
    console.log("process view update");
    let payload = {
      type: "main",
      view: {
        name: event.target.outerText,
      },
    };
    document.getElementById("softphone").contentWindow.postMessage(
      JSON.stringify({
        type: "setView",
        data: payload,
      }),
      "*"
    );
  }

  function sendCustomNotification() {
    console.log("Send Custom User Notification");
    var payload = {
      message: document.getElementById("customNotificationMessage").value,
      type: document.getElementById("notificationType").value,
      timeout: document.getElementById("notificationTimeout").value,
    };
    document.getElementById("softphone").contentWindow.postMessage(
      JSON.stringify({
        type: "sendCustomNotification",
        data: payload,
      }),
      "*"
    );
  }
});

function pickupCall() {
  console.log("Answering call");
  // const lastInteractionPayload = JSON.parse(
  //   document.getElementById("interactionSubscriptionPayload").value
  // );
  // const interactionId =
  //   lastInteractionPayload.data.interaction.old?.id ??
  //   lastInteractionPayload.data.interaction.id;

  const softphoneIframe = document.getElementById("softphone");
  // softphoneIframe.contentWindow.postMessage(
  //   JSON.stringify({
  //     type: "updateInteractionState",
  //     data: {
  //       action: "pickup",
  //       id: interactionId,
  //     },
  //   }),
  //   "*"
  // );
  document.getElementById("myModal").classList.toggle("show");
  softphoneIframe.classList.toggle("softphoneOpened");
}
