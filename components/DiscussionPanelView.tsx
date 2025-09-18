import React, { useState, useRef, useEffect } from 'react';
import type { ForumPost, Employee } from '../types';
import { XCircleIcon, SparklesIcon, PaperAirplaneIcon, ChatBubbleBottomCenterTextIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';

interface DiscussionPanelViewProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  forumPosts: ForumPost[];
  currentUser: Employee;
  onCreatePost: (title: string, content: string) => void;
  onCreateReply: (postId: string, content: string) => void;
  onGenerateSummary: () => void;
  summaryState: {
    summary: string | null;
    isLoading: boolean;
    error: string | null;
  };
}

const Post: React.FC<{ post: ForumPost, currentUser: Employee, onCreateReply: (postId: string, content: string) => void }> = ({ post, currentUser, onCreateReply }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!replyContent.trim()) return;
        onCreateReply(post.id, replyContent);
        setReplyContent('');
        setIsReplying(false);
    };

    return (
        <div className="bg-slate-900/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-telnet-yellow text-sm shrink-0">
                    {post.authorName.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-white">{post.title}</p>
                    <p className="text-xs text-slate-400">por {post.authorName} - {new Date(post.timestamp).toLocaleString()}</p>
                    <p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{post.content}</p>
                </div>
            </div>
            
            {/* Replies */}
            {post.replies.length > 0 && (
                <div className="mt-4 pl-8 space-y-3 border-l-2 border-slate-700 ml-4">
                    {post.replies.map(reply => (
                        <div key={reply.id} className="flex items-start gap-3">
                             <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center font-bold text-telnet-yellow text-xs shrink-0">
                                {reply.authorName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">
                                    <span className="font-semibold text-slate-300">{reply.authorName}</span> - {new Date(reply.timestamp).toLocaleString()}
                                </p>
                                <p className="text-sm text-slate-300 mt-1 whitespace-pre-wrap">{reply.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Form */}
            <div className="mt-4 pl-11">
                {isReplying ? (
                    <form onSubmit={handleReplySubmit}>
                        <textarea
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            placeholder="Escribe tu respuesta..."
                            className="w-full p-2 bg-slate-700 text-sm rounded-md border border-slate-600"
                            rows={2}
                        />
                        <div className="flex gap-2 mt-2">
                             <button type="submit" className="text-xs bg-telnet-yellow text-black font-semibold py-1 px-3 rounded-md">Enviar</button>
                             <button type="button" onClick={() => setIsReplying(false)} className="text-xs bg-slate-600 text-white font-semibold py-1 px-3 rounded-md">Cancelar</button>
                        </div>
                    </form>
                ) : (
                    <button onClick={() => setIsReplying(true)} className="text-xs text-telnet-yellow font-semibold">Responder</button>
                )}
            </div>
        </div>
    );
};


const DiscussionPanelView: React.FC<DiscussionPanelViewProps> = ({
  isOpen, onClose, lessonTitle, forumPosts, currentUser, onCreatePost, onCreateReply, onGenerateSummary, summaryState
}) => {
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    
    const handleCreatePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostTitle.trim() || !newPostContent.trim()) return;
        onCreatePost(newPostTitle, newPostContent);
        setNewPostTitle('');
        setNewPostContent('');
        setIsCreatingPost(false);
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div
                ref={panelRef}
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-slate-800 border-l border-slate-700 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-telnet-yellow" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Discusión de la Lección</h2>
                            <p className="text-slate-400 text-sm line-clamp-1">{lessonTitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <XCircleIcon className="w-8 h-8" />
                    </button>
                </div>
                
                {/* Summary Section */}
                <div className="p-4 border-b border-slate-700 shrink-0">
                    <button onClick={onGenerateSummary} disabled={summaryState.isLoading} className="w-full flex items-center justify-center gap-2 bg-telnet-yellow/10 hover:bg-telnet-yellow/20 text-telnet-yellow font-semibold py-2 px-3 rounded-md transition-colors disabled:opacity-50">
                        <SparklesIcon className="w-5 h-5"/>
                        {summaryState.isLoading ? 'Generando...' : 'Generar Resumen con IA'}
                    </button>
                    {summaryState.summary && (
                        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg text-sm text-slate-300">
                           <h4 className="font-bold mb-2">Resumen de la Discusión:</h4>
                           <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: window.marked.parse(summaryState.summary) }}/>
                        </div>
                    )}
                    {summaryState.error && <p className="text-red-400 text-xs mt-2 text-center">{summaryState.error}</p>}
                </div>

                {/* Posts */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {forumPosts.length > 0 ? (
                        [...forumPosts].reverse().map(post => (
                            <Post key={post.id} post={post} currentUser={currentUser} onCreateReply={onCreateReply} />
                        ))
                    ) : (
                         <div className="text-center text-slate-500 pt-16">
                            <p>Aún no hay discusiones para esta lección.</p>
                            <p className="font-semibold">¡Sé el primero en iniciar una!</p>
                        </div>
                    )}
                </div>

                {/* New Post Form */}
                <div className="p-4 border-t border-slate-700 shrink-0">
                    {isCreatingPost ? (
                        <form onSubmit={handleCreatePostSubmit}>
                            <input
                                type="text"
                                value={newPostTitle}
                                onChange={e => setNewPostTitle(e.target.value)}
                                placeholder="Título de tu pregunta o aporte"
                                className="w-full p-2 bg-slate-700 rounded-md border border-slate-600 mb-2"
                                required
                            />
                            <textarea
                                value={newPostContent}
                                onChange={e => setNewPostContent(e.target.value)}
                                placeholder="Escribe tu pregunta o comentario aquí..."
                                className="w-full p-2 bg-slate-700 rounded-md border border-slate-600"
                                rows={3}
                                required
                            />
                             <div className="flex gap-2 mt-2">
                                <button type="submit" className="bg-telnet-yellow text-black font-semibold py-2 px-4 rounded-md flex items-center gap-2"><PaperAirplaneIcon className="w-4 h-4"/> Enviar</button>
                                <button type="button" onClick={() => setIsCreatingPost(false)} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-md">Cancelar</button>
                            </div>
                        </form>
                    ) : (
                         <button onClick={() => setIsCreatingPost(true)} className="w-full bg-slate-700 hover:bg-slate-600 font-bold py-3 px-4 rounded-lg">
                            Iniciar una nueva discusión
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default DiscussionPanelView;