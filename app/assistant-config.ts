export let assistantId = ""; // set your assistant ID here

if (assistantId === "") {
  // CHANGE BEFORE GOING PRO
  assistantId = process.env.OPENAI_DEV_ASSISTANT_ID;
}
