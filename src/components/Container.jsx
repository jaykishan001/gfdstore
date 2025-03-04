import { cn } from '@/lib/utils'

const Container = ({ children, className }) => {
  return (
    <div className={cn("w-full max-w-[100vw] mx-auto overflow-hidden", className)}>
      {children}
      <span></span>
    </div>

  )
}

export default Container


// "w-screen mx-auto"
// "max-w-screen-xl mx-auto px-4