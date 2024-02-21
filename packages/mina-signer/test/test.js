function expect(actual, matcher) {
  if (actual !== matcher) {
    throw new Error(`expect ${matcher}, got ${actual}`);
  }
}

/** account type */
function runAccountTest() {
  const mne = account.generateMnemonic();
  console.log("mne", mne);
  expect(!!mne, true);

  const testData = window.accountData;
  console.log("testData", testData[0]);
  for (let index = 0; index < testData.length; index++) {
    const mneData = testData[index];
    console.info(
      `current is ${index}, total is ${testData.length}, mne: ${mneData.mne}`
    );
    for (let j = 0; j < mneData.account.length; j++) {
      const innerAccount = mneData.account[j];

      let mneParams = {
        mnemonic: mneData.mne,
      };
      mneParams.accountIndex = j;
      console.log("mneParams", mneParams);
      const accountWithoutPriKey = account.importWalletByMnemonic(mneParams);
      console.log("accountWithoutPriKey", accountWithoutPriKey);
      expect(accountWithoutPriKey.pubKey, innerAccount.pubKey);
      expect(accountWithoutPriKey.hdIndex, innerAccount.hdIndex);

      mneParams.needPrivateKey = true;
      const accountWithPriKey = account.importWalletByMnemonic(mneParams);
      console.log("accountWithPriKey", accountWithPriKey);

      expect(accountWithPriKey.priKey, innerAccount.priKey);
      expect(accountWithPriKey.pubKey, innerAccount.pubKey);

      const privateKey = {
        privateKey: accountWithPriKey.priKey,
      };
      const walletByPrivateKey = account.importWalletByPrivateKey(privateKey);
      console.log("walletByPrivateKey", walletByPrivateKey);
      expect(walletByPrivateKey.priKey, innerAccount.priKey);
      expect(walletByPrivateKey.pubKey, innerAccount.pubKey);
    }
    console.log("loop ==================== ");
  }
}

async function runTests() {
  runAccountTest();
  console.log("all tests successful.");
}
window.runTests = runTests;
