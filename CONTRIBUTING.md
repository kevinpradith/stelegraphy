# Contributing

Issues and pull requests are welcome.

## Licensing of contributions

By opening a pull request you agree that your contribution is licensed under the
[MIT License](LICENSE), the same terms as the rest of the project. There is no
separate agreement to sign. This is worth stating rather than assuming: without
it, a contribution stays under its author's exclusive copyright and the project
has no clear right to ship it.

## One thing that will not be merged

A pull request that presents the cipher as secure, or that removes the warning
saying it is not, will be closed. Making the runes look better is welcome.
Claiming they protect anything is not. If you want to add real encryption, that
is a different program built on `crypto.subtle`, and it is worth its own
repository rather than a flag in this one.

## Before you open a pull request

```sh
npm install
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

CI runs the same six commands on Node 22.18 and 24. Formatting is Prettier's,
pinned to an exact version and configured in `.prettierrc.json`: 100 columns,
single quotes, no semicolons. `npm run format` writes it, and CI runs
`format:check` rather than `format`, so a pull request is told what to run
instead of having its diff rewritten underneath it.

## Touching the cipher

`src/lib/crypto.ts` has tests in `test/crypto.test.ts`, and a change to the
transform will break the round trip in an obvious way or in a way only the
Unicode case catches. Add the case rather than adjusting the expectation.

Anything that changes the ciphertext for an input that already worked is a
breaking change, because runes somebody saved last year should still decode. Say
so in the pull request, and it goes in the changelog under that heading.

`npm test` compiles with `tsc` into `.test-build/` before running `node:test`,
rather than relying on Node's built-in type stripping, which is absent from some
distribution builds of Node. If your Node has it, the direct run works too:

```sh
node --experimental-strip-types --test test/*.test.ts
```

## Commits

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): a
`type(scope): summary` line in the imperative, under about 72 characters, with
the body explaining why rather than what. `feat`, `fix`, `docs`, `style`,
`refactor`, `test`, `build`, `ci`, `chore`, and `!` before the colon for a change
that breaks decoding of existing runes.

The subject says what the change does to the program, not which files moved. Six
commits reading `feat: add global CSS styles for the application` are six commits
nobody can tell apart later.

## Signed commits

Commits on `main` are signed, with an SSH key rather than GPG: Git has supported
it since 2.34, the key is an `ssh-ed25519` one GitHub verifies the same way, and
there is no keyring to keep alive. The settings live in this repository rather
than in a global config, so cloning it does not change how you commit anywhere
else:

```sh
ssh-keygen -t ed25519 -C "you@example.com (stelegraphy signing)" -f ~/.ssh/id_ed25519_signing
git config gpg.format ssh
git config user.signingkey ~/.ssh/id_ed25519_signing.pub
git config commit.gpgsign true
git config tag.gpgsign true
```

Add the public key to your account as a **signing key**. That list is separate
from authentication keys, and a key in the wrong list verifies nothing.

A signature says the commit came from the key it names. It does not say the
change is correct, and it is not a substitute for reading one.

## Reporting something

- A bug or a request: [open an issue](https://github.com/kevinpradith/stelegraphy/issues/new/choose).
- A security issue: privately, per [SECURITY.md](SECURITY.md). Note the first
  section there before reporting that the cipher is weak.
