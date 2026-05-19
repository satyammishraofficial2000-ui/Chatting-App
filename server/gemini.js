const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCTJyIOZjSorNbb6T_sQ74KQwiEi83C18E"
});

module.exports = ai;