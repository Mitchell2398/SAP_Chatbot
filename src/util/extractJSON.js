export const extractJSON = (message) => {
  // Extract the JSON text from the message
  const jsonMatch = message.match(/({[^}]+})/s);
  

  if (jsonMatch) {
    const jsonText = jsonMatch[1];

    try {
      // Parse the extracted JSON text as JSON
      const jsonData = JSON.parse(jsonText);
      console.log(jsonData);
      return jsonData;
    } catch (error) {
      console.error("Error parsing JSON: ", error);
      return;
    }
  } else {
    return;
  }
};
