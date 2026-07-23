function expect(actual, matcher, title = "") {
  if (actual !== matcher) {
    throw new Error(`${title} error, expect ${matcher}, got ${actual}`);
  }
}

/** account type */
async function runAccountTest() {
  const mne = account.generateMnemonic();
  console.log("mne", mne);
  expect(!!mne, true);

  const testData = window.accountData;
  // for (let index = 0; index < testData.length; index++) {
  for (let index = 0; index < 100; index++) {
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
      const accountWithoutPriKey = await account.importWalletByMnemonic(
        mneParams
      );
      console.log("accountWithoutPriKey", accountWithoutPriKey);
      expect(accountWithoutPriKey.pubKey, innerAccount.pubKey);
      expect(accountWithoutPriKey.hdIndex, innerAccount.hdIndex);

      mneParams.needPrivateKey = true;
      const accountWithPriKey = await account.importWalletByMnemonic(mneParams);
      console.log("accountWithPriKey", accountWithPriKey);

      expect(accountWithPriKey.priKey, innerAccount.priKey);
      expect(accountWithPriKey.pubKey, innerAccount.pubKey);

      const privateKey = {
        privateKey: accountWithPriKey.priKey,
      };
      const walletByPrivateKey = await account.importWalletByPrivateKey(
        privateKey
      );
      console.log("walletByPrivateKey", walletByPrivateKey);
      expect(walletByPrivateKey.priKey, innerAccount.priKey);
      expect(walletByPrivateKey.pubKey, innerAccount.pubKey);
    }
    console.log("loop ==================== ");
  }
}

async function runUtilsTest() {
  const testData = window.accountData;
  for (let index = 0; index < testData.length; index++) {
    const mneData = testData[index];
    // console.info(`utils current is ${index}, total is ${testData.length}`);
    for (let j = 0; j < mneData.account.length; j++) {
      const innerAccount = mneData.account[j];
      const status = await utils.isAddressValid({
        address: innerAccount.pubKey,
      });
      expect(status, true);
    }
  }
}

/**
 * test signPayment
 */
async function signPayment() {
  console.log("signPayment test start");
  const transactionData = window.transactionData.signPayment;
  const signResultMainnet = await auroSignLib.signTransaction(
    transactionData.mainnet.signParams
  );
  expect(
    JSON.stringify(signResultMainnet),
    JSON.stringify(transactionData.mainnet.signResult),
    "mainnet sendPayment"
  );
  const signResultTest = await auroSignLib.signTransaction(
    transactionData.testnet.signParams
  );
  expect(
    JSON.stringify(signResultTest),
    JSON.stringify(transactionData.testnet.signResult),
    "testnet sendPayment"
  );
  console.log("signPayment test successful");
}
async function signStakeTransaction() {
  console.log("signStakeTransaction test start");
  const transactionData = window.transactionData.signStakeTransaction;
  const signResultMainnet = await auroSignLib.signTransaction(
    transactionData.mainnet.signParams
  );
  expect(
    JSON.stringify(signResultMainnet),
    JSON.stringify(transactionData.mainnet.signResult),
    "mainnet signStakeTransaction"
  );

  const signResultTest = await auroSignLib.signTransaction(
    transactionData.testnet.signParams
  );
  expect(
    JSON.stringify(signResultTest),
    JSON.stringify(transactionData.testnet.signResult),
    "testnet signStakeTransaction"
  );
  console.log("signStakeTransaction test successful");
}
async function signZkTransaction() { 
  console.log("signZkTransaction test start");
  const transactionData = window.transactionData.signZkTransaction;
  let params = {
    ...transactionData.testnet.signParams,
    transaction: transactionData.testnet.signParams.transaction,
  };
  const signResultTest = await auroSignLib.signTransaction(params);
  expect(
    JSON.stringify(signResultTest),
    JSON.stringify(transactionData.testnet.signResult),
    "testnet signZkTransaction"
  );
  console.log("signZkTransaction test successful");
}
async function signMessage() {
  console.log("signMessage test start");
  const transactionData = window.transactionData.signMessageTransaction;
  const signResultMainnet = await auroSignLib.signTransaction(
    transactionData.mainnet.signParams
  );
  expect(
    JSON.stringify(signResultMainnet),
    JSON.stringify(transactionData.mainnet.signResult),
    "mainnet signMessage"
  );
  const verifyResultMain = await auroSignLib.verifyMessage({
    network: "mainnet",
    publicKey: transactionData.mainnet.signParams.publicKey,
    signature: transactionData.mainnet.signResult.signature,
    verifyMessage: transactionData.mainnet.signResult.data,
  });
  expect(verifyResultMain, true, "mainnet verifyMessage");
  const signResultTest = await auroSignLib.signTransaction(
    transactionData.testnet.signParams
  );
  expect(
    JSON.stringify(signResultTest),
    JSON.stringify(transactionData.testnet.signResult),
    "testnet signMessage"
  );

  const verifyResultTest = await auroSignLib.verifyMessage({
    network: "testnet",
    publicKey: transactionData.testnet.signParams.publicKey,
    signature: transactionData.testnet.signResult.signature,
    verifyMessage: transactionData.testnet.signResult.data,
  });
  expect(verifyResultTest, true, "testnet verifyMessage");
  console.log("signMessage test successful");
}

/** test sign */
async function runTransactionTest() {
  await signPayment();
  await signStakeTransaction();
  await signZkTransaction();
  await signMessage();
}

async function runFieldsTest() {
  console.log("runFieldsTest test start");
  const transactionData = window.transactionData.signFiledsData;
  const signResultMainnet = await auroSignLib.signFields(
    transactionData.mainnet.signParams
  );
  expect(
    signResultMainnet.signature,
    transactionData.mainnet.signResult.signature,
    "mainnet fieldsTest"
  );
  const verifyResultMain = await auroSignLib.verifyFieldsMessage({
    network: "mainnet",
    publicKey: transactionData.mainnet.signParams.publicKey,
    signature: transactionData.mainnet.signResult.signature,
    fields: transactionData.mainnet.signResult.data,
  });
  expect(verifyResultMain, true, "mainnet verifyMessage");
  const signResultTest = await auroSignLib.signFields(
    transactionData.testnet.signParams
  );
  expect(
    signResultTest.signature,
    transactionData.testnet.signResult.signature,
    "testnet fieldsTest"
  );

  const verifyResultTest = await auroSignLib.verifyFieldsMessage({
    network: "testnet",
    publicKey: signResultTest.publicKey,
    signature: signResultTest.signature,
    fields: signResultTest.data,
  });
  expect(verifyResultTest, true, "testnet verifyFields");
  console.log("runFieldsTest test successful");
}

async function runNullifierTest() {
  console.log("runNullifierTest test start");
  const transactionData = window.transactionData.nullifierData;
  const signResultMainnet = await auroSignLib.createNullifier(
    transactionData.mainnet.signParams
  );
  expect(!!signResultMainnet.private, true, "mainnet runNullifierTest");
  const signResultTest = await auroSignLib.createNullifier(
    transactionData.testnet.signParams
  );
  expect(!!signResultTest.private, true, "testnet runNullifierTest");
  console.log("runNullifierTest test successful");
}

async function runZkAppSignerTest() {
  console.log("runZkAppSignerTest test start");
  const transactionData = window.transactionData.signZkTransaction.testnet;
  const buildCommand = (lengths) => ({
    accountUpdates: lengths.map((length) => ({
      body: {
        update: {
          appState: Array(length).fill("0"),
        },
        preconditions: {
          account: {
            state: Array(length).fill("0"),
          },
        },
      },
    })),
  });

  const berkeleyCommand = buildCommand([8]);
  expect(
    JSON.stringify(zkAppSigner.getAccountUpdateStateLengths(berkeleyCommand)),
    JSON.stringify([8, 8]),
    "berkeley state lengths"
  );
  expect(
    zkAppSigner.getZkappCommandEra(berkeleyCommand),
    "berkeley",
    "berkeley era"
  );
  expect(
    zkAppSigner.hasUnsupportedZkappStateLength(berkeleyCommand),
    false,
    "berkeley unsupported"
  );

  const mesaCommand = buildCommand([32]);
  expect(
    zkAppSigner.getZkappCommandEra(mesaCommand),
    undefined,
    "mesa era"
  );
  expect(
    zkAppSigner.hasUnsupportedZkappStateLength(mesaCommand),
    false,
    "mesa unsupported"
  );

  expect(
    zkAppSigner.hasUnsupportedZkappStateLength(buildCommand([8, 32])),
    true,
    "mixed unsupported"
  );
  expect(
    zkAppSigner.hasUnsupportedZkappStateLength(buildCommand([16])),
    true,
    "unknown unsupported"
  );

  const unsupportedSignResult = await auroSignLib.signTransaction({
    network: "testnet",
    type: "zk",
    privateKey: "EKEfKdYoaCeGy4aZoCSam6DdGejrL121HSwFGrckzkLcLqPTMUxW",
    fromAddress: "B62qkVs6zgN84e1KjFxurigqTQ57FqV3KnWubV3t77E9R6uBm4DmkPi",
    fee: "0.2",
    nonce: "1",
    transaction: JSON.stringify(buildCommand([8, 32])),
  });
  expect(
    unsupportedSignResult.error.message,
    "unsupported zkapp state length",
    "unsupported signTransaction"
  );

  const delegatedFeePayerCommand = JSON.parse(
    transactionData.signParams.transaction
  );
  delegatedFeePayerCommand.feePayer.body.publicKey =
    "B62qk3FF1FxfFxfJ4CLSgu2YehPdRqcNZw7Jw3z1JMyH28cSNR6XYDW";
  delegatedFeePayerCommand.feePayer.body.fee = "300000000";
  delegatedFeePayerCommand.feePayer.body.nonce = "2";
  const delegatedFeePayerResult = await auroSignLib.signTransaction({
    ...transactionData.signParams,
    transaction: JSON.stringify(delegatedFeePayerCommand),
  });
  expect(
    delegatedFeePayerResult.data.feePayer.feePayer,
    delegatedFeePayerCommand.feePayer.body.publicKey,
    "transaction feePayer publicKey"
  );
  expect(
    delegatedFeePayerResult.data.feePayer.fee,
    delegatedFeePayerCommand.feePayer.body.fee,
    "transaction feePayer fee"
  );
  expect(
    delegatedFeePayerResult.data.feePayer.nonce,
    delegatedFeePayerCommand.feePayer.body.nonce,
    "transaction feePayer nonce"
  );
  console.log("runZkAppSignerTest test successful");
}

async function runTests() {
  /** test account  */
  await runAccountTest();

  /** test utils */
  await runUtilsTest();

  /** test transaction */
  await runTransactionTest();

  /** test fields */
  await runFieldsTest();

  /** create Nullifier */
  await runNullifierTest();

  /** zkApp signer era detection */
  await runZkAppSignerTest();

  console.log("all tests successful.");
}
window.runTests = runTests;
