# Research Notes

Source for a static site collecting research notes and write-ups.

Built on the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template)
(adopted from [Nerfies](https://nerfies.github.io/)), so the Bulma-based styling and
helper scripts under `static/` carry over.

## Layout

```
index.html          landing page / notes index
static/css/         bulma + template styles (index.css holds the custom rules)
static/js/          carousel, slider, fontawesome, template helpers
static/images/      figures (empty)
static/videos/      videos (empty)
static/pdfs/        PDFs (empty)
```

## Local preview

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## TODO

- Add a favicon at `static/images/favicon.ico` and uncomment the `<link rel="icon">` in `index.html`
- Set the canonical URL in the `og:url` meta tag
- Decide the note structure (single long page vs. an index linking per-note pages)

## Website License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
