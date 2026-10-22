import { NavLink, Outlet } from "react-router-dom"


const MainLayout = () => {
  return (
    <div className="app">
        <header className="header">
            <NavLink to='/'>Главная</NavLink>
            <NavLink to='/products'>Каталог</NavLink>
            <NavLink to='/favorites'>Избранное</NavLink>
            <NavLink to='/products/new'>Создать товар</NavLink>
            <NavLink to='/cart'>Корзина</NavLink>
            <NavLink to='/about'>О нас</NavLink>
        </header>

        <main>
            <Outlet />
        </main>

        <footer>2026 Geeks Shop</footer>
    </div>
  )
}

export default MainLayout
