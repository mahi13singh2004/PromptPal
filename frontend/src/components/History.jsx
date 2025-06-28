import React from 'react';
import { useAuthStore } from '../store/auth.store';

const History = ({ isOpen, onClose }) => {
    const { conversationHistory, clearHistory } = useAuthStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/20 w-11/12 max-w-6xl h-5/6 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-cyan-400/30">
                    <h2 className="text-3xl font-bold text-cyan-400 font-mono tracking-wider">CONVERSATION HISTORY</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={clearHistory}
                            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-red-400/25 font-mono font-bold tracking-wider"
                        >
                            CLEAR HISTORY
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg shadow-gray-400/25 font-mono font-bold tracking-wider"
                        >
                            CLOSE
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {conversationHistory.length === 0 ? (
                        <div className="text-center text-gray-300 mt-16">
                            <div className="w-32 h-32 mx-auto mb-6 relative">
                                <div className="w-full h-full border-4 border-cyan-400/50 rounded-full animate-pulse"></div>
                                <div className="absolute inset-4 border-4 border-purple-400/50 rounded-full animate-spin-slow"></div>
                            </div>
                            <p className="text-2xl font-mono text-cyan-400 mb-4">NO CONVERSATION HISTORY</p>
                            <p className="text-lg font-mono text-gray-400">Start talking to your assistant to see the history here.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {conversationHistory.map((entry) => (
                                <div key={entry.id} className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-cyan-400/30 rounded-xl p-6 shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm text-cyan-400 font-mono">{entry.timestamp}</span>
                                        <span className="text-xs bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-3 py-1 rounded-full font-mono font-bold tracking-wider">
                                            {entry.type}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-bold text-cyan-400 mb-2 font-mono tracking-wider">USER INPUT:</h4>
                                        <div className="bg-slate-800/50 border border-cyan-400/30 rounded-lg p-4">
                                            <p className="text-gray-300 font-mono text-lg leading-relaxed">
                                                "{entry.userInput}"
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-cyan-400 mb-2 font-mono tracking-wider">ASSISTANT RESPONSE:</h4>
                                        <div className="bg-slate-800/50 border border-cyan-400/30 rounded-lg p-4">
                                            <p className="text-gray-300 font-mono text-lg leading-relaxed">
                                                "{entry.assistantResponse}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-cyan-400/30 bg-gradient-to-r from-slate-700/50 to-slate-600/50">
                    <div className="text-center">
                        <p className="text-lg text-cyan-400 font-mono tracking-wider">
                            TOTAL CONVERSATIONS: <span className="font-bold text-2xl">{conversationHistory.length}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History; 