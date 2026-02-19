To test a use case:

Create a `golden-demo.html`, `negative-demo.html` and a test file (`<use-case-name>.grader.js`), then from within `use-cases` dir:

```
pnpm install
pnpm playwright install
pnpm test <use-case-dir>
```