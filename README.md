# Nikkei Conjugation Practice

This is a simple, single-page web application for practicing Japanese verb conjugations. It uses a pre-processed and compressed JSON file derived from the JMDict dictionary file to source its verbs, providing a clean and fast interface for drilling various grammatical forms.

## Features

-   Randomly selects verbs from a comprehensive dictionary.
-   Quizzes on multiple conjugation forms (Polite, Past, Negative, etc.).
-   Simple, intuitive interface.
-   **Extremely fast loading** thanks to a pre-compiled and compressed Gzip file (`.json.gz`).
-   Settings panel to select which conjugation forms to practice.
-   Runs entirely in the browser after an initial build step.

## Setup and Installation

The setup process involves a one-time build step to convert the large `JMdict_e.xml` dictionary file into a compact, compressed `verbs.json.gz` file that the web application uses.

### 1. Download the Dictionary File

First, you need the English-only version of the JMdict file.

-   Go to the official JMDict Project website: [https://www.edrdg.org/jmdict/j_jmdict.html](https://www.edrdg.org/jmdict/j_jmdict.html)
-   Find the link for **"the current version with only the English translations"** and download it.
-   Rename the downloaded file to `JMdict_e.xml` and place it in the project's root directory.

### 2. Install Dependencies and Build

With `JMdict_e.xml` in your project folder, you can now generate the compressed verb file. You will need [Bun](https://bun.sh/) installed for these commands.

First, install the necessary script dependencies (`xml-js` for parsing and `pako` for compression):
```bash
bun install
```

Next, run the build script:
```bash
bun build.js
```
This will read the large XML file, create an intermediate `verbs.json` file, and finally produce a much smaller, compressed `verbs.json.gz`. This may take a few moments.

### 3. Run the Local Web Server

Because of web browser security policies, you must serve the files via a local web server.

```bash
bunx http-server
```

This will start a server and print the local addresses where the site is available (e.g., `http://localhost:8080`).

### 4. Open in Browser

Open your web browser and navigate to [http://localhost:8080](http://localhost:8080). The application should load the tiny compressed file almost instantly, decompress it, and present you with your first conjugation question.

## License

The JMDict dictionary data is used in accordance with the Creative Commons Attribution-ShareAlike Licence (V4.0). Please see the footer of the web application for full attribution. 