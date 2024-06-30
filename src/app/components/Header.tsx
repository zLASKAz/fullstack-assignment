import Button from "./ButtonDefault"
const Header = () => {
    return (
        <header className="flex justify-between bg-[#253830]" >
            <div className='text-white items-center flex ml-8 my-4'>a Board</div>
            <Button className="mr-8 my-2.5 w-[105px]">Sign in</Button>
        </header>
    )
}
export default Header