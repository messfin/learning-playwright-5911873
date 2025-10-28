import { createMessage } from "@datafactory/messages";
import { registerUser } from "@datafactory/register";
import { test, expect } from "@fixtures/base.fixture";

test("customer reply to a message", async ({
  context,
  loginPage,
  messagesPage,
  contactPage,
  accountPage,
}) => {
  const timestamp = Date.now(); // Gets current epoch time in milliseconds
  const email = `new_user_${timestamp}@test.com`;
  const password = "123@$%!@DERGa12551";
  const dropdownOptions = "payments";
  const message =
    "This is a really long message that goes on an on for at least 50 characters";
  const messageUserAuthFile = ".auth/messageUser.json";

  await test.step("create a new user", async () => {
    await loginPage.goto();
    await registerUser(email, password);
    await loginPage.login(email, password);

    await expect(accountPage.navMenu).toContainText("Test User");

    await context.storageState({ path: messageUserAuthFile }); // save the token and cookies
  });

  // Non-Data Factory Approach
  await test.step.skip("create a new message", async () => {
    await contactPage.goto();
    await contactPage.subject.selectOption(dropdownOptions);
    await contactPage.message.fill(message);
    await contactPage.sendButton.click();
    await expect(contactPage.successMessage).toContainText(
      "Thanks for your message! We will contact you shortly."
    );
  });

  // Data Factory Approach Using API
  await test.step("create a new message with datafactory", async () => {
    await createMessage(
      "Testy Mctesterface",
      message,
      dropdownOptions,
      messageUserAuthFile
    );
  });

  await test.step("reply and validate message", async () => {
    await messagesPage.goto();
    await expect(messagesPage.table).toContainText(message.substring(0, 25));
    await expect(messagesPage.table).toContainText(dropdownOptions);

    await messagesPage.firstDetailLink.click();
    await expect(messagesPage.messagesList).toContainText(message);

    const replyMessage = "Pizza Time";
    await messagesPage.replyInput.fill(replyMessage);
    await messagesPage.replyButton.click();
    await expect(messagesPage.replyList).toContainText(replyMessage);
  });
});
