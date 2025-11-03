import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ItemDetailModal from "@/components/organisms/ItemDetailModal";
import { boardService } from "@/services/api/boardService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import BoardTable from "@/components/organisms/BoardTable";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import ViewTabs from "@/components/molecules/ViewTabs";

const BoardView = () => {
  const { boardId } = useParams()
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
const [activeView, setActiveView] = useState("table")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filters, setFilters] = useState({
    status: "",
    person: "",
    search: ""
  })

  const loadBoard = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await boardService.getById(parseInt(boardId))
      setBoard(data)
    } catch (err) {
      setError("Failed to load board. Please try again.")
      console.error("Error loading board:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (boardId) {
      loadBoard()
    }
  }, [boardId])
const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }
  const handleUpdateItem = async (itemId, updates) => {
    try {
      // Find the item across all groups
      let targetItem = null
      let targetGroupId = null
      
      board.groups?.forEach(group => {
        const item = group.items?.find(i => i.Id === itemId)
        if (item) {
          targetItem = item
          targetGroupId = group.Id
        }
      })

      if (!targetItem) return

      // Update the item
      const updatedItem = {
        ...targetItem,
        columnValues: {
          ...targetItem.columnValues,
          ...updates
        }
      }

      // Update in service
      await boardService.updateItem(itemId, updatedItem)

      // Update local state
      setBoard(prevBoard => ({
        ...prevBoard,
        groups: prevBoard.groups.map(group => ({
          ...group,
          items: group.items.map(item =>
            item.Id === itemId ? updatedItem : item
          )
        }))
      }))

      toast.success("Item updated successfully")
    } catch (err) {
      toast.error("Failed to update item")
      console.error("Error updating item:", err)
    }
  }

  const handleDeleteItem = async (itemId) => {
    try {
      await boardService.deleteItem(itemId)
      
      // Update local state
      setBoard(prevBoard => ({
        ...prevBoard,
        groups: prevBoard.groups.map(group => ({
          ...group,
          items: group.items.filter(item => item.Id !== itemId)
        }))
      }))

      toast.success("Item deleted successfully")
    } catch (err) {
      toast.error("Failed to delete item")
      console.error("Error deleting item:", err)
    }
  }

  const handleAddItem = async (groupId, defaultValues = {}) => {
    try {
      const newItem = {
        groupId: groupId,
        position: Date.now(),
        columnValues: {
          text: "New Item",
          status: "Not Started",
          ...defaultValues
        }
      }

      const createdItem = await boardService.createItem(newItem)
      
      // Update local state
      setBoard(prevBoard => ({
        ...prevBoard,
        groups: prevBoard.groups.map(group =>
          group.Id === groupId
            ? { ...group, items: [...(group.items || []), createdItem] }
            : group
        )
      }))

      toast.success("Item added successfully")
    } catch (err) {
      toast.error("Failed to add item")
      console.error("Error adding item:", err)
    }
  }

  const handleViewChange = (view) => {
    setActiveView(view)
    toast.info(`Switched to ${view} view`)
}

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleItemUpdate = (updatedItem) => {
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.Id === updatedItem.Id ? updatedItem : item
      )
    }))
    if (selectedItem && selectedItem.Id === updatedItem.Id) {
      setSelectedItem(updatedItem)
    }
  }
  if (loading) {
    return (
      <div className="flex-1 p-6">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <Error
          title="Failed to Load Board"
          message={error}
          onRetry={loadBoard}
        />
      </div>
    )
  }

  if (!board) {
    return (
      <div className="flex-1 p-6">
        <Empty
          icon="LayoutDashboard"
          title="Board Not Found"
          message="The board you're looking for doesn't exist or has been deleted."
          actionLabel="Go to Boards"
          onAction={() => window.history.back()}
        />
      </div>
    )
  }

  const hasItems = board.groups?.some(group => group.items?.length > 0)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Board Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 font-display mb-1">
{board.name}
            </h1>
            {board.description && (
              <p className="text-gray-600 text-sm">{board.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFilters}
              className={showFilters ? "bg-primary/10 text-primary" : ""}
            >
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button variant="secondary" size="sm">
              <ApperIcon name="Share" className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="mt-4">
          <ViewTabs 
            activeView={activeView} 
            onViewChange={handleViewChange}
          />
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!hasItems ? (
            <div className="flex-1 flex items-center justify-center">
              <Empty
                icon="FileText"
                title="Start adding items to your board"
                message="Create your first item to begin organizing your project and tracking progress."
                actionLabel="Add First Item"
                onAction={() => {
                  const firstGroup = board.groups?.[0]
                  if (firstGroup) {
                    handleAddItem(firstGroup.Id)
                  }
                }}
              />
            </div>
          ) : (
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-auto"
            >
{activeView === "table" && (
                <BoardTable
                  board={board}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onAddItem={handleAddItem}
                  onItemClick={handleItemClick}
                />
              )}
              
              {activeView === "kanban" && (
                <KanbanBoard
                  board={board}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onAddItem={handleAddItem}
                  onItemClick={handleItemClick}
                />
              )}
              
              {activeView === "calendar" && (
                <div className="flex-1 flex items-center justify-center">
                  <Empty
                    icon="Calendar"
                    title="Calendar View Coming Soon"
                    message="We're working on bringing you a beautiful calendar view to visualize your project timeline."
                  />
                </div>
              )}
              
              {activeView === "timeline" && (
                <div className="flex-1 flex items-center justify-center">
                  <Empty
                    icon="BarChart3"
                    title="Timeline View Coming Soon"
                    message="Timeline view will help you visualize project dependencies and track progress over time."
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Filters
              </h3>
              <button
                onClick={toggleFilters}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ApperIcon name="X" className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">All Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Person Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To
                </label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={filters.person}
                  onChange={(e) => setFilters({...filters, person: e.target.value})}
                >
                  <option value="">Anyone</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="Sarah Wilson">Sarah Wilson</option>
                </select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFilters({ status: "", person: "", search: "" })}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          </motion.div>
)}
      </div>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          board={board}
          onClose={handleCloseModal}
          onUpdateItem={handleItemUpdate}
        />
      )}
    </div>
  )
}

export default BoardView