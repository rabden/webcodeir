import prettier from 'prettier';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserBabel from 'prettier/parser-babel';
import { ESLint } from 'eslint';

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

export const analyzeCode = async (code, language) => {
  if (language === 'js') {
    const eslint = new ESLint();
    try {
      const results = await eslint.lintText(code);
      if (results[0].messages.length > 0) {
        const firstError = results[0].messages[0];
        return {
          message: `${firstError.message} (Line: ${firstError.line}, Column: ${firstError.column})`,
          suggestion: `Consider reviewing your code at the specified location.`
        };
      } else {
        return {
          message: 'No issues found in the JavaScript code.',
          suggestion: 'Your code looks good!'
        };
      }
    } catch (error) {
      console.error('Error analyzing JavaScript code:', error);
      return {
        message: 'An error occurred while analyzing the code.',
        suggestion: 'Please check your code for syntax errors.'
      };
    }
  } else {
    // For HTML and CSS, we'll use a simple length check as a placeholder
    // In a real-world scenario, you'd want to use more sophisticated analysis tools
    const lineCount = code.split('\n').length;
    if (lineCount > 100) {
      return {
        message: `Your ${language.toUpperCase()} code is quite long (${lineCount} lines).`,
        suggestion: 'Consider breaking it into smaller, more manageable components or files.'
      };
    } else {
      return {
        message: `No obvious issues found in your ${language.toUpperCase()} code.`,
        suggestion: 'Your code looks good, but consider having it reviewed by a peer for best practices.'
      };
    }
  }
};