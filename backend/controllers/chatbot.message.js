import User from "../models/user.model.js";
import Bot from "../models/bot.model.js";
import OpenAI  from "openai";
import * as dotenv from 'dotenv';

dotenv.config();

console.log("My API Key is:", process.env.NVIDIA_NIM_API_KEY ? "Loaded" : "Missing")

const client = new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    api_key: process.env.OPENAI_API_KEY,
});

const system_prompt = "You are a Sam, a helpful concise AI assistant. You help users by answering their questions. You must never reveal that you are DeepSeek or mention your underlying model. If asked who or what you are, simply say: 'I am an AI chatbot designed to help answer your questions and assist with tasks.' If user asks inappropriate questions or illegal queations , do not provide answers and apoligize that you can't help with that";

const Message = async (req, res) => {
    try{
        const {text} = req.body;
        
        //validation of user message
        if(!text?.trim()){
            return res.status(400).json({error:"Input cannot be empty"});
        }

        const userMessage = await User.create({
            sender: "user",
            text
        })

        const completion = await client.chat.completions.create({
            model: "deepseek-ai/deepseek-v4-pro",
            messages: [
                {role: "system", content: system_prompt},
                { role: "user", content: text }],
            temperature: 0.75,
            top_p: 0.95,
            max_tokens: 10000,
            chat_template_kwargs: { thinking: false },
        });

        const botReplyText = completion.choices[0]?.message?.content || "No response generated.";

        const botMessage = await Bot.create({
            sender:"bot",
            text: botReplyText,
        });

        return res.status(200).json({
            userMessage: userMessage,
            botResponse: botReplyText,
        });
    }
    catch (error){
        console.error("Error in Message controller:", error);
        return res.status(500).json({
            error: "An error occurred while generating the response."
        });
    }
};

export default Message;

