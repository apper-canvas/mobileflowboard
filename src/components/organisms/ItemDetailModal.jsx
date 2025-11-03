import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StatusPill from '@/components/atoms/StatusPill'
import PersonAvatar from '@/components/atoms/PersonAvatar'
import { boardService } from '@/services/api/boardService'
import { cn } from '@/utils/cn'

export default function ItemDetailModal({ item, board, onClose, onUpdateItem }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [teamMembers, setTeamMembers] = useState([])
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    loadComments()
    loadTeamMembers()
  }, [item.Id])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const loadComments = async () => {
    try {
      setLoading(true)
      const fetchedComments = await boardService.getComments(item.Id)
      setComments(fetchedComments)
    } catch (error) {
      toast.error('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const loadTeamMembers = async () => {
    try {
      const members = await boardService.getTeamMembers()
      setTeamMembers(members)
    } catch (error) {
      console.error('Failed to load team members')
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return

    try {
      setSubmitting(true)
      const comment = await boardService.addComment(item.Id, newComment.trim())
      setComments(prev => [...prev, comment])
      setNewComment('')
      toast.success('Comment added successfully')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      await boardService.deleteComment(commentId)
      setComments(prev => prev.filter(c => c.Id !== commentId))
      toast.success('Comment deleted successfully')
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  const handleTextareaChange = (e) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart
    setNewComment(value)
    setCursorPosition(cursorPos)

    // Check for @ mentions
    const textBeforeCursor = value.substring(0, cursorPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)
    
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase()
      setMentionQuery(query)
      setShowMentions(true)
      
      // Calculate mention dropdown position
      const textarea = e.target
      const rect = textarea.getBoundingClientRect()
      const textBeforeAt = textBeforeCursor.substring(0, mentionMatch.index)
      const lines = textBeforeAt.split('\n')
      const currentLine = lines.length - 1
      const charIndex = lines[currentLine].length
      
      setMentionPosition({
        top: rect.top + (currentLine * 20) + 25,
        left: rect.left + (charIndex * 8) + 10
      })
    } else {
      setShowMentions(false)
    }
  }

  const handleMentionSelect = (username) => {
    const textBeforeCursor = newComment.substring(0, cursorPosition)
    const textAfterCursor = newComment.substring(cursorPosition)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)
    
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.substring(0, mentionMatch.index)
      const newText = `${beforeMention}@${username} ${textAfterCursor}`
      setNewComment(newText)
      
      // Set cursor position after the mention
      setTimeout(() => {
        const newCursorPos = beforeMention.length + username.length + 2
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current.focus()
      }, 0)
    }
    
    setShowMentions(false)
  }

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(mentionQuery) ||
    member.username.toLowerCase().includes(mentionQuery)
  )

  const renderCommentContent = (content) => {
    // Highlight mentions in comments
    return content.replace(/@(\w+(?:\.\w+)*)/g, (match) => {
      return `<span class="bg-blue-100 text-blue-800 px-1 rounded">${match}</span>`
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      "Not Started": "gray",
      "In Progress": "blue",
      "Review": "orange",
      "Done": "green",
      "Blocked": "red",
      "On Hold": "yellow"
    }
    return colors[status] || "gray"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4"
      >
        {/* Modal Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {item.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" size={16} />
                  <span>Created {format(new Date(item.createdAt), 'MMM d, yyyy')}</span>
                </div>
                {item.dueDate && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Clock" size={16} />
                    <span>Due {format(new Date(item.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Item Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <StatusPill status={item.status} color={getStatusColor(item.status)} />
              </div>
              
              {item.assignedTo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <div className="flex items-center gap-2">
                    <PersonAvatar person={item.assignedTo} size="sm" />
                    <span className="text-sm text-gray-900">{item.assignedTo.name}</span>
                  </div>
                </div>
              )}

              {item.priority && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <StatusPill 
                    status={item.priority} 
                    color={item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'orange' : 'gray'} 
                  />
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                  {item.description}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Comments</h2>
                <span className="text-sm text-gray-500">{comments.length} comments</span>
              </div>

              {/* Comments List */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ApperIcon name="MessageCircle" size={48} className="mx-auto mb-2 text-gray-300" />
                      <p>No comments yet. Start the conversation!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <motion.div
                        key={comment.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <PersonAvatar person={comment.author} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 text-sm">
                                  {comment.author.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.Id)}
                                className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                              >
                                <ApperIcon name="Trash2" size={14} />
                              </Button>
                            </div>
                            <div 
                              className="text-sm text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: renderCommentContent(comment.content) 
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Add Comment Form */}
              <div className="relative">
                <form onSubmit={handleCommentSubmit}>
                  <div className="border border-gray-200 rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    <textarea
                      ref={textareaRef}
                      value={newComment}
                      onChange={handleTextareaChange}
                      placeholder="Add a comment... Use @username to mention team members"
                      className="w-full px-3 py-2 border-0 resize-none focus:outline-none rounded-t-lg text-sm"
                      rows={3}
                    />
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <ApperIcon name="AtSign" size={12} />
                        <span>Use @ to mention team members</span>
                      </div>
                      <Button
                        type="submit"
                        disabled={!newComment.trim() || submitting}
                        size="sm"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Posting...
                          </>
                        ) : (
                          <>
                            <ApperIcon name="Send" size={14} className="mr-2" />
                            Post Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Mention Dropdown */}
                <AnimatePresence>
                  {showMentions && filteredMembers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        position: 'fixed',
                        top: mentionPosition.top,
                        left: mentionPosition.left,
                        zIndex: 1000
                      }}
                      className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 max-h-48 overflow-y-auto min-w-48"
                    >
                      {filteredMembers.slice(0, 6).map((member) => (
                        <button
                          key={member.Id}
                          type="button"
                          onClick={() => handleMentionSelect(member.username)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <PersonAvatar person={member} size="xs" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-xs text-gray-500">@{member.username}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}