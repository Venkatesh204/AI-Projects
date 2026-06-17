import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { GEMINI_MODEL_NAME } from '../constants';
import { AiChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { iconMap } from '../utils/iconMap';

const AiChat: React.FC = () => {
    const [messages, setMessages] = useState<AiChatMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const UserIcon = iconMap['User'];
    const BotIcon = iconMap['Bot'];
    const SendIcon = iconMap['SendHorizonal'];
    const ErrorIcon = iconMap['AlertTriangle'];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!process.env.API_KEY) {
            setError("The API_KEY environment variable is not set. This feature is disabled.");
            setMessages([{
                role: 'system-error',
                content: "I'm currently offline. Please configure the Gemini API key to enable our chat. 🔑"
            }]);
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = "You are a friendly and brilliant AI assistant specializing in linear algebra and matrix operations. Your name is 'Professor Axiom'. You explain complex concepts with clarity and provide real-world examples of how matrices are used in fields like computer graphics, data science, physics, economics, and more. Always be encouraging and make learning feel like an exciting discovery. Use markdown for formatting, including code blocks for matrices, lists, and bold text.";

        chatRef.current = ai.chats.create({
            model: GEMINI_MODEL_NAME,
            systemInstruction: systemInstruction,
        });

        setMessages([{
            role: 'model',
            content: "Hello! I'm Professor Axiom. 🤖\n\nAsk me anything about the real-world applications of matrices! For example, you could ask:\n* \"How are matrices used in video games?\"\n* \"Explain the role of matrices in data analysis.\""
        }]);

    }, []);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chatRef.current) return;
        
        setIsLoading(true);
        setError(null);
        const textToSend = userInput;
        setUserInput('');
        
        setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
        
        try {
            const result = await chatRef.current.sendMessageStream({ message: textToSend });
            
            let fullResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '', isStreaming: true }]);

            for await (const chunk of result) {
                fullResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = fullResponse;
                    return newMessages;
                });
            }

            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].isStreaming = false;
                return newMessages;
            });

        } catch (e) {
            console.error("Gemini chat error:", e);
            const errorMessage = "I seem to have encountered a temporary issue. Please try again in a moment. ⚙️";
            setError(errorMessage);
            setMessages(prev => [...prev, { role: 'system-error', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const MarkdownComponents: object = {
        p: (props: any) => <p className="mb-2 last:mb-0" {...props} />,
        ol: (props: any) => <ol className="list-decimal list-inside pl-4 mb-2" {...props} />,
        ul: (props: any) => <ul className="list-disc list-inside pl-4 mb-2" {...props} />,
        li: (props: any) => <li className="mb-1" {...props} />,
        code: (props: any) => {
            const { inline, className, children } = props;
            if (inline) {
                return <code className="bg-slate-900/70 text-yellow-300 px-1 py-0.5 rounded text-sm" {...props} />;
            }
            return <pre className="bg-slate-900/70 p-3 rounded-md overflow-x-auto custom-scrollbar my-2"><code className="text-sm" {...props}>{children}</code></pre>;
        },
        strong: (props: any) => <strong className="font-bold text-sky-300" {...props} />,
    };

    return (
        <div className="flex flex-col h-full bg-slate-800/50 rounded-lg shadow-xl overflow-hidden">
            <div className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white"><BotIcon size={20} /></div>
                        )}
                        {msg.role === 'system-error' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white"><ErrorIcon size={20} /></div>
                        )}

                        <div className={`max-w-md md:max-w-lg lg:max-w-2xl p-3 rounded-lg ${
                            msg.role === 'user' ? 'bg-yellow-500/80 text-slate-900' : 
                            msg.role === 'system-error' ? 'bg-red-800/60 text-red-200' :
                            'bg-slate-700 text-slate-200'
                        }`}>
                            <div className="prose prose-sm prose-invert max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                            {msg.isStreaming && <div className="inline-block w-2 h-2 ml-1 bg-sky-300 rounded-full animate-pulse"></div>}
                        </div>
                        
                        {msg.role === 'user' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900"><UserIcon size={20} /></div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-slate-700 bg-slate-800">
                {isLoading && (
                     <div className="text-sm text-slate-400 text-center mb-2 flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-300"></div>
                        <span>Professor Axiom is thinking...</span>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={error ? "Chat disabled" : "Ask about matrices in the real world..."}
                        className="input-field flex-grow"
                        disabled={isLoading || !!error}
                        aria-label="Your message"
                    />
                    <button type="submit" className="btn btn-primary p-3" disabled={isLoading || !userInput.trim() || !!error} aria-label="Send message">
                        <SendIcon size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AiChat;