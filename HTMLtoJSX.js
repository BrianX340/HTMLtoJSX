function convertHtmlToJsx(htmlStr) {
    const styleRegex = /style="([^"]+)"/g;
  
    function propertyToJsonProperty(property) {
      return property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    }

    htmlStr = htmlStr.replace(styleRegex, (match, styleString) => {
      const styleObject = {};
      styleString.split(';').forEach((property) => {
        const [key, value] = property.trim().split(':');
        if (key && value) {
          styleObject[propertyToJsonProperty(key)] = value;
        }
      });
      return `style={{ ${Object.entries(styleObject)
        .map(([key, value]) => `${key}: '${value}'`)
        .join(', ')} }}`;
    });
  
    htmlStr = htmlStr.replace(/class=/g, 'className=')
      .replace(/<(\w+)>/g, '<$1 />') // Self-closing tags
      .replace(/<(\w+)>(.*?)<\/\1>/g, (match, tag, content) => {
        return `<${tag}>${content}</${tag}>`;
      });
  
    return htmlStr;
  }

function convertJsxToHtml(jsxStr) {
    if (!jsxStr || !jsxStr.trim()) {
      return "";
    }

    jsxStr = jsxStr.replace(/className=/g, "class=")
      .replace(/{{([^}]+)}}/g, (match, properties) => {
        let styleAttributes = properties.split(",");
        let styleString = "";
        for (let attribute of styleAttributes) {
          let [key, value] = attribute.trim().split(":");
          key = key.replace(/([A-Z])/g, "-$1").toLowerCase();
          styleString += `${key}: ${value.replaceAll("'", "")}; `;
        }
        return `style="${styleString}"`.replaceAll('style="', '"').replaceAll('; "', ';"');
      });
  
    return jsxStr;
}
