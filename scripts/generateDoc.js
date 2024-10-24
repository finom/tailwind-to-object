// generateMarkdown.js
const fs = require('fs');
const utilities = require('../src/generated.json')


  // Start building the markdown content
  let markdownContent = '# Supported Tailwind CSS Utility Classes\n\n';

  // Add the table header
  markdownContent += '| Class Name | Styles |\n';
  markdownContent += '|------------|--------|\n';

  // Iterate over each utility class
  for (const [className, styles] of Object.entries(utilities)) {
    // Prepare the styles string
    const stylesList = Object.entries(styles)
      .map(([prop, value]) => `${prop}: ${value}`)
      .join('  \n'); // Use two spaces and a newline for Markdown line break

    // Escape pipe characters in className and stylesList
    const escapedClassName = className.replace(/\|/g, '\\|');
    const escapedStylesList = stylesList.replace(/\|/g, '\\|');

    // Add the row to the markdown table
    markdownContent += `| \`${escapedClassName}\` | ${escapedStylesList} |\n`;
  }

  // Write the markdown content to a file
  fs.writeFile('SUPPORTED_CLASSES.md', markdownContent, (err) => {
    if (err) throw err;
    console.log('Markdown file has been generated: tailwindUtilities.md');
  });

