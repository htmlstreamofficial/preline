<img src="https://preline.co/hero-image-2.jpg" alt="Hero Image" width="100%" height="auto">

<img src="https://preline.co/preline-logo.svg" alt="Logo" width="200" height="auto">

Preline UI is an open-source set of prebuilt UI components based on the utility-first Tailwind CSS framework.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why use Preline UI?

Based on the Tailwind CSS utility classes, Preline UI's prebuilt components and UI elements help you quickly design and customize responsive mobile-first websites with the components a website needs, including buttons, dropdowns, navigation bars, modals, and more.

## What's in the box?

Components are grouped by visual usability criteria (components, navigation, forms, etc.) and styled directly on top of Tailwind CSS, making them easy to extend and customize. This is a lifesaver for developers looking to create a unique and eye-catching design system without the hassle of creating each component by hand.

## Getting Started

### Quick Setup

This guide will help you get started with Preline UI, including how to run, customize, update, and integrate your project!

First, you need to make sure that you have a working <a href="https://tailwindcss.com/">Tailwind CSS</a> project installed and that you also have <a href="https://nodejs.org/en/">Node</a> and <a href="https://www.npmjs.com/">NPM</a> installed on your machine.

### Require via NPM

1. Install <code>preline</code> via npm

<pre><code>npm i preline</code></pre>

2. Include Preline UI as a plugin in the <code>tailwind.config.js</code> file

<pre><code>module.exports = {
  content: [
    'node_modules/preline/dist/*.js'
  ],
  plugins: [
    require('preline/plugin')
  ],
}</code></pre>

3. Include the JavaScript <code><script></code> that powers the interactive elements near the end of your <code>&lt;body&gt;</code> tag:

<pre><code><script src="./node_modules/preline/dist/preline.js"></script></code></pre>

## Documentation

For full documentation of the Preline options, visit <a href="https://preline.co/">preline.co</a>. The site also contains information on the wide variety of <a href="https://preline.co/plugins.html">plugins</a> that are available for TailwindCSS projects.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [GitHub Discussions](https://github.com/htmlstreamofficial/preline/discussions)

## License

Preline UI is Open Source project and licensed under [MIT](https://preline.co/docs/license.html).

Preline UI Figma is free for both commercial and personal projects, learn more [here](https://preline.co/license.html).
  
All brand icons are trademarks of their respective owners. The use of these trademarks does not indicate endorsement of the trademark holder by Preline UI, nor vice versa.

## A product of Htmlstream

Preline UI is built and maintend by [Htmlstream](https://htmlstream.com) team. Over the last decade at Htmlstream, our journey has involved crafting UI Components and Templates. This process has allowed us to understand and explore a range of strategies for developing versatile UI designs that can adapt to a variety of needs.

Share about Preline on [Twitter](https://twitter.com/prelineUI) and keep an eye on [Dribbble](https://dribbble.com/Htmlstream) for teasers of our upcoming UIs.
