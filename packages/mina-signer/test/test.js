async function runTests() {
  await runAccountTest();

  console.log("all tests passed.");
}
window.runTests = runTests;
