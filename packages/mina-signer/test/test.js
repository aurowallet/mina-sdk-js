function expect(actual, matcher, title = "") {
  if (actual !== matcher) {
    throw new Error(`${title} error, expect ${matcher}, got ${actual}`);
  }
}

/** account type */
function runAccountTest() {
  const mne = account.generateMnemonic();
  console.log("mne", mne);
  expect(!!mne, true);

  const testData = window.accountData;
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

function runUtilsTest() {
  const testData = window.accountData;
  for (let index = 0; index < testData.length; index++) {
    const mneData = testData[index];
    console.info(`current is ${index}, total is ${testData.length}`);
    for (let j = 0; j < mneData.account.length; j++) {
      const innerAccount = mneData.account[j];
      const status = utils.isAddressValid({
        address: innerAccount.pubKey,
      });
      expect(status, true);
    }
  }
}

/**
 * test signPayment
 */
function signPayment() {
  console.log("signPayment test start");
  const transactionData = window.transactionData.signPayment;
  const signResultMainnet = auroSignLib.signTransaction(
    transactionData.mainnet.signParams
  );
  expect(
    JSON.stringify(signResultMainnet),
    JSON.stringify(transactionData.mainnet.signResult),
    "mainnet sendPayment"
  );
  const signResultTest = auroSignLib.signTransaction(
    transactionData.testnet.signParams
  );
  expect(
    JSON.stringify(signResultTest),
    JSON.stringify(transactionData.testnet.signResult),
    "testnet sendPayment"
  );
  console.log("signPayment test successful");
}
function signStakeTransaction() {
  console.log("signStakeTransaction test start");
  const transactionData = window.transactionData.signStakeTransaction;
  const signResultMainnet = auroSignLib.signTransaction(
    transactionData.mainnet.signParams
  );
  expect(
    JSON.stringify(signResultMainnet),
    JSON.stringify(transactionData.mainnet.signResult),
    "mainnet signStakeTransaction"
  );

  const signResultTest = auroSignLib.signTransaction(
    transactionData.testnet.signParams
  );
  expect(
    JSON.stringify(signResultTest),
    JSON.stringify(transactionData.testnet.signResult),
    "testnet signStakeTransaction"
  );
  console.log("signStakeTransaction test successful");
}
function signZkTransaction() {
  console.log("signZkTransaction test start");
  const transactionData = window.transactionData.signZkTransaction;
  let params = {
    ...transactionData.testnet.signParams,
    transaction: transactionData.testnet.signParams.transaction,
  };
  // B62qjFNwXHfqXjFTRerWBpd9Sfdx3FfX6hQdErqjS694t1Cn2cSc8MK
  const signResultTest = auroSignLib.signTransaction(
    // transactionData.testnet.signParams
    params
  );
  console.log("signResultTest=0", signResultTest);
  expect(
    JSON.stringify(signResultTest),
    JSON.stringify(transactionData.testnet.signResult),
    "testnet signZkTransaction"
  );
  console.log("signZkTransaction test successful");
}
function signMessage() {
  console.log("signMessage test start");
  const transactionData = window.transactionData.signMessageTransaction;
  const signResultMainnet = auroSignLib.signTransaction(
    transactionData.mainnet.signParams
  );
  expect(
    JSON.stringify(signResultMainnet),
    JSON.stringify(transactionData.mainnet.signResult),
    "mainnet signMessage"
  );
  const verifyResultMain = auroSignLib.verifyMessage({
    network: "mainnet",
    publicKey: transactionData.mainnet.signParams.publicKey,
    signature: transactionData.mainnet.signResult.signature,
    verifyMessage: transactionData.mainnet.signResult.data,
  });
  expect(verifyResultMain, true, "mainnet verifyMessage");
  const signResultTest = auroSignLib.signTransaction(
    transactionData.testnet.signParams
  );
  expect(
    JSON.stringify(signResultTest),
    JSON.stringify(transactionData.testnet.signResult),
    "testnet signMessage"
  );

  const verifyResultTest = auroSignLib.verifyMessage({
    network: "testnet",
    publicKey: transactionData.testnet.signParams.publicKey,
    signature: transactionData.testnet.signResult.signature,
    verifyMessage: transactionData.testnet.signResult.data,
  });
  expect(verifyResultTest, true, "testnet verifyMessage");
  console.log("signMessage test successful");
}

/** test sign */
function runTransactionTest(params) {
  signPayment();
  signStakeTransaction();
  // signZkTransaction()
  signMessage();
}

async function runFieldsTest() {
  console.log("runFieldsTest test start");
  const transactionData = window.transactionData.signFiledsData;
  const signResultMainnet = auroSignLib.signFields(
    transactionData.mainnet.signParams
  );
  expect(
    signResultMainnet.signature,
    transactionData.mainnet.signResult.signature,
    "mainnet fieldsTest"
  );
  const verifyResultMain = auroSignLib.verifyFieldsMessage({
    network: "mainnet",
    publicKey: transactionData.mainnet.signParams.publicKey,
    signature: transactionData.mainnet.signResult.signature,
    fields: transactionData.mainnet.signResult.data,
  });
  expect(verifyResultMain, true, "mainnet verifyMessage");
  const signResultTest = auroSignLib.signFields(
    transactionData.testnet.signParams
  );
  console.log("signResultTest", signResultTest);
  expect(
    signResultTest.signature,
    transactionData.testnet.signResult.signature,
    "testnet fieldsTest"
  );

  const verifyResultTest = auroSignLib.verifyFieldsMessage({
    network: "testnet",
    publicKey: signResultTest.publicKey,
    signature: signResultTest.signature,
    fields: signResultTest.data,
  });
  console.log("verifyResultTest", verifyResultTest);
  expect(verifyResultTest, true, "testnet verifyFields");
  console.log("runFieldsTest test successful");
}

async function runTests() {
  /** test account  */
  // runAccountTest();

  /** test utils */
  // runUtilsTest();

  /** test transaction */
  // runTransactionTest();

  /** test fields */
  runFieldsTest();

  console.log("all tests successful.");
}
window.runTests = runTests;

async function runNullifierTest(params) {}
