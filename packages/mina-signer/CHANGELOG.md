# Changelog
All notable changes to this project will be documented in this file.

## [3.0.0]
- Expose zkApp command commitment calculation through `zkAppSigner` for WebView consumers.
- Preserve the zkApp fee payer `validUntil` value in software signing requests.
- Share network-aware signing client initialization across signing and commitment flows.
- Update the package version to 3.0.0 and the Mina signer runtime version to 4.1.0-1002.

## [2.0.0]
- Upgrade mina-signer to 4.1.0
- Add zkApp signing support with era detection
- Support zkApp signing with explicit transaction fee payer
- Reject unsupported or mixed zkApp state lengths

## [1.1.0]
- Update network init method

## [1.0.7]
- Fix audit issue
