import React, { useState, useEffect } from 'react';
import { X, Search, Check, MoreVertical, Copy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const snippets = {
  html: [
    { name: 'Basic Structure', code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>` },
    { name: 'Navigation', code: `<nav>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#services">Services</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>` },
    { name: 'Form', code: `<form action="/submit" method="post">\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name" required>\n  \n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n  \n  <label for="message">Message:</label>\n  <textarea id="message" name="message" required></textarea>\n  \n  <button type="submit">Submit</button>\n</form>` },
    { name: 'Responsive Image', code: `<picture>\n  <source srcset="img-large.jpg" media="(min-width: 800px)">\n  <source srcset="img-medium.jpg" media="(min-width: 400px)">\n  <img src="img-small.jpg" alt="Description" style="width:auto;">\n</picture>` },
    { name: 'Semantic Article', code: `<article>\n  <header>\n    <h1>Article Title</h1>\n    <p>Posted by John Doe on <time datetime="2023-05-15">May 15, 2023</time></p>\n  </header>\n  <p>Article content goes here...</p>\n  <footer>\n    <p>Tags: <a href="#">web</a>, <a href="#">html</a>, <a href="#">semantic</a></p>\n  </footer>\n</article>` },
    { name: 'Video Player', code: `<video width="320" height="240" controls>\n  <source src="movie.mp4" type="video/mp4">\n  <source src="movie.ogg" type="video/ogg">\n  Your browser does not support the video tag.\n</video>` },
    { name: 'Table', code: `<table>\n  <thead>\n    <tr>\n      <th>Header 1</th>\n      <th>Header 2</th>\n      <th>Header 3</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Row 1, Cell 1</td>\n      <td>Row 1, Cell 2</td>\n      <td>Row 1, Cell 3</td>\n    </tr>\n    <tr>\n      <td>Row 2, Cell 1</td>\n      <td>Row 2, Cell 2</td>\n      <td>Row 2, Cell 3</td>\n    </tr>\n  </tbody>\n</table>` },
    { name: 'Meta Tags', code: `<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="A brief description of your page">\n<meta name="keywords" content="your, keywords, here">\n<meta name="author" content="Your Name">\n<meta property="og:title" content="Your Page Title">\n<meta property="og:description" content="Brief description for social media">\n<meta property="og:image" content="https://example.com/image.jpg">\n<meta property="og:url" content="https://example.com/page">\n<meta name="twitter:card" content="summary_large_image">` },
    { name: 'Accordion', code: `<div class="accordion">\n  <div class="accordion-item">\n    <h2 class="accordion-header">\n      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">\n        Accordion Item #1\n      </button>\n    </h2>\n    <div id="collapseOne" class="accordion-collapse collapse show">\n      <div class="accordion-body">\n        Content for accordion item #1 goes here.\n      </div>\n    </div>\n  </div>\n  <!-- More accordion items -->\n</div>` },
    { name: 'Modal', code: `<button id="openModal">Open Modal</button>\n\n<div id="myModal" class="modal">\n  <div class="modal-content">\n    <span class="close">&times;</span>\n    <h2>Modal Title</h2>\n    <p>This is the modal content.</p>\n  </div>\n</div>\n\n<script>\n  // Modal functionality would go here\n</script>` },
    { name: 'Responsive Grid', code: `<div class="grid-container">\n  <div class="grid-item">1</div>\n  <div class="grid-item">2</div>\n  <div class="grid-item">3</div>\n  <div class="grid-item">4</div>\n  <div class="grid-item">5</div>\n  <div class="grid-item">6</div>\n</div>\n\n<style>\n  .grid-container {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n    gap: 20px;\n  }\n  .grid-item {\n    background-color: #f1f1f1;\n    padding: 20px;\n    text-align: center;\n  }\n</style>` },
    { name: 'Flexbox Layout', code: `<div class="flex-container">\n  <div class="flex-item">1</div>\n  <div class="flex-item">2</div>\n  <div class="flex-item">3</div>\n</div>\n\n<style>\n  .flex-container {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n  }\n  .flex-item {\n    flex: 1;\n    margin: 10px;\n    padding: 20px;\n    background-color: #f1f1f1;\n    text-align: center;\n  }\n</style>` },
    { name: 'Card Component', code: `<div class="card">\n  <img src="image.jpg" alt="Card image" style="width:100%">\n  <div class="card-content">\n    <h4><b>Card Title</b></h4>\n    <p>Some description text</p>\n  </div>\n</div>\n\n<style>\n  .card {\n    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);\n    transition: 0.3s;\n    width: 300px;\n  }\n  .card:hover {\n    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);\n  }\n  .card-content {\n    padding: 2px 16px;\n  }\n</style>` },
    { name: 'Responsive Navigation', code: `<nav class="navbar">\n  <ul class="nav-menu">\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#services">Services</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n  <div class="hamburger">\n    <span class="bar"></span>\n    <span class="bar"></span>\n    <span class="bar"></span>\n  </div>\n</nav>\n\n<style>\n  .navbar {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1rem 1.5rem;\n  }\n  .hamburger {\n    display: none;\n  }\n  .bar {\n    display: block;\n    width: 25px;\n    height: 3px;\n    margin: 5px auto;\n    background-color: #333;\n  }\n  @media (max-width: 768px) {\n    .nav-menu {\n      position: fixed;\n      left: -100%;\n      top: 5rem;\n      flex-direction: column;\n      background-color: #fff;\n      width: 100%;\n      text-align: center;\n      transition: 0.3s;\n      box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);\n    }\n    .nav-menu.active {\n      left: 0;\n    }\n    .hamburger {\n      display: block;\n      cursor: pointer;\n    }\n  }\n</style>` },
    { name: 'Lazy Loading Image', code: `<img src="placeholder.jpg" data-src="actual-image.jpg" alt="Lazy loaded image" class="lazy-image">\n\n<script>\n  document.addEventListener("DOMContentLoaded", function() {\n    var lazyImages = [].slice.call(document.querySelectorAll("img.lazy-image"));\n\n    if ("IntersectionObserver" in window) {\n      let lazyImageObserver = new IntersectionObserver(function(entries, observer) {\n        entries.forEach(function(entry) {\n          if (entry.isIntersecting) {\n            let lazyImage = entry.target;\n            lazyImage.src = lazyImage.dataset.src;\n            lazyImage.classList.remove("lazy-image");\n            lazyImageObserver.unobserve(lazyImage);\n          }\n        });\n      });\n\n      lazyImages.forEach(function(lazyImage) {\n        lazyImageObserver.observe(lazyImage);\n      });\n    }\n  });\n</script>` },
    { name: 'SVG Icon', code: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>` },
    { name: 'Responsive Iframe', code: `<div class="iframe-container">\n  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>\n</div>\n\n<style>\n  .iframe-container {\n    position: relative;\n    width: 100%;\n    padding-bottom: 56.25%; /* 16:9 Aspect Ratio */\n    height: 0;\n  }\n  .iframe-container iframe {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n  }\n</style>` },
    { name: 'Custom Checkbox', code: `<label class="custom-checkbox">\n  <input type="checkbox">\n  <span class="checkmark"></span>\n  Custom Checkbox\n</label>\n\n<style>\n  .custom-checkbox {\n    display: block;\n    position: relative;\n    padding-left: 35px;\n    margin-bottom: 12px;\n    cursor: pointer;\n    font-size: 16px;\n  }\n  .custom-checkbox input {\n    position: absolute;\n    opacity: 0;\n    cursor: pointer;\n    height: 0;\n    width: 0;\n  }\n  .checkmark {\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 25px;\n    width: 25px;\n    background-color: #eee;\n  }\n  .custom-checkbox:hover input ~ .checkmark {\n    background-color: #ccc;\n  }\n  .custom-checkbox input:checked ~ .checkmark {\n    background-color: #2196F3;\n  }\n  .checkmark:after {\n    content: "";\n    position: absolute;\n    display: none;\n  }\n  .custom-checkbox input:checked ~ .checkmark:after {\n    display: block;\n  }\n  .custom-checkbox .checkmark:after {\n    left: 9px;\n    top: 5px;\n    width: 5px;\n    height: 10px;\n    border: solid white;\n    border-width: 0 3px 3px 0;\n    transform: rotate(45deg);\n  }\n</style>` },
    { name: 'Responsive Tabs', code: `<div class="tabs">\n  <input type="radio" id="tab1" name="tab-control" checked>\n  <input type="radio" id="tab2" name="tab-control">\n  <input type="radio" id="tab3" name="tab-control">\n  <ul>\n    <li title="Features"><label for="tab1" role="button">Features</label></li>\n    <li title="Delivery Contents"><label for="tab2" role="button">Delivery Contents</label></li>\n    <li title="Shipping"><label for="tab3" role="button">Shipping</label></li>\n  </ul>\n  \n  <div class="slider"><div class="indicator"></div></div>\n  <div class="content">\n    <section>\n      <h2>Features</h2>\n      <p>Content for Features tab goes here.</p>\n    </section>\n    <section>\n      <h2>Delivery Contents</h2>\n      <p>Content for Delivery Contents tab goes here.</p>\n    </section>\n    <section>\n      <h2>Shipping</h2>\n      <p>Content for Shipping tab goes here.</p>\n    </section>\n  </div>\n</div>\n\n<style>\n  .tabs {\n    /* Add your styles here */\n  }\n  /* Add more styles for responsive tabs */\n</style>` },
    { name: 'Breadcrumb Navigation', code: `<nav aria-label="Breadcrumb">\n  <ol class="breadcrumb">\n    <li class="breadcrumb-item"><a href="#">Home</a></li>\n    <li class="breadcrumb-item"><a href="#">Category</a></li>\n    <li class="breadcrumb-item active" aria-current="page">Current Page</li>\n  </ol>\n</nav>\n\n<style>\n  .breadcrumb {\n    display: flex;\n    flex-wrap: wrap;\n    padding: 0.75rem 1rem;\n    list-style: none;\n    background-color: #e9ecef;\n    border-radius: 0.25rem;\n  }\n  .breadcrumb-item + .breadcrumb-item::before {\n    display: inline-block;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem;\n    color: #6c757d;\n    content: "/";\n  }\n  .breadcrumb-item.active {\n    color: #6c757d;\n  }\n</style>` },
    { name: 'Tooltip', code: `<div class="tooltip">Hover over me\n  <span class="tooltiptext">Tooltip text</span>\n</div>\n\n<style>\n  .tooltip {\n    position: relative;\n    display: inline-block;\n    border-bottom: 1px dotted black;\n  }\n  .tooltip .tooltiptext {\n    visibility: hidden;\n    width: 120px;\n    background-color: black;\n    color: #fff;\n    text-align: center;\n    border-radius: 6px;\n    padding: 5px 0;\n    position: absolute;\n    z-index: 1;\n    bottom: 125%;\n    left: 50%;\n    margin-left: -60px;\n    opacity: 0;\n    transition: opacity 0.3s;\n  }\n  .tooltip:hover .tooltiptext {\n    visibility: visible;\n    opacity: 1;\n  }\n</style>` },
  ],
  css: [
    { name: 'Flexbox Center', code: '.flex-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}' },
    { name: 'Grid Layout', code: '.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}' },
    { name: 'Responsive Image', code: '.responsive-image {\n  max-width: 100%;\n  height: auto;\n}' },
    { name: 'CSS Reset', code: '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml, body {\n  height: 100%;\n}\n\nbody {\n  line-height: 1.5;\n  -webkit-font-smoothing: antialiased;\n}\n\nimg, picture, video, canvas, svg {\n  display: block;\n  max-width: 100%;\n}\n\ninput, button, textarea, select {\n  font: inherit;\n}\n\np, h1, h2, h3, h4, h5, h6 {\n  overflow-wrap: break-word;\n}\n\n#root, #__next {\n  isolation: isolate;\n}' },
    { name: 'Custom Scrollbar', code: '::-webkit-scrollbar {\n  width: 10px;\n}\n\n::-webkit-scrollbar-track {\n  background: #f1f1f1;\n}\n\n::-webkit-scrollbar-thumb {\n  background: #888;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}' },
    { name: 'Glassmorphism', code: '.glassmorphism {\n  background: rgba(255, 255, 255, 0.25);\n  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);\n  backdrop-filter: blur(4px);\n  -webkit-backdrop-filter: blur(4px);\n  border-radius: 10px;\n  border: 1px solid rgba(255, 255, 255, 0.18);\n}' },
    { name: 'Neon Text', code: '.neon-text {\n  font-size: 60px;\n  color: #fff;\n  text-shadow:\n    0 0 7px #fff,\n    0 0 10px #fff,\n    0 0 21px #fff,\n    0 0 42px #0fa,\n    0 0 82px #0fa,\n    0 0 92px #0fa,\n    0 0 102px #0fa,\n    0 0 151px #0fa;\n}' },
    { name: 'Animated Gradient Background', code: '@keyframes gradient {\n  0% {\n    background-position: 0% 50%;\n  }\n  50% {\n    background-position: 100% 50%;\n  }\n  100% {\n    background-position: 0% 50%;\n  }\n}\n\n.animated-gradient {\n  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);\n  background-size: 400% 400%;\n  animation: gradient 15s ease infinite;\n}' },
    { name: 'Truncate Text', code: '.truncate {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}' },
    { name: 'Responsive Typography', code: 'html {\n  font-size: 16px;\n}\n\n@media screen and (min-width: 320px) {\n  html {\n    font-size: calc(16px + 6 * ((100vw - 320px) / 680));\n  }\n}\n\n@media screen and (min-width: 1000px) {\n  html {\n    font-size: 22px;\n  }\n}' },
    { name: 'CSS Triangle', code: '.triangle {\n  width: 0;\n  height: 0;\n  border-left: 25px solid transparent;\n  border-right: 25px solid transparent;\n  border-bottom: 50px solid #555;\n}' },
    { name: 'Sticky Footer', code: 'body {\n  display: flex;\n  min-height: 100vh;\n  flex-direction: column;\n}\n\nmain {\n  flex: 1 0 auto;\n}\n\nfooter {\n  flex-shrink: 0;\n}' },
    { name: 'Custom Checkbox', code: '.custom-checkbox {\n  display: inline-block;\n  position: relative;\n  padding-left: 35px;\n  margin-bottom: 12px;\n  cursor: pointer;\n  font-size: 22px;\n  user-select: none;\n}\n\n.custom-checkbox input {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer;\n  height: 0;\n  width: 0;\n}\n\n.checkmark {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 25px;\n  width: 25px;\n  background-color: #eee;\n}\n\n.custom-checkbox:hover input ~ .checkmark {\n  background-color: #ccc;\n}\n\n.custom-checkbox input:checked ~ .checkmark {\n  background-color: #2196F3;\n}\n\n.checkmark:after {\n  content: "";\n  position: absolute;\n  display: none;\n}\n\n.custom-checkbox input:checked ~ .checkmark:after {\n  display: block;\n}\n\n.custom-checkbox .checkmark:after {\n  left: 9px;\n  top: 5px;\n  width: 5px;\n  height: 10px;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  transform: rotate(45deg);\n}' },
    { name: 'Hamburger Menu Icon', code: '.hamburger {\n  width: 30px;\n  height: 3px;\n  background: black;\n  position: relative;\n  cursor: pointer;\n}\n\n.hamburger::before,\n.hamburger::after {\n  content: "";\n  position: absolute;\n  width: 30px;\n  height: 3px;\n  background: black;\n}\n\n.hamburger::before {\n  top: -10px;\n}\n\n.hamburger::after {\n  top: 10px;\n}' },
    { name: 'Parallax Scrolling', code: '.parallax {\n  background-image: url("background.jpg");\n  min-height: 500px;\n  background-attachment: fixed;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n}' },
    { name: 'CSS-only Accordion', code: '.accordion {\n  max-width: 600px;\n  margin: 0 auto;\n  border: 1px solid #ddd;\n}\n\n.accordion-item {\n  border-bottom: 1px solid #ddd;\n}\n\n.accordion-item:last-child {\n  border-bottom: none;\n}\n\n.accordion-header {\n  padding: 15px;\n  background-color: #f4f4f4;\n  cursor: pointer;\n}\n\n.accordion-content {\n  max-height: 0;\n  overflow: hidden;\n  transition: max-height 0.3s ease-out;\n}\n\n.accordion-item input[type="checkbox"] {\n  display: none;\n}\n\n.accordion-item input[type="checkbox"]:checked ~ .accordion-content {\n  max-height: 1000px;\n  transition: max-height 0.5s ease-in;\n}' },
    { name: 'Responsive Card Grid', code: '.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n}\n\n.card {\n  background: white;\n  padding: 20px;\n  border-radius: 5px;\n  box-shadow: 0 2px 5px rgba(0,0,0,0.1);\n}' },
    { name: 'Animated Loading Spinner', code: '@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n.spinner {\n  border: 4px solid rgba(0, 0, 0, 0.1);\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  border-left-color: #09f;\n  animation: spin 1s ease infinite;\n}' },
    { name: 'CSS-only Tabs', code: '.tabs {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.tabs label {\n  order: 1;\n  display: block;\n  padding: 1rem 2rem;\n  margin-right: 0.2rem;\n  cursor: pointer;\n  background: #ddd;\n  font-weight: bold;\n  transition: background ease 0.2s;\n}\n\n.tabs .tab {\n  order: 99;\n  flex-grow: 1;\n  width: 100%;\n  display: none;\n  padding: 1rem;\n  background: #fff;\n}\n\n.tabs input[type="radio"] {\n  display: none;\n}\n\n.tabs input[type="radio"]:checked + label {\n  background: #fff;\n}\n\n.tabs input[type="radio"]:checked + label + .tab {\n  display: block;\n}' },
  ],
  js: [
    { name: 'Fetch API', code: 'fetch("https://api.example.com/data")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error("Error:", error));' },
    { name: 'Event Listener', code: 'document.getElementById("myButton").addEventListener("click", function() {\n  console.log("Button clicked!");\n});' },
    { name: 'Local Storage', code: '// Set item\nlocaleStorage.setItem("key", "value");\n\n// Get item\nconst value = localStorage.getItem("key");\n\n// Remove item\nlocaleStorage.removeItem("key");' },
    { name: 'Debounce Function', code: 'function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}' },
    { name: 'Async/Await Function', code: 'async function fetchData() {\n  try {\n    const response = await fetch("https://api.example.com/data");\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error("Error:", error);\n  }\n}' },
    { name: 'Array Methods', code: 'const numbers = [1, 2, 3, 4, 5];\n\n// Map\nconst doubled = numbers.map(num => num * 2);\n\n// Filter\nconst evens = numbers.filter(num => num % 2 === 0);\n\n// Reduce\nconst sum = numbers.reduce((acc, num) => acc + num, 0);' },
    { name: 'Object Destructuring', code: 'const person = {\n  name: "John Doe",\n  age: 30,\n  city: "New York"\n};\n\nconst { name, age } = person;\nconsole.log(name); // "John Doe"\nconsole.log(age); // 30' },
    { name: 'Promise All', code: 'const promise1 = Promise.resolve(3);\nconst promise2 = 42;\nconst promise3 = new Promise((resolve, reject) => {\n  setTimeout(resolve, 100, "foo");\n});\n\nPromise.all([promise1, promise2, promise3]).then((values) => {\n  console.log(values); // [3, 42, "foo"]\n});' },
    { name: 'Intersection Observer', code: 'const observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      console.log("Element is visible");\n    }\n  });\n});\n\nconst target = document.querySelector("#myElement");\nobserver.observe(target);' },
    { name: 'Web Worker', code: '// main.js\nconst worker = new Worker("worker.js");\n\nworker.postMessage({ data: "Hello from main" });\n\nworker.onmessage = function(event) {\n  console.log("Received from worker:", event.data);\n};\n\n// worker.js\nself.onmessage = function(event) {\n  console.log("Receive in worker:", event.data);\n  self.postMessage({ result: "Hello from worker" });\n};' },
    { name: 'Throttle Function', code: 'function throttle(func, limit) {\n  let inThrottle;\n  return function() {\n    const args = arguments;\n    const context = this;\n    if (!inThrottle) {\n      func.apply(context, args);\n      inThrottle = true;\n      setTimeout(() => inThrottle = false, limit);\n    }\n  }\n}' },
    { name: 'Deep Clone Object', code: 'function deepClone(obj) {\n  if (obj === null || typeof obj !== "object") {\n    return obj;\n  }\n  \n  if (Array.isArray(obj)) {\n    return obj.map(deepClone);\n  }\n  \n  const clonedObj = {};\n  for (let key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      clonedObj[key] = deepClone(obj[key]);\n    }\n  }\n  \n  return clonedObj;\n}' },
    { name: 'Memoization', code: 'function memoize(fn) {\n  const cache = {};\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (key in cache) {\n      return cache[key];\n    }\n    const result = fn.apply(this, args);\n    cache[key] = result;\n    return result;\n  }\n}' },
    { name: 'Curry Function', code: 'function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    } else {\n      return function(...args2) {\n        return curried.apply(this, args.concat(args2));\n      }\n    }\n  };\n}' },
    { name: 'Pub/Sub Pattern', code: 'const PubSub = {\n  events: {},\n  subscribe: function(eventName, fn) {\n    this.events[eventName] = this.events[eventName] || [];\n    this.events[eventName].push(fn);\n  },\n  unsubscribe: function(eventName, fn) {\n    if (this.events[eventName]) {\n      this.events[eventName] = this.events[eventName].filter(f => f !== fn);\n    }\n  },\n  publish: function(eventName, data) {\n    if (this.events[eventName]) {\n      this.events[eventName].forEach(fn => fn(data));\n    }\n  }\n};' },
    { name: 'Lazy Loading Images', code: 'document.addEventListener("DOMContentLoaded", function() {\n  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));\n\n  if ("IntersectionObserver" in window) {\n    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {\n      entries.forEach(function(entry) {\n        if (entry.isIntersecting) {\n          let lazyImage = entry.target;\n          lazyImage.src = lazyImage.dataset.src;\n          lazyImage.classList.remove("lazy");\n          lazyImageObserver.unobserve(lazyImage);\n        }\n      });\n    });\n\n    lazyImages.forEach(function(lazyImage) {\n      lazyImageObserver.observe(lazyImage);\n    });\n  }\n});' },
    { name: 'Drag and Drop', code: 'function dragStart(event) {\n  event.dataTransfer.setData("text/plain", event.target.id);\n}\n\nfunction allowDrop(event) {\n  event.preventDefault();\n}\n\nfunction drop(event) {\n  event.preventDefault();\n  var data = event.dataTransfer.getData("text");\n  event.target.appendChild(document.getElementById(data));\n}\n\n// HTML:\n// <div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>\n// <img id="drag1" src="img_logo.gif" draggable="true" ondragstart="dragStart(event)" width="336" height="69">' },
    { name: 'Infinite Scroll', code: 'window.addEventListener("scroll", () => {\n  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {\n    loadMoreContent();\n  }\n});\n\nfunction loadMoreContent() {\n  // Fetch and append more content\n  console.log("Loading more content...");\n}' },
    { name: 'Form Validation', code: 'function validateForm() {\n  let form = document.forms["myForm"];\n  let email = form["email"].value;\n  let password = form["password"].value;\n  \n  if (email == "") {\n    alert("Email must be filled out");\n    return false;\n  }\n  \n  if (password.length < 8) {\n    alert("Password must be at least 8 characters long");\n    return false;\n  }\n  \n  return true;\n}\n\n// HTML:\n// <form name="myForm" onsubmit="return validateForm()" method="post">\n//   Email: <input type="text" name="email">\n//   Password: <input type="password" name="password">\n//   <input type="submit" value="Submit">\n// </form>' },
  ],
};

const CodeSnippetLibrary = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredSnippets = snippets[activeTab].filter(snippet =>
    snippet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (code, snippetName) => {
    navigator.clipboard.writeText(code);
    setCopiedStates({ ...copiedStates, [snippetName]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [snippetName]: false });
    }, 2000);
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
    });
  };

  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'inset-y-4 right-4 w-96'} bg-gray-800 z-50 flex flex-col overflow-hidden ${isMobile ? '' : 'rounded-lg'}`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Code Snippet Library</h2>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-700 text-white border-gray-600">
              <DropdownMenuItem onSelect={() => setActiveTab('html')} className="hover:bg-gray-600">
                HTML
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('css')} className="hover:bg-gray-600">
                CSS
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('js')} className="hover:bg-gray-600">
                JavaScript
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Input
          type="text"
          placeholder="Search snippets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-700 text-white border-gray-600"
        />
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          {filteredSnippets.map((snippet, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-semibold">{snippet.name}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(snippet.code, snippet.name)}
                        className={copiedStates[snippet.name] ? "text-green-500" : ""}
                      >
                        {copiedStates[snippet.name] ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copiedStates[snippet.name] ? "Copied!" : "Copy to clipboard"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <pre className="bg-gray-800 p-2 rounded text-sm text-white overflow-x-auto whitespace-pre-wrap break-all">
                <code>{snippet.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CodeSnippetLibrary;