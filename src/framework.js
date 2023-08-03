var contactSearchCallback;

window.Framework = {
  config: {
    name: "ExampleGitHubApp",
    clientIds: {
      "mypurecloud.com": "",
      "mypurecloud.ie": "",
      "mypurecloud.com.au": "",
      "mypurecloud.jp": "",
      "mypurecloud.de": "",
    },
    customInteractionAttributes: [
      "PT_URLPop",
      "PT_SearchValue",
      "PT_TransferContext",
    ],
    settings: {
      embedWebRTCByDefault: true,
      hideWebRTCPopUpOption: false,
      enableCallLogs: true,
      enableTransferContext: true,
      hideCallLogSubject: true,
      hideCallLogContact: false,
      hideCallLogRelation: false,
      searchTargets: ["people", "queues", "frameworkcontacts"],
      theme: {
        primary: "#d4cebd",
        text: "#123",
      },
    },
  },

  initialSetup: function () {
    window.PureCloud.subscribe([
      {
        type: "Interaction",
        callback: function (category, interaction) {
          window.parent.postMessage(
            JSON.stringify({
              type: "interactionSubscription",
              data: { category: category, interaction: interaction },
            }),
            "*"
          );
        },
      },
      {
        type: "UserAction",
        callback: function (category, data) {
          window.parent.postMessage(
            JSON.stringify({
              type: "userActionSubscription",
              data: { category: category, data: data },
            }),
            "*"
          );
        },
      },
      {
        type: "Notification",
        callback: function (category, data) {
          window.parent.postMessage(
            JSON.stringify({
              type: "notificationSubscription",
              data: { category: category, data: data },
            }),
            "*"
          );
        },
      },
    ]);

    window.addEventListener("message", function (event) {
      let message;
      try {
        message = JSON.parse(event?.data);
      } catch (error) {
        return;
      }

      const { type, data } = message;
      if (!type || !data) return;

      switch (type) {
        case "clickToDial":
          window.PureCloud.clickToDial(data);
          break;
        case "addAssociation":
          window.PureCloud.addAssociation(data);
          break;
        case "addAttribute":
          window.PureCloud.addAttribute(data);
          break;
        case "addCustomAttributes":
          window.PureCloud.addCustomAttributes(data);
          break;
        case "addTransferContext":
          window.PureCloud.addTransferContext(data);
          break;
        case "sendContactSearch":
          contactSearchCallback && contactSearchCallback(data);
          break;
        case "updateUserStatus":
          window.PureCloud.User.updateStatus(data);
          break;
        case "updateInteractionState":
          window.PureCloud.Interaction.updateState(data);
          break;
        case "setView":
          window.PureCloud.User.setView(data);
          break;
        case "updateAudioConfiguration":
          window.PureCloud.User.Notification.setAudioConfiguration(data);
          break;
        case "sendCustomNotification":
          window.PureCloud.User.Notification.notifyUser(data);
          break;
        default:
          console.error("Error unmanaged message type :", message);
          break;
      }
    });
  },
  screenPop: function (searchString, interaction) {
    window.parent.postMessage(
      JSON.stringify({
        type: "screenPop",
        data: { searchString: searchString, interactionId: interaction },
      }),
      "*"
    );
  },
  processCallLog: function (
    callLog,
    interaction,
    eventName,
    onSuccess,
    onFailure
  ) {
    window.parent.postMessage(
      JSON.stringify({
        type: "processCallLog",
        data: {
          callLog: callLog,
          interactionId: interaction,
          eventName: eventName,
        },
      }),
      "*"
    );
    var success = true;
    if (success) {
      onSuccess({
        id: callLog.id || Date.now(),
      });
    } else {
      onFailure();
    }
  },
  openCallLog: function (callLog, interaction) {
    window.parent.postMessage(
      JSON.stringify({
        type: "openCallLog",
        data: { callLog: callLog, interaction: interaction },
      }),
      "*"
    );
  },
  contactSearch: function (searchString, onSuccess, onFailure) {
    contactSearchCallback = onSuccess;
    window.parent.postMessage(
      JSON.stringify({
        type: "contactSearch",
        data: { searchString: searchString },
      }),
      "*"
    );
  },
};
