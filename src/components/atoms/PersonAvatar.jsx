import { cn } from "@/utils/cn"

const PersonAvatar = ({ 
  person, 
  size = "sm",
  className 
}) => {
  const sizes = {
    xs: "w-5 h-5 text-xs",
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base"
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name) => {
    const colors = [
      "bg-gradient-to-br from-primary to-primary-600",
      "bg-gradient-to-br from-secondary to-secondary-600", 
      "bg-gradient-to-br from-accent to-accent-600",
      "bg-gradient-to-br from-warning to-orange-600",
      "bg-gradient-to-br from-info to-blue-600",
      "bg-gradient-to-br from-purple-500 to-purple-600"
    ]
    
    const hash = name.split("").reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    return colors[Math.abs(hash) % colors.length]
  }

  if (!person) {
    return (
      <div className={cn(
        "rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center",
        sizes[size],
        className
      )}>
        <span className="text-gray-400 text-xs">?</span>
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center text-white font-medium shadow-sm",
      sizes[size],
      getAvatarColor(person),
      className
    )}>
      {getInitials(person)}
    </div>
  )
}

export default PersonAvatar