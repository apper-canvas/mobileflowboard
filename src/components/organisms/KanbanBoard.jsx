import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import StatusPill from "@/components/atoms/StatusPill"
import PersonAvatar from "@/components/atoms/PersonAvatar"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const KanbanBoard = ({ board, onUpdateItem, onDeleteItem, onAddItem }) => {
  const [draggedItem, setDraggedItem] = useState(null)

  // Get all unique statuses from the board
  const getStatusColumns = () => {
    const statusColumn = board.columns?.find(col => col.type === "status")
    if (!statusColumn) return ["Not Started", "In Progress", "Done"]
    
    const allStatuses = new Set(["Not Started", "In Progress", "Review", "Done", "Blocked"])
    
    // Add statuses from existing items
    board.groups?.forEach(group => {
      group.items?.forEach(item => {
        const status = item.columnValues?.status
        if (status) allStatuses.add(status)
      })
    })
    
    return Array.from(allStatuses)
  }

  const statusColumns = getStatusColumns()
  
  const getItemsByStatus = (status) => {
    const items = []
    board.groups?.forEach(group => {
      group.items?.forEach(item => {
        const itemStatus = item.columnValues?.status || "Not Started"
        if (itemStatus === status) {
          items.push({ ...item, groupId: group.Id, groupTitle: group.title })
        }
      })
    })
    return items
  }

  const handleDragStart = (item) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (status) => {
    if (draggedItem && onUpdateItem) {
      onUpdateItem(draggedItem.Id, { status })
      setDraggedItem(null)
    }
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

  const renderKanbanCard = (item) => {
    const textColumn = board.columns?.find(col => col.type === "text")
    const personColumn = board.columns?.find(col => col.type === "person")
    const dateColumn = board.columns?.find(col => col.type === "date")
    const numbersColumn = board.columns?.find(col => col.type === "numbers")

    return (
      <motion.div
        key={item.Id}
        className={cn(
          "bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing",
          "hover:shadow-md transition-all duration-200 hover:-translate-y-0.5",
          draggedItem?.Id === item.Id && "dragging"
        )}
        draggable
        onDragStart={() => handleDragStart(item)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        layout
      >
        {/* Card Content */}
        <div className="space-y-3">
          {/* Main text content */}
          {textColumn && (
            <div>
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                {item.columnValues?.[textColumn.id] || "Untitled"}
              </h4>
            </div>
          )}

          {/* Group badge */}
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-fit">
            {item.groupTitle}
          </div>

          {/* Metadata row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Person */}
              {personColumn && item.columnValues?.[personColumn.id] && (
                <PersonAvatar 
                  person={item.columnValues[personColumn.id]} 
                  size="sm" 
                />
              )}
              
              {/* Numbers */}
              {numbersColumn && item.columnValues?.[numbersColumn.id] && (
                <span className="text-xs text-gray-600 font-mono">
                  {item.columnValues[numbersColumn.id]}
                </span>
              )}
            </div>

            {/* Date */}
            {dateColumn && item.columnValues?.[dateColumn.id] && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>
                  {format(new Date(item.columnValues[dateColumn.id]), "MMM d")}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-1">
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <ApperIcon name="MessageSquare" className="w-3 h-3 text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <ApperIcon name="Paperclip" className="w-3 h-3 text-gray-500" />
              </button>
            </div>
            
            <button 
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              onClick={() => onDeleteItem?.(item.Id)}
            >
              <ApperIcon name="Trash2" className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="flex space-x-6 min-w-max">
        {statusColumns.map((status) => {
          const items = getItemsByStatus(status)
          const statusColor = getStatusColor(status)
          
          return (
            <div
              key={status}
              className={cn(
                "flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4",
                draggedItem && "transition-colors duration-200"
              )}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <StatusPill status={status} />
                  <span className="text-sm font-medium text-gray-700">
                    {items.length}
                  </span>
                </div>
                
                <button className="p-1 hover:bg-white rounded transition-colors">
                  <ApperIcon name="Plus" className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Cards */}
              <div className="space-y-3 min-h-[200px]">
                <AnimatePresence>
                  {items.map((item) => renderKanbanCard(item))}
                </AnimatePresence>
                
                {/* Add card button */}
<motion.div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-primary w-full"
                    onClick={() => {
                      // Add item to first group for this status
                      const firstGroup = board.groups?.[0]
                      if (firstGroup) {
                        onAddItem?.(firstGroup.Id, { 
                          title: `New ${status} Item`,
                          status 
                        })
                      }
                    }}
                  >
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add card
                  </Button>
                </motion.div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default KanbanBoard