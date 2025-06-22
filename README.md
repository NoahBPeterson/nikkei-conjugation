# Nikkei Conjugation Practice

This is a simple, single-page web application for practicing Japanese verb conjugations. It uses the JMDict dictionary file to source its verbs and provides a clean interface for drilling various grammatical forms.

## Features

-   Randomly selects verbs from a comprehensive dictionary.
-   Quizzes on multiple conjugation forms (Polite, Past, Negative, etc.).
-   Simple, intuitive interface.
-   Settings panel to select which conjugation forms to practice.
-   Runs entirely in the browser after initial setup.

## Setup and Installation

To run this website locally, you need two files in the same directory:
1.  `index.html` (this repository's main file)
2.  `JMdict_e.xml` (the dictionary data file)

### 1. Download the Dictionary File

The application requires the English-only version of the JMdict file to function.

-   Go to the official JMDict Project website: [https://www.edrdg.org/jmdict/j_jmdict.html](https://www.edrdg.org/jmdict/j_jmdict.html)
-   Find the link for **"the current version with only the English translations"** and download it.
-   Rename the downloaded file to `JMdict_e.xml` and place it in the same directory as `index.html`.

### 2. Run a Local Web Server

Because of web browser security policies (CORS), you cannot simply open `index.html` directly from your filesystem. You must serve it via a local web server.

If you have Bun installed, you can easily do this with the following command from your project directory:

```bash
bunx http-server
```

This will start a server. It will print the local addresses where the site is available, typically:

```
Available on:
  http://127.0.0.1:8080
  http://<your-local-ip>:8080
```

### 3. Open in Browser

Open your web browser and navigate to [http://localhost:8080](http://localhost:8080). The application should load, parse the dictionary file, and present you with your first conjugation question.

## License

The JMDict dictionary data is used in accordance with the Creative Commons Attribution-ShareAlike Licence (V4.0). Please see the footer of the web application for full attribution. 