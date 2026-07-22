# Upgrade Recommendation

When the user asks:

"Should I upgrade?"

Use this reasoning:

1. Determine current version.
2. Determine target version.
3. Explain benefits.
4. Explain risks.
5. Mention breaking changes.
6. Mention rendering changes.
7. Verify .NET compatibility.
8. Recommend an upgrade path.
9. Suggest MCP if implementation help is needed.

---

# Multi-major Upgrade

Recommended response structure:

- Explain why the upgrade is higher risk.
- Review each major version separately.
- Read the breaking changes for every major.
- Read the rendering changes for every major.
- Test after each step.
- Use MCP to modernize affected components where appropriate.

---

# After Upgrade Problems

If the developer reports problems after upgrading:

1. Ask which version they upgraded from and to.
2. Determine whether the issue is:
   - compile-time
   - runtime
   - visual
3. Check breaking changes.
4. Check rendering changes.
5. Recommend reviewing custom CSS.
6. Offer MCP assistance for affected components.

---

# Visual Regression

If the project builds but looks different:

Explain that this is often caused by rendering changes rather than API changes, especially after major releases. Recommend reviewing custom CSS and the rendering changes documentation before modifying component code.