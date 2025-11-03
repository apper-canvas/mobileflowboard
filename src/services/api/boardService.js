import boardsData from "@/services/mockData/boards.json";
class BoardService {
  constructor() {
    this.boards = [...boardsData]
    this.nextId = Math.max(...this.boards.map(b => b.Id)) + 1
    this.nextItemId = 100 // Start item IDs from 100 to avoid conflicts
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.boards]
  }

  async getById(id) {
    await this.delay()
    const board = this.boards.find(b => b.Id === id)
    if (!board) {
      throw new Error(`Board with id ${id} not found`)
    }
    return { ...board }
  }

  async create(boardData) {
    await this.delay()
    const newBoard = {
      Id: this.nextId++,
      ...boardData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.boards.unshift(newBoard)
    return { ...newBoard }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.boards.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error(`Board with id ${id} not found`)
    }
    
    this.boards[index] = {
      ...this.boards[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.boards[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.boards.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error(`Board with id ${id} not found`)
    }
    
    const deletedBoard = this.boards.splice(index, 1)[0]
    return { ...deletedBoard }
  }

  // Item management methods
async createItem(itemData) {
    await this.delay()
    
    // Ensure required fields are present
    const title = itemData.title || `New Item ${this.nextItemId}`
    
    const newItem = {
      Id: this.nextItemId++,
      title,
      status: itemData.status || 'Not Started',
      columnValues: itemData.columnValues || {},
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Find the board and group to add the item to
    const board = this.boards.find(b => 
      b.groups?.some(g => g.Id === itemData.groupId)
    )
    
    if (board) {
      const group = board.groups.find(g => g.Id === itemData.groupId)
      if (group) {
        if (!group.items) group.items = []
        group.items.push(newItem)
        board.updatedAt = new Date().toISOString()
return newItem
      }
    }
    
    throw new Error('Group not found')
  }

  async updateItem(itemId, updates) {
    await this.delay()
    
    // Find the item across all boards and groups
    for (const board of this.boards) {
      if (board.groups) {
        for (const group of board.groups) {
          if (group.items) {
            const itemIndex = group.items.findIndex(item => item.Id === itemId)
            if (itemIndex !== -1) {
              group.items[itemIndex] = {
                ...group.items[itemIndex],
                ...updates,
                updatedAt: new Date().toISOString()
              }
              board.updatedAt = new Date().toISOString()
              return { ...group.items[itemIndex] }
            }
          }
        }
      }
    }
    
    throw new Error(`Item with id ${itemId} not found`)
  }

  async deleteItem(itemId) {
    await this.delay()
    
    // Find and delete the item across all boards and groups
    for (const board of this.boards) {
      if (board.groups) {
        for (const group of board.groups) {
          if (group.items) {
            const itemIndex = group.items.findIndex(item => item.Id === itemId)
            if (itemIndex !== -1) {
              const deletedItem = group.items.splice(itemIndex, 1)[0]
              board.updatedAt = new Date().toISOString()
              return { ...deletedItem }
            }
          }
        }
      }
}
    
    throw new Error(`Item with id ${itemId} not found`)
  }

  // Comment operations
  async getComments(itemId) {
    await this.delay()
    
    const mockComments = [
      {
        Id: 1,
        itemId: parseInt(itemId),
        content: "Initial task setup completed. @sarah.chen please review the requirements.",
        author: {
          Id: 1,
          name: "Alex Thompson",
          email: "alex@company.com",
          avatar: null
        },
        mentions: ["sarah.chen"],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        Id: 2,
        itemId: parseInt(itemId),
        content: "Thanks @alex.thompson! I've reviewed and added some feedback. @mike.rodriguez can you handle the backend integration?",
        author: {
          Id: 2,
          name: "Sarah Chen",
          email: "sarah@company.com",
          avatar: null
        },
        mentions: ["alex.thompson", "mike.rodriguez"],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        Id: 3,
        itemId: parseInt(itemId),
        content: "Working on it now. Should have this ready by EOD.",
        author: {
          Id: 3,
          name: "Mike Rodriguez",
          email: "mike@company.com",
          avatar: null
        },
        mentions: [],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ]

    return mockComments.filter(comment => comment.itemId === parseInt(itemId))
  }

  async addComment(itemId, content, authorId = 1) {
    await this.delay()
    
    // Extract mentions from content
    const mentionMatches = content.match(/@(\w+(?:\.\w+)*)/g) || []
    const mentions = mentionMatches.map(match => match.substring(1))
    
    const newComment = {
      Id: Math.floor(Math.random() * 10000) + 1000,
      itemId: parseInt(itemId),
      content,
      author: {
        Id: authorId,
        name: "Current User",
        email: "user@company.com",
        avatar: null
      },
      mentions,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return newComment
  }

  async deleteComment(commentId) {
    await this.delay()
    return { success: true }
  }

  // Get team members for mentions
  async getTeamMembers() {
    await this.delay(200)
    
    return [
      { Id: 1, name: "Alex Thompson", username: "alex.thompson", email: "alex@company.com" },
      { Id: 2, name: "Sarah Chen", username: "sarah.chen", email: "sarah@company.com" },
      { Id: 3, name: "Mike Rodriguez", username: "mike.rodriguez", email: "mike@company.com" },
      { Id: 4, name: "Emily Davis", username: "emily.davis", email: "emily@company.com" },
      { Id: 5, name: "David Wilson", username: "david.wilson", email: "david@company.com" },
      { Id: 6, name: "Lisa Garcia", username: "lisa.garcia", email: "lisa@company.com" }
    ]
  }
}

export const boardService = new BoardService()