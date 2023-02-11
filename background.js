'use strict';
// background.js
chrome.runtime.onInstalled.addListener (function () {
  // Check if the user is on the chat page
  chrome.webNavigation.onCompleted.addListener (function (details) {
    if (details.url === 'https://chat.openai.com/chat') {
      // Request the activeTab permission
      chrome.permissions.request (
        {
          permissions: ['activeTab'],
        },
        function (granted) {
          if (granted) {
            // Get the text of the page
            chrome.tabs.executeScript (
              {
                code: 'document.body.innerText',
              },
              function (result) {
                // Check if the text shows the high demand message
                if (
                  result[0].includes (
                    "We're experiencing exceptionally high demand.",
                    'An error occurred. If this issue persists please contact us through our help center at help.openai.com.'
                  )
                ) {
                  // Request the notifications permission
                  chrome.permissions.request (
                    {
                      permissions: ['notifications'],
                    },
                    function (granted) {
                      if (granted) {
                        chrome.notifications.create (
                          {
                            type: 'basic',
                            iconUrl: 'bell-regular.svg',
                            title: 'ChatGPT Notifications',
                            message: 'Please hang tight as we work on scaling our systems.',
                            isClickable: true,
                          },
                          function (notificationId) {
                            chrome.notifications.onClicked.addListener (
                              function (notificationId) {
                                // Redirect to chat page if notification is clicked
                                window.location.href =
                                  'https://chat.openai.com/chat';
                              }
                            );
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  });
});
