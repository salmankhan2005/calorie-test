import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Since we are in a client-side Vite app
});

export const getAICoachResponse = async (prompt: string) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an elite AI Calorie Coach. You provide precise, scientific, and motivating nutrition advice. Use the Llama 3.3 70b model capabilities to analyze user data and provide real-time insights. Be concise but extremely helpful."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_completion_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error("Groq AI Error:", error);
        return "I'm having trouble connecting to my AI core right now. Let's try again in a moment.";
    }
};

export const generateHealthPlan = async (userData: any) => {
    const prompt = `
    Based on the following user data, generate a personalized nutrition and health plan.
    User Data:
    - Name: ${userData.fullName}
    - Age: ${userData.age}
    - Gender: ${userData.gender}
    - Goal: ${userData.goal}
    - Activity Level: ${userData.workoutFrequency}
    - Height: ${userData.height}cm
    - Weight: ${userData.weight}kg
    - Preferred Cuisine: ${userData.preferredCuisine}

    Please provide:
    1. Daily Calorie Target
    2. Macro Distribution (Protein, Carbs, Fat in grams)
    3. A brief motivational tip
    4. One custom meal suggestion based on their preferred cuisine.
    5. A detailed Diet Strategy (e.g., specific foods to avoid, timing, hydration).
    6. A weekly Workout Plan (e.g., type of exercises, frequency, intensity).
    
    Format the response as JSON so I can parse it easily.
    Example Format:
    {
      "dailyCaloriesTarget": 2200,
      "protein": 160,
      "carbs": 240,
      "fat": 70,
      "tip": "...",
      "mealSuggestion": "...",
      "dietStrategy": "Detailed nutritional guide...",
      "workoutPlan": "Detailed weekly workout routine..."
    }
  `;

    const response = await getAICoachResponse(prompt);
    try {
        // Attempt to extract JSON if the model returns extra text
        const jsonMatch = response?.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
        console.error("Failed to parse AI Health Plan:", e);
        return null;
    }
};
export const detectFoodFromImage = async (base64Image: string) => {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Identify the food in this image. Return the result in JSON format with fields: name, calories (per 100g), protein, carbs, fat, and serving (usually '100g'). Be accurate based on the visual content. If multiple items are present, identify the main one."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            model: "llama-3.2-11b-vision-preview",
            temperature: 0.1,
            max_completion_tokens: 1024,
        });

        const content = response.choices[0]?.message?.content || "";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
        console.error("Food Detection Error:", error);
        return null;
    }
};

export const searchFoodAI = async (query: string) => {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Provide nutritional data for "${query}". Return a JSON array of up to 3 similar food items. Each item must have: name, calories (per 100g), protein, carbs, fat, and serving (usually '100g'). Only return the JSON.`
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
        });

        const content = response.choices[0]?.message?.content || "";
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
        console.error("Food Search Error:", error);
        return [];
    }
};
