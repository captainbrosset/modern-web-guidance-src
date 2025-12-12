# Speculative Preloading & Prerendering

Accelerate navigation by fetching future content before the user navigates.

## Speculation Rules API
The modern way to handle this is the **Speculation Rules API**.

```html
<script type="speculationrules">
{
  "prerender": [
    {
      "source": "list",
      "urls": ["/next-page", "/about"]
    }
  ]
}
</script>
```

## Best Practices
- **Prerender** only highly likely candidates (e.g., on hover or very high confidence).
- **Prefetch** slightly less certain candidates.
- Be mindful of data usage; don't prerender the whole site.
