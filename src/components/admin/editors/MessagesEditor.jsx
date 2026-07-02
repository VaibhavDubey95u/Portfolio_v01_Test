import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../context/ThemeContext';
import { portfolioService } from '../../../services/portfolioService';
import { Mail, MailOpen, Trash2, ChevronLeft, ChevronRight, Inbox, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesEditor() {
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [selectedMessage, setSelectedMessage] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['messages', page],
    queryFn: () => portfolioService.getMessages(page, pageSize),
    keepPreviousData: true,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => portfolioService.markMessageRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
    onError: () => {
      toast.error('Failed to mark message as read');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => portfolioService.deleteMessage(id),
    onSuccess: () => {
      toast.success('Message deleted');
      queryClient.invalidateQueries(['messages']);
      if (selectedMessage) setSelectedMessage(null);
    },
    onError: () => {
      toast.error('Failed to delete message');
    }
  });

  const handleMarkAsRead = (msg, e) => {
    if (e) e.stopPropagation();
    if (!msg.isRead) {
      markAsReadMutation.mutate(msg.id);
    }
  };

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      markAsReadMutation.mutate(msg.id);
    }
  };

  const closeMessage = () => {
    setSelectedMessage(null);
  };

  if (isLoading && !data) {
    return <div className="p-8 text-center text-slate-500">Loading messages...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Failed to load messages.</div>;
  }

  const messages = data?.messages || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  if (messages.length === 0 && page === 1) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
          <Inbox size={32} className={isDark ? 'text-slate-400' : 'text-slate-400'} />
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No messages received yet</h3>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} max-w-sm`}>
          Messages submitted through your public Contact form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Messages List */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-white/10 bg-dark-800' : 'border-slate-200 bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
              <tr>
                <th className="px-4 py-3 font-medium text-slate-400">Status</th>
                <th className="px-4 py-3 font-medium text-slate-400">Name</th>
                <th className="px-4 py-3 font-medium text-slate-400">Subject</th>
                <th className="px-4 py-3 font-medium text-slate-400">Date</th>
                <th className="px-4 py-3 font-medium text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {messages.map((msg) => (
                <tr 
                  key={msg.id} 
                  onClick={() => handleViewMessage(msg)}
                  className={`cursor-pointer transition-colors ${
                    !msg.isRead 
                      ? (isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-primary-50/50 hover:bg-primary-50')
                      : (isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50')
                  }`}
                >
                  <td className="px-4 py-3">
                    {msg.isRead ? (
                      <MailOpen size={16} className="text-slate-400" />
                    ) : (
                      <Mail size={16} className="text-primary-500" />
                    )}
                  </td>
                  <td className={`px-4 py-3 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {msg.name}
                    <div className={`text-xs font-normal mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {msg.email}
                    </div>
                  </td>
                  <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <div className="truncate max-w-[200px] sm:max-w-xs">
                      {msg.subject}
                    </div>
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={(e) => handleViewMessage(msg, e)}
                        className={`p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(msg.id, e)}
                        className="p-1.5 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount}
          </div>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className={`p-2 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-white/10 disabled:opacity-50 hover:bg-white/5' 
                  : 'border-slate-200 disabled:opacity-50 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className={`p-2 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-white/10 disabled:opacity-50 hover:bg-white/5' 
                  : 'border-slate-200 disabled:opacity-50 hover:bg-slate-50'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-dark-800 border border-white/10' : 'bg-white border border-slate-200'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Message Details</h3>
              <button 
                onClick={closeMessage}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto">
              <div className="mb-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>From:</span>
                <div>
                  <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{selectedMessage.name}</span>
                  <span className={`ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>&lt;{selectedMessage.email}&gt;</span>
                </div>
                
                <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date:</span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>

                <span className={`font-medium mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Subject:</span>
                <span className={`mt-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {selectedMessage.subject}
                </span>
              </div>
              
              <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <p className={`whitespace-pre-wrap leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex justify-between items-center p-4 border-t ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
              <button
                onClick={(e) => handleDelete(selectedMessage.id, e)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Delete Message
              </button>
              
              <a 
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="btn-primary px-5 py-2 text-sm"
              >
                Reply
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
