import * as fs from 'fs';
import * as path from 'path';
import postcss, { Rule, Declaration, Result } from 'postcss';

// Helper function to convert kebab-case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Helper function to convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
      .toUpperCase()
  );
}

// Add the unescape function
function unescapeCssIdentifier(ident: string): string {
  return ident.replace(/\\([0-9a-fA-F]{1,6} ?|.)/g, function (match, escape) {
    if (escape.length === 1) {
      return escape;
    } else {
      const codePoint = parseInt(escape.trim(), 16);
      return String.fromCodePoint(codePoint);
    }
  });
}

fs.readFile(
  path.join(__dirname, 'output.css'),
  'utf8',
  (err: NodeJS.ErrnoException | null, css: string) => {
    if (err) throw err;

    postcss()
      .process(css, { from: undefined })
      .then((result: Result) => {
        const root = result.root;

        // Collect default variables from the universal selector
        const defaultVariables: { [key: string]: string } = {};

        root.walkRules((rule: Rule) => {
          if (rule.selector === '*, ::before, ::after') {
            rule.walkDecls((decl: Declaration) => {
              if (decl.prop.startsWith('--')) {
                defaultVariables[decl.prop] = decl.value;
              }
            });
          }
        });

        let utilityStyles: { [className: string]: { [property: string]: string } } = {};

        root.walkRules((rule: Rule) => {
          const selector = rule.selector;

          if (
            selector.startsWith('.') &&
            !selector.includes(':') && // Exclude variants
            !selector.includes('[') // Exclude arbitrary values
          ) {
            const className = unescapeCssIdentifier(selector.slice(1)); // Remove the '.' and unescape

            const classVariables: { [key: string]: string } = { ...defaultVariables };
            const declarations: { [property: string]: string } = {};

            // Collect variable declarations and other declarations
            rule.walkDecls((decl: Declaration) => {
              if (decl.prop.startsWith('--')) {
                classVariables[decl.prop] = decl.value;
              } else {
                declarations[decl.prop] = decl.value;
              }
            });

            // Resolve variables in declarations
            const resolvedDeclarations: { [property: string]: string } = {};

            for (const [prop, value] of Object.entries(declarations)) {
              let resolvedValue = value;

              // Replace variables in the value
              resolvedValue = resolvedValue.replace(
                /var\((--[\w-]+)\)/g,
                (match: string, varName: string) => {
                  if (classVariables[varName] !== undefined) {
                    return classVariables[varName];
                  } else {
                    return match; // Leave the variable as is if not found
                  }
                }
              );

              // Convert rgb(... / ...) to rgba(...)
              const rgbRegex = /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([^\)]+)\)$/;
              const rgbMatch = resolvedValue.match(rgbRegex);
              if (rgbMatch) {
                const [, r, g, b, alpha] = rgbMatch;
                resolvedValue = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              }

              // Convert rgba colors with alpha 1 to hex
              const rgbaRegex =
                /^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(1(\.0+)?)\s*\)$/;
              const rgbaMatch = resolvedValue.match(rgbaRegex);
              if (rgbaMatch) {
                const [, r, g, b] = rgbaMatch;
                const hexColor = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
                resolvedValue = hexColor;
              }

              // Convert rgb(...) to hex
              const rgbNoAlphaRegex = /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/;
              const rgbNoAlphaMatch = resolvedValue.match(rgbNoAlphaRegex);
              if (rgbNoAlphaMatch) {
                const [, r, g, b] = rgbNoAlphaMatch;
                const hexColor = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
                resolvedValue = hexColor;
              }

              // Convert property name to camelCase
              const camelCaseProp = toCamelCase(prop);

              resolvedDeclarations[camelCaseProp] = resolvedValue;
            }

            utilityStyles[className] = resolvedDeclarations;
          }
        });

        // Filter out any utility styles that have no declarations
        utilityStyles = Object.fromEntries(
          Object.entries(utilityStyles).filter(([, value]) => Object.keys(value).length > 0)
        );

        fs.writeFile(
          path.join(__dirname, '../src/generated.json'),
          JSON.stringify(utilityStyles, null, 2),
          (err: NodeJS.ErrnoException | null) => {
            if (err) throw err;
            console.log('Resolved utility classes and styles saved to generated.json');
          }
        );
      });
  }
);
