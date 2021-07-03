# Workflow(s)

This project has one [CI pipeline](./workflows/assignment-zip-artifact.yml) for creating an artifact containing:

- The repository as `zip`
- The LaTeX documentation as `pdf`
- The presentation as `pptx`

All files are renamed including the current date. The pipeline  is triggered on each push to `master`.
