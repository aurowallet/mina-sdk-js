function getAccountUpdateBody(accountUpdate) {
  if (!accountUpdate || typeof accountUpdate !== "object") return null;
  const body = accountUpdate.body;
  if (!body || typeof body !== "object") return null;
  return body;
}

function getUpdateAppStateLength(body) {
  const update = body.update;
  if (!update || typeof update !== "object") return null;
  const appState = update.appState;
  return Array.isArray(appState) ? appState.length : null;
}

function getAccountPreconditionStateLength(body) {
  const preconditions = body.preconditions;
  const account =
    preconditions && typeof preconditions === "object"
      ? preconditions.account
      : undefined;
  if (!account || typeof account !== "object") return null;
  const state = account.state;
  return Array.isArray(state) ? state.length : null;
}

export function getAccountUpdateStateLengths(zkappCommand) {
  if (!zkappCommand || typeof zkappCommand !== "object") return [];
  const accountUpdates = zkappCommand.accountUpdates;
  if (!Array.isArray(accountUpdates)) return [];

  const lengths = [];
  accountUpdates.forEach((accountUpdate) => {
    const body = getAccountUpdateBody(accountUpdate);
    if (!body) return;

    const appStateLength = getUpdateAppStateLength(body);
    if (appStateLength !== null) {
      lengths.push(appStateLength);
    }

    const accountStateLength = getAccountPreconditionStateLength(body);
    if (accountStateLength !== null) {
      lengths.push(accountStateLength);
    }
  });

  return lengths;
}

export function getZkappCommandEra(zkappCommand) {
  const stateLengths = getAccountUpdateStateLengths(zkappCommand);

  if (stateLengths.includes(8)) return "berkeley";
  return undefined;
}

export function hasUnsupportedZkappStateLength(zkappCommand) {
  const stateLengths = getAccountUpdateStateLengths(zkappCommand);
  const hasBerkeleyState = stateLengths.includes(8);
  const hasMesaState = stateLengths.includes(32);
  const hasUnknownState = stateLengths.some(
    (length) => length !== 8 && length !== 32
  );

  return hasUnknownState || (hasBerkeleyState && hasMesaState);
}

export default {
  getAccountUpdateStateLengths,
  getZkappCommandEra,
  hasUnsupportedZkappStateLength,
};
