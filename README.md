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

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

<a href="https://github.com/htmlstreamofficial/preline/discussions">Discuss Preline UI on GitHub</a>

## License

Preline UI is Open Source project and licensed under MIT for better Web.

Learn more <a href="https://preline.co/docs/license.html">here</a>.

## A product of Htmlstream

Preline Ui is built by the team that has customers in the background such us Stanford University, The University of Maryland, University of Victoria and many more Governments, Corporate Agencies.

Our soical network profiles:

<ul>
  <li><a href="https://twitter.com/Htmlstream">Twitter</a></li>
  <li><a href="https://www.facebook.com/Htmlstream/">Facebook</a></li>
  <li><a href="https://dribbble.com/Htmlstream">Dribbble</a></li>
  <li><a href="https://www.instagram.com/htmlstream/">Instagram</a></li>
</ul>
