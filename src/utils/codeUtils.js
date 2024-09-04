import prettier from 'prettier';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserBabel from 'prettier/parser-babel';

export const formatCode = (code, language) => {
  try {
    const parser = language === 'html' ? 'html' : language === 'css' ? 'css' : 'babel';
    const plugins = [parserHtml, parserCss, parserBabel];
    
    return prettier.format(code, {
      parser: parser,
      plugins: plugins,
      semi: true,
      singleQuote: true,
    });
  } catch (error) {
    console.error('Error formatting code:', error);
    return code;
  }
};

export const analyzeCode = (code, language) => {
  // Simple analysis based on common coding issues
  const issues = [];

  if (language === 'js') {
    // Check for common JavaScript issues
    if (code.includes('var ')) {
      issues.push('Consider using "let" or "const" instead of "var" for better scoping.');
    }
    if (code.includes('==')) {
      issues.push('Use "===" for strict equality comparisons instead of "==".');
    }
    if (code.includes('console.log')) {
      issues.push('Remember to remove console.log statements before production.');
    }
  } else if (language === 'html') {
    // Check for common HTML issues
    if (!code.toLowerCase().includes('<!doctype html>')) {
      issues.push('Add <!DOCTYPE html> declaration at the beginning of the HTML document.');
    }
    if (code.includes('<img') && !code.includes('alt=')) {
      issues.push('Ensure all <img> tags have an "alt" attribute for accessibility.');
    }
  } else if (language === 'css') {
    // Check for common CSS issues
    if (code.includes('!important')) {
      issues.push('Avoid using !important as it can lead to specificity issues.');
    }
  }

  if (issues.length === 0) {
    return {
      message: `No obvious issues found in your ${language.toUpperCase()} code.`,
      suggestion: 'Your code looks good, but consider having it reviewed by a peer for best practices.'
    };
  } else {
    return {
      message: `Found ${issues.length} potential issue(s) in your ${language.toUpperCase()} code:`,
      suggestion: issues.join(' ')
    };
  }
};