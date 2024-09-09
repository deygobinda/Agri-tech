

function Navbar() {
  return (
    <div className="p-5 flex  justify-between  bg-bg-nav ">
        <div className="text-2xl font-bold">FalsalcareAI</div>
        <div className="flex gap-4 ">
            <button className="texl-xl font-medium  bg-orange-300 py-1  px-4 rounded-md">Login</button>
            <button className="texl-xl font-medium  bg-orange-300 py-1 px-4 rounded-md">Singup</button>
        </div>
    </div>
  )
}

export default Navbar
