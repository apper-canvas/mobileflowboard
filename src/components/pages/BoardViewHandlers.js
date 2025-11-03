import { toast } from 'react-toastify'
import { boardService } from '@/services/api/boardService'

// Enhanced handleAddItem function for BoardView
export const createAddItemHandler = (boardId, setBoard) => {
  return async (groupId, itemData = {}) => {
    try {
      const newItem = await boardService.createItem({
        groupId,
        title: itemData.title || `New Item ${Date.now()}`,
        status: itemData.status || 'Not Started',
        columnValues: itemData.columnValues || {}
      })
      
      // Update local state
      setBoard(prev => {
        if (!prev) return prev
        
        const updatedBoard = { ...prev }
        const group = updatedBoard.groups?.find(g => g.Id === groupId)
        
        if (group) {
          if (!group.items) group.items = []
          group.items.push(newItem)
          updatedBoard.updatedAt = new Date().toISOString()
        }
        
        return updatedBoard
      })
      
      toast.success('Item added successfully!')
      
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error('Failed to add item. Please try again.')
    }
  }
}