const MainLayout = ({children, sidebar}) => {
  return (
    <div className="max-w-7xl mx-auto px-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Area 2/3 */}
        <div className="lg:col-span-2">{children}</div>
        {/* Side Bar 1/3 */}
        <aside className="hidden lg:block">{sidebar}</aside>
    </div>
  )
}

export default MainLayout