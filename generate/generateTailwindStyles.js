// parseTailwind.js
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const postcssJs = require('postcss-js');

// Helper function to convert kebab-case to camelCase
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Helper function to convert RGB to Hex
function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('').toUpperCase()
  );
}

fs.readFile(path.join(__dirname, 'output.css'), 'utf8', (err, css) => {
  if (err) throw err;

  postcss()
    .process(css, { from: undefined })
    .then((result) => {
      const root = result.root;

      // Collect default variables from the universal selector
      const defaultVariables = {};

      root.walkRules((rule) => {
        if (rule.selector === '*, ::before, ::after') {
          rule.walkDecls((decl) => {
            if (decl.prop.startsWith('--')) {
              defaultVariables[decl.prop] = decl.value;
            }
          });
        }
      });

      let utilityStyles = {};

      root.walkRules((rule) => {
        const selector = rule.selector;

        if (
          selector.startsWith('.') &&
          !selector.includes(':') && // Exclude variants
          !selector.includes('[') && // Exclude arbitrary values
          !selector.includes('\\') // Exclude escaped characters
        ) {
          const className = selector.slice(1); // Remove the '.'

          const classVariables = { ...defaultVariables };
          const declarations = {};

          // Collect variable declarations and other declarations
          rule.walkDecls((decl) => {
            if (decl.prop.startsWith('--')) {
              classVariables[decl.prop] = decl.value;
            } else {
              declarations[decl.prop] = decl.value;
            }
          });

          // Resolve variables in declarations
          const resolvedDeclarations = {};

          for (const [prop, value] of Object.entries(declarations)) {
            let resolvedValue = value;

            // Replace variables in the value
            resolvedValue = resolvedValue.replace(/var\((--[\w-]+)\)/g, (match, varName) => {
              if (classVariables[varName] !== undefined) {
                return classVariables[varName];
              } else {
                return match; // Leave the variable as is if not found
              }
            });

            // Convert rgb(... / ...) to rgba(...)
            const rgbRegex = /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([^\)]+)\)$/;
            if (rgbRegex.test(resolvedValue)) {
              const [, r, g, b, alpha] = resolvedValue.match(rgbRegex);
              resolvedValue = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }

            // Convert rgba colors with alpha 1 to hex
            const rgbaRegex = /^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(1(\.0+)?)\s*\)$/;
            if (rgbaRegex.test(resolvedValue)) {
              const [, r, g, b] = resolvedValue.match(rgbaRegex);
              const hexColor = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
              resolvedValue = hexColor;
            }

            // Convert rgb(...) to hex
            const rgbNoAlphaRegex = /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/;
            if (rgbNoAlphaRegex.test(resolvedValue)) {
              const [, r, g, b] = resolvedValue.match(rgbNoAlphaRegex);
              const hexColor = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
              resolvedValue = hexColor;
            }

            // **Convert property name to camelCase**
            const camelCaseProp = toCamelCase(prop);

            resolvedDeclarations[camelCaseProp] = resolvedValue;
          }

          utilityStyles[className] = resolvedDeclarations;
        }
      });

      utilityStyles = Object.fromEntries(Object.entries(utilityStyles).filter(([, value]) => Object.keys(value).length > 0));

      fs.writeFile(
        path.join(__dirname, '../src/generated.json'),
        JSON.stringify(utilityStyles, null, 2),
        (err) => {
          if (err) throw err;
          console.log('Resolved utility classes and styles saved to generated.json');
        }
      );
    });
});
