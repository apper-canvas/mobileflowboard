// Mock data for comments - replace with real API calls when backend is available
let mockComments = [
  {
    Id: 1,
    itemId: 1,
    content: "Initial task setup completed. @sarah.chen please review the requirements document.",
    author: {
      Id: 1,
      name: "Alex Thompson",
      email: "alex@company.com",
      avatar: null
    },
    mentions: ["sarah.chen"],
    createdAt: new Date('2024-01-10T09:30:00'),
    updatedAt: new Date('2024-01-10T09:30:00')
  },
  {
    Id: 2,
    itemId: 1,
    content: "Thanks @alex.thompson! I've reviewed and added some feedback. @mike.rodriguez can you handle the backend integration?",
    author: {
      Id: 2,
      name: "Sarah Chen",
      email: "sarah@company.com", 
      avatar: null
    },
    mentions: ["alex.thompson", "mike.rodriguez"],
    createdAt: new Date('2024-01-11T14:15:00'),
    updatedAt: new Date('2024-01-11T14:15:00')
  },
  {
    Id: 3,
    itemId: 2,
    content: "Working on the API endpoints now. Should have this ready by EOD today.",
    author: {
      Id: 3,
      name: "Mike Rodriguez",
      email: "mike@company.com",
      avatar: null
    },
    mentions: [],
    createdAt: new Date('2024-01-11T16:45:00'),
    updatedAt: new Date('2024-01-11T16:45:00')
  }
]

let nextId = 4

const commentsService = {
  // Get all comments for a specific item
  getAll: async (itemId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return mockComments
      .filter(comment => comment.itemId === parseInt(itemId))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  },

  // Get a specific comment by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const comment = mockComments.find(c => c.Id === parseInt(id))
    if (!comment) {
      throw new Error(`Comment with ID ${id} not found`)
    }
    return { ...comment }
  },

  // Create a new comment
  create: async (commentData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Extract mentions from content
    const mentionMatches = commentData.content.match(/@(\w+(?:\.\w+)*)/g) || []
    const mentions = mentionMatches.map(match => match.substring(1))
    
    const newComment = {
      Id: nextId++,
      itemId: parseInt(commentData.itemId),
      content: commentData.content.trim(),
      author: commentData.author || {
        Id: 1,
        name: "Current User",
        email: "user@company.com",
        avatar: null
      },
      mentions,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    mockComments.push(newComment)
    return { ...newComment }
  },

  // Update an existing comment
  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const commentIndex = mockComments.findIndex(c => c.Id === parseInt(id))
    if (commentIndex === -1) {
      throw new Error(`Comment with ID ${id} not found`)
    }

    // Re-extract mentions if content was updated
    let mentions = mockComments[commentIndex].mentions
    if (updateData.content) {
      const mentionMatches = updateData.content.match(/@(\w+(?:\.\w+)*)/g) || []
      mentions = mentionMatches.map(match => match.substring(1))
    }

    const updatedComment = {
      ...mockComments[commentIndex],
      ...updateData,
      mentions,
      updatedAt: new Date()
    }

    mockComments[commentIndex] = updatedComment
    return { ...updatedComment }
  },

  // Delete a comment
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const commentIndex = mockComments.findIndex(c => c.Id === parseInt(id))
    if (commentIndex === -1) {
      throw new Error(`Comment with ID ${id} not found`)
    }

    mockComments.splice(commentIndex, 1)
    return { success: true }
  },

  // Get team members for mention suggestions
  getTeamMembers: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return [
      { 
        Id: 1, 
        name: "Alex Thompson", 
        username: "alex.thompson", 
        email: "alex@company.com",
        avatar: null,
        role: "Project Manager"
      },
      { 
        Id: 2, 
        name: "Sarah Chen", 
        username: "sarah.chen", 
        email: "sarah@company.com",
        avatar: null,
        role: "Frontend Developer" 
      },
      { 
        Id: 3, 
        name: "Mike Rodriguez", 
        username: "mike.rodriguez", 
        email: "mike@company.com",
        avatar: null,
        role: "Backend Developer"
      },
      { 
        Id: 4, 
        name: "Emily Davis", 
        username: "emily.davis", 
        email: "emily@company.com",
        avatar: null,
        role: "Designer"
      },
      { 
        Id: 5, 
        name: "David Wilson", 
        username: "david.wilson", 
        email: "david@company.com",
        avatar: null,
        role: "QA Engineer"
      },
      { 
        Id: 6, 
        name: "Lisa Garcia", 
        username: "lisa.garcia", 
        email: "lisa@company.com",
        avatar: null,
        role: "DevOps Engineer"
      }
    ]
  },

  // Search comments by content
  search: async (itemId, query) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const itemComments = mockComments.filter(comment => 
      comment.itemId === parseInt(itemId)
    )
    
    if (!query.trim()) {
      return itemComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }
    
    const lowerQuery = query.toLowerCase()
    return itemComments
      .filter(comment => 
        comment.content.toLowerCase().includes(lowerQuery) ||
        comment.author.name.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  },

  // Get comments with mentions for a specific user
  getMentions: async (username) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return mockComments
      .filter(comment => comment.mentions.includes(username))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

export { commentsService }