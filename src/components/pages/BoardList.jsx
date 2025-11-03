import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import BoardCard from "@/components/molecules/BoardCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { boardService } from "@/services/api/boardService"

const BoardList = () => {
  const location = useLocation()
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const loadBoards = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await boardService.getAll()
      setBoards(data)
    } catch (err) {
      setError("Failed to load boards. Please try again.")
      console.error("Error loading boards:", err)
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
    loadBoards()
  }, [])

useEffect(() => {
    if (location.pathname === '/recent') {
      setFilter('recent')
    } else if (location.pathname === '/favorites') {
      setFilter('favorites')
    }
  }, [location.pathname])

  const handleCreateBoard = async () => {
    try {
      const newBoard = {
        name: "New Board",
        description: "A fresh board ready for your next project",
        columns: [
          { id: "item", title: "Item", type: "text", width: 200 },
          { id: "status", title: "Status", type: "status", width: 150 },
          { id: "person", title: "Person", type: "person", width: 150 },
          { id: "date", title: "Due Date", type: "date", width: 130 }
        ],
        groups: [
          {
            id: "group1",
            title: "New Group",
            color: "#0073ea",
            collapsed: false,
            items: []
          }
        ]
      }
      
      const createdBoard = await boardService.create(newBoard)
      setBoards(prev => [createdBoard, ...prev])
      toast.success("Board created successfully!")
    } catch (err) {
      toast.error("Failed to create board")
      console.error("Error creating board:", err)
    }
  }

  const filteredBoards = boards.filter(board => {
    const matchesSearch = board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (filter) {
      case "recent":
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return matchesSearch && new Date(board.updatedAt) > oneWeekAgo
      case "favorites":
        return matchesSearch && board.favorite
      default:
        return matchesSearch
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "created":
        return new Date(b.createdAt) - new Date(a.createdAt)
      case "updated":
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    }
  })

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Error
          title="Failed to Load Boards"
          message={error}
          onRetry={loadBoards}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Boards
            </h1>
            <p className="text-gray-600 mt-1">
              Organize your projects and collaborate with your team
            </p>
          </div>
          
          <Button
            onClick={handleCreateBoard}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Create Board
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              placeholder="Search boards..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="max-w-md"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filter Tabs */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              {[
                { id: "all", label: "All Boards" },
                { id: "recent", label: "Recent" },
                { id: "favorites", label: "Favorites" }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={motion(
                    "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    filter === filterOption.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="LayoutDashboard" className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 font-display">
                  {boards.length}
                </p>
                <p className="text-sm text-gray-600">Total Boards</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-accent/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 font-display">
                  {boards.reduce((acc, board) => 
                    acc + (board.groups?.reduce((groupAcc, group) => 
                      groupAcc + (group.items?.filter(item => 
                        item.columnValues?.status === "Done"
                      ).length || 0), 0) || 0), 0
                  )}
                </p>
                <p className="text-sm text-gray-600">Completed Tasks</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="w-6 h-6 text-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 font-display">
                  {boards.reduce((acc, board) => 
                    acc + (board.groups?.reduce((groupAcc, group) => 
                      groupAcc + (group.items?.filter(item => 
                        item.columnValues?.status === "In Progress"
                      ).length || 0), 0) || 0), 0
                  )}
                </p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Board Grid */}
        {filteredBoards.length === 0 ? (
          <Empty
            icon="LayoutDashboard"
            title="No boards found"
            message={searchTerm ? 
              "No boards match your search criteria. Try adjusting your search or filters." :
              "Start organizing your projects by creating your first board."
            }
            actionLabel="Create First Board"
            onAction={handleCreateBoard}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredBoards.map((board, index) => (
              <motion.div
                key={board.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BoardCard board={board} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          className="mt-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">
              Ready to boost your productivity?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start with a template or create a custom board tailored to your workflow. 
              Invite your team and begin collaborating in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleCreateBoard}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create Custom Board
              </Button>
              <Button variant="secondary">
                <ApperIcon name="FileTemplate" className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BoardList