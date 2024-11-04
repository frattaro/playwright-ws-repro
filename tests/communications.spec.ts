import { expect, Page, test } from "@playwright/test";

const usePlaywrightRoute = async (page: Page) => page.routeWebSocket(
  "ws://localhost:3001/echo?token=notasecret",
  (ws) => {
    ws.onMessage((data) => {
      if (data.includes("MessagesChannel")) {
        // subscription response
        ws.send(
          JSON.stringify({
            identifier: '{"channel":"MessagesChannel"}',
            type: "confirm_subscription"
          })
        );

        // action complete response
        setTimeout(
          () =>
            ws.send(
              JSON.stringify({
                identifier: '{"channel":"MessagesChannel"}',
                message: {
                  type: "new",
                  message: {
                    subject: "This came from websockets",
                    videoList: [],
                    type: "Email",
                    content:
                      "This message content",
                    isArchived: false,
                    isRead: false
                  }
                }
              })
            ),
          1000
        );
      }
    });

    ws.send(
      JSON.stringify({
        type: "welcome",
        sid: "d7ac1194c7a6604a814fc0e3acc6acd5"
      })
    );

    return Promise.resolve();
  }
);

test.describe("communications", () => {
  test("receive message via websocket", async ({ page }) => {
    //await usePlaywrightRoute(page);

    await page.goto("http://localhost:3000/");
    await expect(page.locator("body")).toContainText(`{ "type": "new", "message": { "subject": "This came from websockets", "videoList": [], "type": "Email", "content": "This message was made in the customer portal and sent to the people portal", "isArchived": false, "isRead": false } }`);
  });
});
