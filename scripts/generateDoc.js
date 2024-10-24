// generateMarkdown.js
const fs = require('fs');
const utilities = require('../src/generated.json');

// Start building the markdown content
let markdownContent = `# Supported Tailwind CSS Utility Classes

Total number of classes: ${Object.keys(utilities).length}

`;

// Start the HTML table
markdownContent += '<table>\n';
markdownContent += '  <tr>\n';
markdownContent += '    <th>Class Name</th>\n';
markdownContent += '    <th>Styles</th>\n';
markdownContent += '  </tr>\n';

// Iterate over each utility class
for (const [className, styles] of Object.entries(utilities)) {
  // Prepare the styles string with <br> tags for line breaks
  const stylesList = Object.entries(styles)
    .map(([prop, value]) => `<code>${prop}: ${value};</code>`)
    .join('<br>'); // Use <br> tag for line breaks

  // Add the row to the HTML table
  markdownContent += '  <tr>\n';
  markdownContent += `    <td><code>${className}</code></td>\n`;
  markdownContent += `    <td>${stylesList}</td>\n`;
  markdownContent += '  </tr>\n';
}

// End the HTML table
markdownContent += '</table>\n';

// Write the markdown content to a file
fs.writeFile('SUPPORTED_CLASSES.md', markdownContent, (err) => {
  if (err) throw err;
  console.log('Markdown file has been generated: SUPPORTED_CLASSES.md');
});
